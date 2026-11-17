import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { readCatalog } from '../build/catalog';
import { createDeckRules, groupSections } from '../shared/presentation';

const roots: string[] = [];
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'lecture-catalog-')); roots.push(root);
  mkdirSync(join(root, 'content/slides'), { recursive: true }); mkdirSync(join(root, 'notes'));
  add(root, '001', 'first', 'Section A'); add(root, '002', 'second', 'Section B');
  return root;
}
function add(root: string, number: string, id: string, section: string, extra = '') {
  writeFileSync(join(root, `content/slides/${number}.tsx`), `import './${number}.css';\nexport default function Slide() { return <div />; }\nexport const metadata = { id: '${id}', title: 'Title', section: '${section}', subsection: 'Topic', maxStep: 2 ${extra} } satisfies Record<string, unknown>;`);
  writeFileSync(join(root, `content/slides/${number}.css`), '');
  writeFileSync(join(root, `notes/${number}.md`), '# Title\nSpeaker guidance.\n');
}
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });

it('discovers order and sections from slide exports without evaluating slide code', () => {
  const root = fixture();
  const path = join(root, 'content/slides/001.tsx');
  writeFileSync(path, `throw new Error('Never execute slide modules on the server');\n${readFileSync(path, 'utf8')}`);
  const catalog = readCatalog(root);
  expect(catalog.map((slide) => [slide.number, slide.id])).toEqual([['001', 'first'], ['002', 'second']]);
  expect(groupSections(catalog).map((section) => section.title)).toEqual(['Section A', 'Section B']);
  expect(createDeckRules(catalog).move({ index: 1, step: 2 }, 1)).toEqual({ index: 2, step: 0 });
});

it('loads a public checkout without private speaker notes', () => {
  const root = fixture();
  rmSync(join(root, 'notes'), { recursive: true });
  expect(readCatalog(root).map((slide) => slide.id)).toEqual(['first', 'second']);
});

it.each(['numbering', 'duplicate ID', 'missing CSS', 'invalid metadata', 'dynamic metadata', 'missing note title'])(
  'rejects %s with an actionable catalog error', (kind) => {
    const root = fixture();
    if (kind === 'numbering') add(root, '004', 'fourth', 'Section C');
    if (kind === 'duplicate ID') add(root, '002', 'first', 'Section B');
    if (kind === 'missing CSS') unlinkSync(join(root, 'content/slides/002.css'));
    if (kind === 'invalid metadata') { const file = join(root, 'content/slides/002.tsx'); writeFileSync(file, readFileSync(file, 'utf8').replace('maxStep: 2', 'maxStep: 0.5')); }
    if (kind === 'dynamic metadata') writeFileSync(join(root, 'content/slides/002.tsx'), 'export default () => null; export const metadata = getMetadata();');
    if (kind === 'missing note title') writeFileSync(join(root, 'notes/002.md'), 'Speaker guidance.');
    expect(() => readCatalog(root)).toThrow(/Slide catalog \(/);
  },
);
