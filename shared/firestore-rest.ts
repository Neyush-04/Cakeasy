// Minimal Firestore REST client for the Vercel functions.
// Requests are unauthenticated, so firestore.rules decide what is readable or creatable.
import { FIREBASE_PROJECT_ID, FIRESTORE_DATABASE_ID, FIREBASE_WEB_API_KEY } from './site.js';

const BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/${FIRESTORE_DATABASE_ID}/documents`;
const DOC_PREFIX = `projects/${FIREBASE_PROJECT_ID}/databases/${FIRESTORE_DATABASE_ID}/documents`;

type FirestoreValue = Record<string, unknown>;
export type PlainDoc = Record<string, unknown> & { _id: string };

export function decodeValue(value: FirestoreValue | undefined): unknown {
  if (!value) return null;
  if ('stringValue' in value) return value.stringValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('nullValue' in value) return null;
  if ('mapValue' in value) return decodeFields((value.mapValue as { fields?: Record<string, FirestoreValue> }).fields);
  if ('arrayValue' in value) {
    const values = (value.arrayValue as { values?: FirestoreValue[] }).values || [];
    return values.map(decodeValue);
  }
  return null;
}

function decodeFields(fields: Record<string, FirestoreValue> | undefined): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields || {})) out[key] = decodeValue(value);
  return out;
}

export function encodeValue(value: unknown): FirestoreValue {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encodeValue) } };
  if (typeof value === 'object') {
    const fields: Record<string, FirestoreValue> = {};
    for (const [key, inner] of Object.entries(value as Record<string, unknown>)) fields[key] = encodeValue(inner);
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

function toPlain(doc: { name: string; fields?: Record<string, FirestoreValue> }): PlainDoc {
  return { ...decodeFields(doc.fields), _id: doc.name.split('/').pop() || '' };
}

export async function getDocument(collection: string, id: string, timeoutMs = 2500): Promise<PlainDoc | null> {
  const response = await fetch(`${BASE}/${collection}/${encodeURIComponent(id)}?key=${FIREBASE_WEB_API_KEY}`, {
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (response.status === 404 || response.status === 403) return null;
  if (!response.ok) throw new Error(`Firestore get ${collection}/${id} failed: ${response.status}`);
  return toPlain(await response.json());
}

// Uses runQuery: the plain ListDocuments endpoint refuses unauthenticated callers on
// this database even where the rules allow public reads.
export async function listDocuments(collection: string, timeoutMs = 3000, max = 500): Promise<PlainDoc[]> {
  const response = await fetch(`${BASE}:runQuery?key=${FIREBASE_WEB_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(timeoutMs),
    body: JSON.stringify({ structuredQuery: { from: [{ collectionId: collection }], limit: max } }),
  });
  if (response.status === 403 || response.status === 404) return [];
  if (!response.ok) throw new Error(`Firestore query ${collection} failed: ${response.status}`);
  const rows = await response.json() as { document?: { name: string; fields?: Record<string, FirestoreValue> } }[];
  return rows.filter((row) => row.document).map((row) => toPlain(row.document!));
}

// Creates a document that must not already exist. `serverTimeFields` are set to the
// commit time, which lets firestore.rules check `== request.time`.
export async function createDocument(collection: string, id: string, data: Record<string, unknown>, serverTimeFields: string[] = []): Promise<void> {
  const fields: Record<string, FirestoreValue> = {};
  for (const [key, value] of Object.entries(data)) fields[key] = encodeValue(value);

  const response = await fetch(`${BASE}:commit?key=${FIREBASE_WEB_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(5000),
    body: JSON.stringify({
      writes: [{
        update: { name: `${DOC_PREFIX}/${collection}/${id}`, fields },
        currentDocument: { exists: false },
        updateTransforms: serverTimeFields.map((fieldPath) => ({ fieldPath, setToServerValue: 'REQUEST_TIME' })),
      }],
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Firestore create ${collection} failed: ${response.status} ${detail.slice(0, 300)}`);
  }
}
