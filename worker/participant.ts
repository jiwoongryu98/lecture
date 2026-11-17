import { ProtocolError, record } from '../shared/protocol';
import { verifyKey } from './auth';

const maxAge = 60 * 60 * 24 * 30;

function cookie(request: Request, name: string) {
  const raw = request.headers.get('Cookie')?.split(';').find((part) => part.trim().startsWith(`${name}=`));
  if (!raw) return '';
  try { return decodeURIComponent(raw.trim().slice(name.length + 1)); } catch { return ''; }
}

export async function participantAccess(request: Request, env: Env) {
  const password = cookie(request, 'comment_password');
  if (!password || !env.COMMENT_PASSWORD) return null;
  try { return { name: cookie(request, 'comment_name').trim() || null, authorizedKeyHash: await verifyKey(password, env.COMMENT_PASSWORD) }; }
  catch (error) { if (error instanceof ProtocolError) return null; throw error; }
}

export async function presenterAccess(request: Request, env: Env) {
  const key = cookie(request, 'presenter_key');
  if (!key || !env.PRESENTER_KEY) return null;
  try { return { name: '발표자', authorizedKeyHash: await verifyKey(key, env.PRESENTER_KEY) }; }
  catch (error) { if (error instanceof ProtocolError) return null; throw error; }
}

export async function enterParticipant(request: Request, env: Env) {
  if (request.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405, headers: { Allow: 'POST' } });
  const headers = new Headers({ 'Cache-Control': 'no-store' });
  try {
    if (request.headers.get('Origin') && request.headers.get('Origin') !== new URL(request.url).origin) {
      return Response.json({ error: 'Origin not allowed' }, { status: 403, headers });
    }
    if (!request.headers.get('Content-Type')?.startsWith('application/json')) throw new ProtocolError('BAD_REQUEST', 'JSON required');
    // Read a bounded credential request.
    const reader = request.body?.getReader();
    if (!reader) throw new ProtocolError('BAD_REQUEST', 'Password required');
    const chunks: Uint8Array[] = []; let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 8192) { await reader.cancel(); throw new ProtocolError('BAD_REQUEST', 'Request too large'); }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    let data: unknown;
    try { data = JSON.parse(new TextDecoder().decode(bytes)); }
    catch { throw new ProtocolError('BAD_REQUEST', 'Invalid JSON'); }
    if (!record(data)) throw new ProtocolError('BAD_REQUEST', 'Credentials required');
    const suffix = `; Path=/api; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`;
    if (data.role === 'presenter') {
      if (typeof data.key !== 'string' || !data.key.trim() || data.key.length > 512) throw new ProtocolError('BAD_REQUEST', 'Presenter key required');
      const key = data.key.trim();
      await verifyKey(key, env.PRESENTER_KEY);
      headers.append('Set-Cookie', `presenter_key=${encodeURIComponent(key)}${suffix}`);
      return Response.json({ name: '발표자' }, { headers });
    }
    if (typeof data.name !== 'string' || !data.name.trim()) throw new ProtocolError('BAD_REQUEST', 'Name required');
    const password = data.password === undefined ? cookie(request, 'comment_password') : typeof data.password === 'string' ? data.password.trim() : '';
    if (!password || password.length > 512) throw new ProtocolError('BAD_REQUEST', 'Password required');
    await verifyKey(password, env.COMMENT_PASSWORD);
    const name = data.name.trim();
    headers.append('Set-Cookie', `comment_name=${encodeURIComponent(name)}${suffix}`);
    headers.append('Set-Cookie', `comment_password=${encodeURIComponent(password)}${suffix}`);
    return Response.json({ name, passwordSaved: true }, { headers });
  } catch (error) {
    const expected = error instanceof ProtocolError;
    return Response.json({ error: expected ? error.message : 'Could not enable posting' }, {
      status: expected ? (error.code === 'UNAUTHORIZED' ? 401 : error.code === 'BAD_REQUEST' ? 400 : 503) : 503, headers,
    });
  }
}
