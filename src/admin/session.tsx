import { createContext, useContext } from 'react';
import type { User } from 'firebase/auth';

export type Role = 'owner' | 'editor' | 'marketing';

export type ModuleId = 'dashboard' | 'enquiries' | 'seo' | 'redirects' | 'media' | 'settings' | 'marketing' | 'users' | 'activity';

// Mirrors firestore.rules. The rules are the real enforcement; this only shapes the UI.
export const ROLE_ACCESS: Record<Role, ModuleId[]> = {
  owner: ['dashboard', 'enquiries', 'seo', 'redirects', 'media', 'settings', 'marketing', 'users', 'activity'],
  editor: ['dashboard', 'seo', 'redirects', 'media'],
  marketing: ['dashboard', 'seo', 'redirects', 'media', 'marketing'],
};

export const ROLE_LABELS: Record<Role, string> = {
  owner: 'Owner',
  editor: 'Content editor',
  marketing: 'Marketing',
};

export interface Session {
  user: User;
  email: string;
  role: Role;
  isBootstrap: boolean;
  can: (module: ModuleId) => boolean;
}

export const SessionContext = createContext<Session | null>(null);

export function useSession(): Session {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useSession outside the CMS');
  return session;
}
