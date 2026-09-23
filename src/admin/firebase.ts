// Firebase client for the CMS only (loaded lazily with /admin, never on public pages).
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, connectAuthEmulator, getAuth, signInWithCredential } from 'firebase/auth';
import { addDoc, collection, connectFirestoreEmulator, getFirestore, serverTimestamp } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const storage = getStorage(app);
// Local QA only: `VITE_USE_EMULATORS=true npm run dev` talks to the Firebase emulators.
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8085);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
  // Fake Google sign-in for automated QA against the emulator.
  (window as unknown as Record<string, unknown>).__cmsTestSignIn = (email: string, name = 'QA') =>
    signInWithCredential(auth, GoogleAuthProvider.credential(JSON.stringify({ sub: email, email, email_verified: true, name })));
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export function stamp() {
  return { updatedAt: serverTimestamp(), updatedBy: (auth.currentUser?.email || '').toLowerCase() };
}

// Best effort: an audit failure never blocks the edit itself.
export async function logAudit(action: string, target: string, summary = '') {
  try {
    await addDoc(collection(db, 'audit_log'), {
      actor: (auth.currentUser?.email || '').toLowerCase(),
      action: action.slice(0, 60),
      target: target.slice(0, 200),
      summary: summary.slice(0, 500),
      at: serverTimestamp(),
    });
  } catch (error) {
    console.warn('Audit log write failed', error);
  }
}

export function friendlyError(error: unknown): string {
  const code = typeof error === 'object' && error && 'code' in error ? String((error as { code: string }).code) : '';
  if (code.includes('permission-denied')) return 'Your role does not allow this change, or a field is not valid.';
  if (code.includes('unavailable')) return 'Connection problem. Check the internet and try again.';
  if (code.includes('storage/unauthorized')) return 'Uploads are not allowed for this account.';
  if (code.includes('storage/')) return 'Upload failed. Media storage may not be enabled yet in Firebase.';
  if (code.includes('auth/popup-closed-by-user') || code.includes('auth/cancelled-popup-request')) return 'Sign-in was cancelled.';
  if (code.includes('auth/unauthorized-domain')) return 'This website address is not yet authorised for sign-in in Firebase.';
  if (code.includes('auth/operation-not-allowed')) return 'Google sign-in is not enabled in Firebase yet.';
  return error instanceof Error ? error.message : 'Something went wrong.';
}
