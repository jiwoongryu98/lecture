import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import ts from 'typescript-ast';
import type { SlideDefinition, SlideMetadata } from '../shared/presentation';

export const projectRoot = import.meta.dirname ? resolve(import.meta.dirname, '..') : process.cwd();

export function readCatalog(root = projectRoot): SlideDefinition[] {
  const directory = join(root, 'content/slides');
  const files = readdirSync(directory).filter((file) => file.endsWith('.tsx')).sort();
  if (!files.length) throw new Error('Slide catalog: no slides found');
  const ids = new Set<string>();
  return files.map((file, index) => {
    const number = String(index + 1).padStart(3, '0');
    const fail = (message: string): never => { throw new Error(`Slide catalog (${file}): ${message}`); };
    if (file !== `${number}.tsx`) fail(`expected ${number}.tsx; use contiguous three-digit numbers`);
    for (const required of [join(directory, `${number}.css`)]) {
      if (!existsSync(required)) fail(`missing ${required}`);
    }
    const source = ts.createSourceFile(file, readFileSync(join(directory, file), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    let object: ts.Expression | undefined;
    let hasDefault = false;
    for (const statement of source.statements) {
      if (ts.isExportAssignment(statement) && !statement.isExportEquals) hasDefault = true;
      if (ts.canHaveModifiers(statement) && ts.getModifiers(statement)?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)) hasDefault = true;
      if (!ts.isVariableStatement(statement) || !statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) continue;
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.name.text === 'metadata') {
          if (object) fail('duplicate metadata export');
          object = declaration.initializer;
        }
      }
    }
    if (!hasDefault) fail('default slide component export required');
    while (object && (ts.isSatisfiesExpression(object) || ts.isAsExpression(object) || ts.isParenthesizedExpression(object))) object = object.expression;
    if (!object || !ts.isObjectLiteralExpression(object)) fail('metadata must be an exported literal object');
    const values: Record<string, string | number> = {};
    for (const property of (object as ts.ObjectLiteralExpression).properties) {
      if (!ts.isPropertyAssignment(property) || !(ts.isIdentifier(property.name) || ts.isStringLiteral(property.name))) fail('metadata properties must be explicit literal values');
      const assignment = property as ts.PropertyAssignment;
      const name = (assignment.name as ts.Identifier | ts.StringLiteral).text;
      if (!['id', 'title', 'section', 'subsection', 'maxStep'].includes(name)) fail(`unknown metadata property ${name}`);
      const value = assignment.initializer;
      if (name in values) fail(`duplicate metadata property ${name}`);
      if (ts.isStringLiteral(value)) values[name] = value.text;
      else if (ts.isNumericLiteral(value)) values[name] = Number(value.text);
      else fail(`metadata.${name} must be a string or number literal`);
    }
    for (const name of ['id', 'title', 'section']) if (typeof values[name] !== 'string' || !(values[name] as string).trim()) fail(`metadata.${name} must be a nonempty string`);
    if (!/^[a-z][a-z0-9-]*$/.test(String(values.id))) fail('invalid stable slide ID');
    if (values.subsection !== undefined && typeof values.subsection !== 'string') fail('metadata.subsection must be a string');
    if (typeof values.maxStep !== 'number' || !Number.isSafeInteger(values.maxStep) || values.maxStep < 0) fail('metadata.maxStep must be a nonnegative integer');
    const metadata: SlideMetadata = { id: values.id as string, title: values.title as string, section: values.section as string, subsection: values.subsection as string | undefined, maxStep: values.maxStep as number };
    if (ids.has(metadata.id)) fail(`duplicate ID ${metadata.id}`);
    ids.add(metadata.id);
    const notePath = join(root, 'notes', `${number}.md`);
    if (existsSync(notePath) && !/^# [^\r\n]+/u.test(readFileSync(notePath, 'utf8'))) fail('note must start with a title heading');
    return { ...metadata, subsection: metadata.subsection ?? '', number };
  });
}
