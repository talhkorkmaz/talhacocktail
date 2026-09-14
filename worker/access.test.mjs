import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPair, SignJWT } from 'jose';
import { verifyOwner, authenticatedRequest } from './access.ts';

const { privateKey, publicKey } = await generateKeyPair('RS256');
const settings = { ACCESS_TEAM_DOMAIN: 'test-team.cloudflareaccess.com', ACCESS_AUD: 'test-audience' };
const now = Math.floor(Date.now() / 1000);
async function token(changes = {}, signingKey = privateKey) {
  return new SignJWT({ sub: 'owner-id', email: 'talhkorkmaz@gmail.com',
    iss: 'https://test-team.cloudflareaccess.com', aud: 'test-audience', exp: now + 600, ...changes })
    .setProtectedHeader({ alg: 'RS256' }).sign(signingKey);
}
test('accepts a correctly signed owner token', async () => {
  assert.deepEqual(await verifyOwner(await token(), settings, async () => publicKey),
    { sub: 'owner-id', email: 'talhkorkmaz@gmail.com' });
});
for (const [label, changes] of Object.entries({
  expired: { exp: now - 60 }, wrongAudience: { aud: 'other' }, wrongIssuer: { iss: 'https://evil.example' },
  otherUser: { email: 'someone@example.com' }, missingExpiry: { exp: undefined },
  notYetValid: { nbf: now + 600 }, missingIdentity: { sub: undefined },
})) test(`rejects ${label}`, async () => {
  assert.equal(await verifyOwner(await token(changes), settings, async () => publicKey), null);
});
test('rejects a forged signature', async () => {
  const other = await generateKeyPair('RS256');
  assert.equal(await verifyOwner(await token({}, other.privateKey), settings, async () => publicKey), null);
});
test('missing Access configuration denies identity', async () => {
  assert.equal(await verifyOwner(await token(), {}, async () => publicKey), null);
});
test('removes forged Sites headers while preserving request content', async () => {
  const input = new Request('https://example.com/api/menu', { method: 'PUT',
    headers: { 'oai-authenticated-user-id': 'local_seedy', 'oai-authenticated-user-email': 'talhkorkmaz@gmail.com',
      origin: 'https://example.com' }, body: '{"test":true}' });
  const result = await authenticatedRequest(input, settings);
  assert.equal(result.owner, null);
  assert.equal(result.request.headers.get('oai-authenticated-user-email'), null);
  assert.equal(result.request.headers.get('oai-authenticated-user-id'), null);
  assert.equal(result.request.headers.get('origin'), 'https://example.com');
  assert.equal(await result.request.text(), '{"test":true}');
});
