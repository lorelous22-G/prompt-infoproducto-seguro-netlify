import crypto from 'node:crypto';
import { getStore } from '@netlify/blobs';

const STORE = 'ritos-entitlements';
export const normalizeEmail = (value) => String(value || '').trim().toLowerCase();
export const entitlementKey = (email) => crypto.createHash('sha256').update(normalizeEmail(email)).digest('hex');

function store() { return getStore({ name: STORE, consistency: 'strong' }); }

export async function getEntitlement(email) {
  return store().get(`buyer:${entitlementKey(email)}`, { type: 'json' });
}

export async function grantEntitlement({ email, name = '', transaction = '', product = 'ritos-del-alma' }) {
  const normalized = normalizeEmail(email);
  if (!normalized.includes('@')) throw new Error('buyer_email_invalid');
  const now = new Date().toISOString();
  const record = { status: 'active', email: normalized, name, transaction, product, grantedAt: now, updatedAt: now };
  await store().set(`buyer:${entitlementKey(normalized)}`, JSON.stringify(record));
  return record;
}

export async function revokeEntitlement({ email, transaction = '' }) {
  const existing = await getEntitlement(email);
  if (!existing) return null;
  const record = { ...existing, status: 'revoked', transaction: transaction || existing.transaction, updatedAt: new Date().toISOString() };
  await store().set(`buyer:${entitlementKey(email)}`, JSON.stringify(record));
  return record;
}

export function hasActiveEntitlement(record) { return record?.status === 'active'; }
