import { readFile, writeFile, appendFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';

const path = new URL('../.dev.vars', import.meta.url);
let content = '';
let exists = false;
try { content = await readFile(path, 'utf8'); exists = true; }
catch (error) { if (error.code !== 'ENOENT') throw error; }
for (const key of ['PRESENTER_KEY', 'COMMENT_PASSWORD']) {
  const current = content.match(new RegExp(`^[ \\t]*${key}[ \\t]*=[ \\t]*([^\\r\\n]*)`, 'm'))?.[1]?.trim().replace(/^['"]|['"]$/g, '');
  if (current) {
    console.log(`Local ${key} is already configured.`);
  } else {
    const line = `\n${key}=${randomBytes(32).toString('hex')}\n`;
    if (exists) await appendFile(path, line, { mode: 0o600 });
    else { await writeFile(path, line, { mode: 0o600, flag: 'wx' }); exists = true; }
    console.log(`Created ${key} in .dev.vars; keep it private.`);
  }
}
