import { grantBuyerRole } from '../lib/legacy-identity-hook.mjs';
export default async (request: Request) => {
  try { return Response.json(await grantBuyerRole(await request.json())); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : 'payload_malformed' }, { status: 400 }); }
};
