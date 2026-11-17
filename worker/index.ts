export { LectureSession } from './session';
import { enterParticipant } from './participant';
import { presenterNotes } from './notes';

function json(data: unknown, status = 200, extra: Record<string, string> = {}) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', ...extra } });
}

async function health(env: Env) {
  const results = await Promise.allSettled([
    env.DB.prepare('SELECT 1 AS ready').first<{ ready: number }>().then((row) => {
      if (row?.ready !== 1) throw new Error('D1 unavailable');
    }),
    env.LECTURE_SESSIONS.getByName('presentation').getReadiness().then((result) => {
      if (!result.ready) throw new Error('Lecture storage unavailable');
    }),
  ]);
  const ready = results.every((result) => result.status === 'fulfilled');
  if (!ready) console.error(JSON.stringify({ event: 'health_dependency_failed' }));
  return json({ status: ready ? 'ready' : 'unavailable', checks: {
    worker: 'ready', d1: results[0].status === 'fulfilled' ? 'ready' : 'unavailable',
    lectureSession: results[1].status === 'fulfilled' ? 'ready' : 'unavailable',
  } }, ready ? 200 : 503);
}

export default {
  async fetch(request, env) {
    try {
      const { pathname } = new URL(request.url);
      if (pathname === '/api/health') {
        if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405, { Allow: 'GET' });
        return await health(env);
      }
      if (pathname === '/api/participation') return await enterParticipant(request, env);
      if (pathname.startsWith('/api/notes/')) return await presenterNotes(request, env, pathname.slice('/api/notes/'.length));
      if (pathname === '/api/live') {
        if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405, { Allow: 'GET' });
        if (request.headers.get('Origin') && request.headers.get('Origin') !== new URL(request.url).origin) return json({ error: 'Origin not allowed' }, 403);
        if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') return json({ error: 'WebSocket upgrade required' }, 426);
        return await env.LECTURE_SESSIONS.getByName('presentation').fetch(request);
      }
      if (pathname === '/api' || pathname.startsWith('/api/')) return json({ error: 'Not found' }, 404);
      return env.ASSETS.fetch(request);
    } catch {
      console.error(JSON.stringify({ event: 'api_request_failed' }));
      return json({ error: 'Service unavailable. Please try again.' }, 503);
    }
  },
} satisfies ExportedHandler<Env>;
