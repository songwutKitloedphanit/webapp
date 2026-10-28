import assert from 'node:assert/strict';
import test from 'node:test';
import {
  parseBoolean,
  parseEmail,
  parseMenuName,
  parsePassword,
  parsePositiveId,
  parsePrice,
  parseRole,
  parseScore,
  parseTypeName,
  parseUserName,
} from './validation.js';

test('parsePositiveId accepts positive integer IDs', () => {
  assert.equal(parsePositiveId('17'), 17);
  assert.equal(parsePositiveId(42), 42);
});

test('parsePositiveId rejects malformed or unsafe IDs', () => {
  for (const value of ['0', '-2', '1.5', '1e2', 'abc', '9007199254740992', null]) {
    assert.equal(parsePositiveId(value), null, `expected ${String(value)} to be rejected`);
  }
});

test('parseMenuName trims whitespace and enforces the menu column length', () => {
  assert.equal(parseMenuName('  Pad Thai  '), 'Pad Thai');
  assert.equal(parseMenuName('x'.repeat(150)), 'x'.repeat(150));
  assert.equal(parseMenuName('x'.repeat(151)), null);
});

test('parseTypeName trims whitespace and enforces the type column length', () => {
  assert.equal(parseTypeName('  Noodles  '), 'Noodles');
  assert.equal(parseTypeName('x'.repeat(100)), 'x'.repeat(100));
  assert.equal(parseTypeName('x'.repeat(101)), null);
});

test('parsePrice normalizes valid decimal values to two places', () => {
  assert.equal(parsePrice('45'), '45.00');
  assert.equal(parsePrice('45.5'), '45.50');
  assert.equal(parsePrice(45.55), '45.55');
  assert.equal(parsePrice('99999999.99'), '99999999.99');
});

test('parsePrice rejects invalid decimal values', () => {
  for (const value of ['', '-1', '1.234', '100000000', '1e2', null]) {
    assert.equal(parsePrice(value), null, `expected ${String(value)} to be rejected`);
  }
});

test('parseBoolean accepts only boolean values', () => {
  assert.equal(parseBoolean(true), true);
  assert.equal(parseBoolean(false), false);
  assert.equal(parseBoolean('true'), null);
});

test('parseUserName trims names and allows only safe characters', () => {
  assert.equal(parseUserName('  ann_01  '), 'ann_01');
  for (const value of ['ab', 'x'.repeat(51), 'ann smith', '<script>', 42]) {
    assert.equal(parseUserName(value), null, `expected ${String(value)} to be rejected`);
  }
});

test('parseEmail normalizes case and rejects malformed addresses', () => {
  assert.equal(parseEmail(' Ann@Gmail.com '), 'ann@gmail.com');
  for (const value of ['ann', 'ann@', 'ann@gmail', 'a b@gmail.com', null]) {
    assert.equal(parseEmail(value), null, `expected ${String(value)} to be rejected`);
  }
});

test('parsePassword enforces 8 characters and the 72-byte bcrypt limit', () => {
  assert.equal(parsePassword('12345678'), '12345678');
  assert.equal(parsePassword('1234567'), null);
  assert.equal(parsePassword('x'.repeat(73)), null);
  assert.equal(parsePassword('ก'.repeat(25)), null);
});

test('parseRole and parseScore accept only allowed values', () => {
  assert.equal(parseRole('admin'), 'admin');
  assert.equal(parseRole('user'), 'user');
  assert.equal(parseRole('owner'), null);
  assert.equal(parseScore(1), 1);
  assert.equal(parseScore(5), 5);
  for (const value of [0, 6, 3.5, '4', null]) {
    assert.equal(parseScore(value), null, `expected ${String(value)} to be rejected`);
  }
});
