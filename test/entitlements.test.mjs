import test from 'node:test';
import assert from 'node:assert/strict';
import { entitlementKey, normalizeEmail, hasActiveEntitlement } from '../netlify/lib/entitlements.mjs';

test('normaliza el email antes de crear el identificador privado', () => {
  assert.equal(normalizeEmail('  LORENA@EXAMPLE.COM '), 'lorena@example.com');
  assert.equal(entitlementKey('LORENA@example.com'), entitlementKey('lorena@example.com'));
  assert.notEqual(entitlementKey('a@example.com'), entitlementKey('b@example.com'));
});

test('solo los derechos activos habilitan la biblioteca', () => {
  assert.equal(hasActiveEntitlement({ status: 'active' }), true);
  assert.equal(hasActiveEntitlement({ status: 'revoked' }), false);
  assert.equal(hasActiveEntitlement(null), false);
});
