import { getEntitlement, hasActiveEntitlement, normalizeEmail } from './entitlements.mjs';

export async function grantBuyerRole(payload) {
  const user = payload?.user || payload?.payload?.user;
  if (!user) throw new Error('user_missing');
  const email = normalizeEmail(user.email);
  const entitlement = await getEntitlement(email);
  if (!hasActiveEntitlement(entitlement)) return {};
  const metadata = user.app_metadata || user.appMetadata || {};
  const roles = Array.from(new Set([...(metadata.roles || []), 'buyer']));
  return { app_metadata: { ...metadata, roles } };
}
