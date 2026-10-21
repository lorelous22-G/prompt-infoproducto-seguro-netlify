import { getStore } from '@netlify/blobs';
import { getUser } from '@netlify/identity';
import { BOOKS } from '../lib/books.mjs';

export default async (request: Request) => {
  const user = await getUser();
  if (!user?.appMetadata?.roles?.includes('buyer')) return new Response('Unauthorized', { status: 401 });
  const url = new URL(request.url);
  const book = BOOKS[url.searchParams.get('book') as keyof typeof BOOKS];
  if (!book) return new Response('Not found', { status: 404 });
  const bytes = await getStore({ name: 'ritos-library', consistency: 'strong' }).get(book.key, { type: 'arrayBuffer' });
  if (!bytes) return new Response('Material not uploaded yet', { status: 404 });
  const download = url.searchParams.get('download') === '1';
  return new Response(bytes, { headers: { 'content-type': 'application/pdf', 'content-disposition': `${download ? 'attachment' : 'inline'}; filename="${book.filename}"`, 'cache-control': 'private, no-store' } });
};
