import { ProtocolError } from '../shared/protocol';
export async function keyHash(key: string) {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(key));
}
export async function verifyKey(provided: string, expected: string) {
  if (!expected) throw new ProtocolError('UNAVAILABLE', 'Access is not configured');
  const [a, b] = await Promise.all([keyHash(provided), keyHash(expected)]);
  if (!crypto.subtle.timingSafeEqual(a, b)) throw new ProtocolError('UNAUTHORIZED', 'Invalid access key');
  return b;
}
