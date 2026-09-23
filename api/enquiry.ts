// Saves a website enquiry to the CMS before the visitor continues to WhatsApp.
import { randomBytes } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createDocument } from '../shared/firestore-rest.js';
import { UTM_KEYS } from '../shared/site.js';

export const ENQUIRY_KINDS = ['consultation', 'custom-cake', 'contact', 'cart'] as const;
const MAX_BODY_BYTES = 24_000;
const RATE_WINDOW_MS = 10 * 60_000;
const RATE_MAX = 6;
const recent = new Map<string, number[]>();

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) { reject(new Error('too-large')); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max) : '';
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((at) => now - at < RATE_WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) recent.clear();
  return hits.length > RATE_MAX;
}

function send(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

export function validateEnquiry(input: Record<string, unknown>) {
  const kind = clean(input.kind, 20) as typeof ENQUIRY_KINDS[number];
  if (!ENQUIRY_KINDS.includes(kind)) return { error: 'Unknown enquiry type.' };

  const name = clean(input.name, 100);
  const phone = clean(input.phone, 30);
  const email = clean(input.email, 120).toLowerCase();
  if (phone && !/^[+\d][\d\s()-]{6,28}$/.test(phone)) return { error: 'Please check the phone number.' };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: 'Please check the email address.' };
  if ((kind === 'consultation' || kind === 'contact') && !name) return { error: 'Please add your name.' };
  if (kind === 'consultation' && !phone) return { error: 'Please add a phone or WhatsApp number.' };
  if (kind === 'contact' && !phone && !email) return { error: 'Please add a phone number or email.' };

  const details: Record<string, string> = {};
  const rawDetails = input.details && typeof input.details === 'object' ? input.details as Record<string, unknown> : {};
  for (const [key, value] of Object.entries(rawDetails).slice(0, 40)) {
    if (!/^[A-Za-z][A-Za-z0-9 _/&()-]{0,48}$/.test(key)) continue;
    const text = clean(value, 1500);
    if (text) details[key] = text;
  }

  const source: Record<string, string> = {};
  const rawSource = input.source && typeof input.source === 'object' ? input.source as Record<string, unknown> : {};
  for (const key of [...UTM_KEYS, 'referrer', 'landingPage']) {
    const text = clean(rawSource[key], 300);
    if (text) source[key] = text;
  }

  return {
    value: {
      kind, name, phone, email,
      eventDate: clean(input.eventDate, 40),
      details, source,
      pagePath: clean(input.pagePath, 200) || '/',
      status: 'new',
    },
  };
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { error: 'Method not allowed' });
  }

  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
  if (rateLimited(ip)) return send(res, 429, { error: 'Too many enquiries. Please continue on WhatsApp.' });

  let input: Record<string, unknown>;
  try {
    input = JSON.parse(await readBody(req));
  } catch {
    return send(res, 400, { error: 'Invalid request.' });
  }

  // Honeypot: real visitors never see or fill this field.
  if (clean(input.website, 200)) return send(res, 200, { ok: true, ref: '' });

  const result = validateEnquiry(input);
  if ('error' in result) return send(res, 422, { error: result.error });

  const id = randomBytes(10).toString('hex');
  const ref = `CK-${randomBytes(3).toString('hex').toUpperCase()}`;

  try {
    await createDocument('enquiries', id, { ...result.value, ref }, ['createdAt']);
  } catch (error) {
    console.error('[enquiry] save failed:', error instanceof Error ? error.message : error);
    return send(res, 502, { error: 'Could not save the enquiry.' });
  }

  return send(res, 201, { ok: true, ref });
}
