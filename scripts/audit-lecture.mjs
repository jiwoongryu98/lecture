import { readdir, readFile } from 'node:fs/promises';
import { readCatalog } from '../build/catalog.ts';
const slides = readCatalog();

// A read-only check extracted from the repeated slide/notes checks used while
// authoring this lecture. Run with Node 22.18+ from any working directory.
const notesDirectory = new URL('../notes/', import.meta.url);
const noteFiles = (await readdir(notesDirectory).catch((error) => {
  if (error.code === 'ENOENT') return [];
  throw error;
})).filter((file) => /^\d{3}\.md$/.test(file)).sort();
const expectedFiles = new Set();
const seenIds = new Set();
const errors = [];

for (const [index, slide] of slides.entries()) {
  const number = String(index + 1).padStart(3, '0');
  const file = `${number}.md`;
  expectedFiles.add(file);
  if (seenIds.has(slide.id)) errors.push(`중복된 슬라이드 ID: ${slide.id}`);
  seenIds.add(slide.id);

  if (!noteFiles.length) continue;

  let note;
  try { note = await readFile(new URL(file, notesDirectory), 'utf8'); }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    errors.push(`발표 노트 없음: ${file} (${slide.id})`);
    continue;
  }

  if (!/^# [^\r\n]+/u.test(note)) errors.push(`노트 제목 확인: ${file}`);

}

for (const file of noteFiles) {
  if (!expectedFiles.has(file)) errors.push(`슬라이드 순서에 없는 발표 노트: ${file}`);
}

console.log('강의 자료 점검');
console.log(`슬라이드 ${slides.length}장 · 발표 노트 ${noteFiles.length}개`);
if (errors.length) {
  errors.forEach((error) => console.error(`확인 필요: ${error}`));
  process.exitCode = 1;
} else {
  console.log('슬라이드 ID 중복: 없음');
  console.log('노트 번호·슬라이드 연결: 이상 없음');
}
console.log(noteFiles.length ? '노트 위치: notes/ (비공개 로컬 파일)' : '발표 노트: 로컬 파일이 없어 점검 생략');
