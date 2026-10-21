import { init, handleAuthCallback, oauthLogin, login, logout, signup } from 'https://cdn.jsdelivr.net/npm/@netlify/identity@2.0.0/+esm';

init();

export async function start() {
  try { await handleAuthCallback(); } catch (_) { /* no hay callback pendiente */ }
}

export { oauthLogin, login, logout, signup };

export function hasBuyerRole(user) {
  return Boolean(user?.app_metadata?.roles?.includes('buyer'));
}
