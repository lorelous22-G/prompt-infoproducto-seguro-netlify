import crypto from 'node:crypto';
import { grantEntitlement, revokeEntitlement } from '../lib/entitlements.mjs';

const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a || ''); const right = Buffer.from(b || '');
  return left.length === right.length && crypto.timingSafeEqual(left, right);
};
const productId = (data: any) => String(data?.product?.id || data?.purchase?.product?.id || data?.product?.ucode || '');

export default async (request: Request) => {
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  const expected = process.env.HOTMART_HOTTOK;
  if (!expected || !safeEqual(request.headers.get('x-hotmart-hottok') || '', expected)) return new Response('Unauthorized', { status: 401 });
  const body: any = await request.json().catch(() => null);
  const data = body?.data || body;
  const expectedProduct = process.env.HOTMART_PRODUCT_ID || '8774493';
  if (productId(data) !== expectedProduct) return new Response('Unexpected product', { status: 422 });
  const email = data?.buyer?.email;
  const transaction = String(data?.purchase?.transaction || data?.purchase?.order_id || '');
  const status = String(data?.purchase?.status || body?.event || '').toUpperCase();
  if (!email) return new Response('Buyer missing', { status: 422 });
  if (['APPROVED', 'PURCHASE_APPROVED'].includes(status)) await grantEntitlement({ email, name: data?.buyer?.name || '', transaction });
  else if (['REFUNDED', 'CHARGEBACK', 'CANCELLED', 'PURCHASE_REFUNDED', 'PURCHASE_CHARGEBACK', 'PURCHASE_CANCELED'].includes(status)) await revokeEntitlement({ email, transaction });
  else return Response.json({ ignored: true });
  return Response.json({ ok: true });
};
