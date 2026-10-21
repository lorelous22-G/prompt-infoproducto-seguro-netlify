import { existsSync, statSync } from 'node:fs';
const required = [
  'site/index.html', 'site/login.html', 'site/auth.js', 'site/_redirects', 'site/portal/index.html',
  'site/read/rituales.html', 'site/read/preparacion.html', 'site/read/cartas.html', 'site/read/terapeutica.html',
  'netlify/functions/identity-login.mts', 'netlify/functions/identity-signup.mts', 'netlify/functions/hotmart-webhook.mts',
  'netlify/functions/ebook.mts', 'netlify/functions/upload-ebook.mts'
];
for (const file of required) { if (!existsSync(file)) throw new Error(`Missing: ${file}`); }
console.log(`Build verification passed (${required.length} protected resources present).`);
