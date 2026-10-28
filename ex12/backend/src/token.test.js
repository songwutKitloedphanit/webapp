import assert from 'node:assert/strict';
import test from 'node:test';
import jwt from 'jsonwebtoken';
import { readBearerToken, readUserId, signToken } from './token.js';

process.env.JWT_KEY = 'test-secret-key';

test('readBearerToken accepts only Bearer headers with a token', () => {
  assert.equal(readBearerToken('Bearer abc.def'), 'abc.def');
  for (const value of [undefined, '', 'Bearer', 'Bearer null', 'Basic abc', 'abc']) {
    assert.equal(readBearerToken(value), null, `expected ${String(value)} to be rejected`);
  }
});

test('signToken creates a token that readUserId can read back', () => {
  assert.equal(readUserId(signToken(7)), 7);
});

test('readUserId rejects tokens that are expired, tampered, or signed with another key', () => {
  const expired = jwt.sign({ userId: 7 }, 'test-secret-key', { expiresIn: -10 });
  const otherKey = jwt.sign({ userId: 7 }, 'other-key');
  const tampered = signToken(7).slice(0, -2) + 'xx';
  const noUser = jwt.sign({ role: 'admin' }, 'test-secret-key');

  for (const token of [expired, otherKey, tampered, noUser, 'not-a-token']) {
    assert.equal(readUserId(token), null);
  }
});

test('missing JWT_KEY is reported instead of signing with an empty key', (t) => {
  const savedKey = process.env.JWT_KEY;
  delete process.env.JWT_KEY;
  t.after(() => {
    process.env.JWT_KEY = savedKey;
  });
  assert.throws(() => signToken(1), /Missing JWT_KEY/);
});
