/// <reference types="vite/client" />
import { slides } from '../shared/deck';
import { presenterAccess } from './participant';

// Bundle the authoring files in the Worker, not in public viewer assets.
const notes = import.meta.glob<string>('../notes/*.md', { query: '?raw', import: 'default', eager: true });

export async function presenterNotes(request: Request, env: Env, rawIndex: string) {
  const headers = { 'Cache-Control': 'no-store' };
  if (request.method !== 'GET') return Response.json({ error: 'Method not allowed' }, { status: 405, headers: { ...headers, Allow: 'GET' } });
  if (!await presenterAccess(request, env)) return Response.json({ error: 'Presenter access required' }, { status: 401, headers });
  const index = /^\d+$/.test(rawIndex) ? Number(rawIndex) : 0;
  const slide = slides[index - 1];
  const markdown = slide ? notes[`../notes/${slide.number}.md`] : undefined;
  if (markdown === undefined) return Response.json({ error: 'Notes not found' }, { status: 404, headers });
  return new Response(markdown, { headers: { ...headers, 'Content-Type': 'text/markdown; charset=utf-8' } });
}
