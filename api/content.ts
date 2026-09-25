// Published website content for the browser. Empty lists mean "use the built-in content".
import type { IncomingMessage, ServerResponse } from 'node:http';
import { getPublicContent } from './_lib/content.js';

export default async function handler(_req: IncomingMessage, res: ServerResponse) {
  const content = await getPublicContent();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=120, stale-while-revalidate=600');
  res.end(JSON.stringify(content));
}
