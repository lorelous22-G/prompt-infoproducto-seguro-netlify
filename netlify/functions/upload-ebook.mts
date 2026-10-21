import crypto from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { BOOKS } from '../lib/books.mjs';

const validToken = (received: string) => {
  const expected = process.env.EBOOK_UPLOAD_TOKEN || '';
  const a = Buffer.from(received || ''); const b = Buffer.from(expected);
  return a.length > 0 && a.length === b.length && crypto.timingSafeEqual(a, b);
};
export default async (request: Request) => {
  if (request.method !== 'PUT' || !validToken(request.headers.get('x-ebook-upload-token') || '')) return new Response('Unauthorized', { status: 401 });
  const book = BOOKS[new URL(request.url).searchParams.get('book') as keyof typeof BOOKS];
  if (!book) return new Response('Not found', { status: 404 });
  const file = await request.arrayBuffer();
  if (file.byteLength < 1000 || file.byteLength > 30 * 1024 * 1024) return new Response('Invalid file', { status: 422 });
  await getStore({ name: 'ritos-library', consistency: 'strong' }).set(book.key, file);
  return Response.json({ ok: true, book: book.filename });
};
