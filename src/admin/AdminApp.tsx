import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
  LayoutDashboard, Inbox, Search, Shuffle, Image as ImageIcon, Store, Megaphone, Users as UsersIcon, History, LogOut, ExternalLink, ShieldAlert,
} from 'lucide-react';
import logo from '../assets/brand/cakeasy-logo-web.webp';
import { BOOTSTRAP_OWNER_EMAIL } from '../../shared/site';
import { auth, db, friendlyError, googleProvider } from './firebase';
import { ROLE_ACCESS, ROLE_LABELS, SessionContext, type ModuleId, type Role, type Session } from './session';
import { Button, Loading, ToastProvider } from './ui';
import Dashboard from './modules/Dashboard';
import Enquiries from './modules/Enquiries';
import SeoManager from './modules/Seo';
import Redirects from './modules/Redirects';
import MediaLibrary from './modules/Media';
import SiteSettingsModule from './modules/SiteSettings';
import MarketingModule from './modules/Marketing';
import UsersModule from './modules/Users';
import Activity from './modules/Activity';

const NAV: { id: ModuleId; path: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'enquiries', path: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
  { id: 'seo', path: '/admin/seo', label: 'SEO', icon: Search },
  { id: 'redirects', path: '/admin/redirects', label: 'Redirects', icon: Shuffle },
  { id: 'media', path: '/admin/media', label: 'Media', icon: ImageIcon },
  { id: 'marketing', path: '/admin/marketing', label: 'Marketing & tracking', icon: Megaphone },
  { id: 'settings', path: '/admin/settings', label: 'Studio settings', icon: Store },
  { id: 'users', path: '/admin/users', label: 'Users & roles', icon: UsersIcon },
  { id: 'activity', path: '/admin/activity', label: 'Activity log', icon: History },
];

type AuthState =
  | { status: 'loading' }
  | { status: 'signed-out'; error?: string }
  | { status: 'no-access'; user: User; reason: string }
  | { status: 'ready'; session: Session };

export default function AdminApp() {
  const [state, setState] = useState<AuthState>({ status: 'loading' });

  useEffect(() => onAuthStateChanged(auth, async (user) => {
    if (!user) { setState({ status: 'signed-out' }); return; }
    const email = (user.email || '').toLowerCase();
    const isGoogle = user.providerData.some((provider) => provider.providerId === 'google.com');
    if (!email || !user.emailVerified || !isGoogle) {
      setState({ status: 'no-access', user, reason: 'Please sign in with a verified Google account.' });
      return;
    }

    let role: Role | null = null;
    const isBootstrap = email === BOOTSTRAP_OWNER_EMAIL;
    if (isBootstrap) role = 'owner';
    else {
      try {
        const member = await getDoc(doc(db, 'cms_users', email));
        const data = member.data();
        if (member.exists() && data?.active === true && ['owner', 'editor', 'marketing'].includes(data.role)) role = data.role as Role;
      } catch { /* treated as no access */ }
    }

    if (!role) {
      setState({ status: 'no-access', user, reason: `${email} does not have CMS access yet. Ask the Cakeasy owner to add this email in Users & roles.` });
      return;
    }
    const allowed = ROLE_ACCESS[role];
    setState({ status: 'ready', session: { user, email, role, isBootstrap, can: (module) => allowed.includes(module) } });
  }), []);

  if (state.status === 'loading') return <Shell><Loading label="Checking your sign-in…" /></Shell>;
  if (state.status === 'signed-out') return <SignIn error={state.error} onError={(error) => setState({ status: 'signed-out', error })} />;
  if (state.status === 'no-access') return <NoAccess reason={state.reason} />;

  return (
    <SessionContext.Provider value={state.session}>
      <ToastProvider>
        <Layout />
      </ToastProvider>
    </SessionContext.Provider>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center bg-[#FBF8F7] px-4">{children}</div>;
}

function SignIn({ error, onError }: { error?: string; onError: (message: string) => void }) {
  const [busy, setBusy] = useState(false);
  const signIn = async () => {
    setBusy(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const code = typeof err === 'object' && err && 'code' in err ? String((err as { code: string }).code) : '';
      if (code === 'auth/popup-blocked') { await signInWithRedirect(auth, googleProvider); return; }
      onError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell>
      <div className="w-full max-w-sm rounded-2xl border border-[#EDE3E2] bg-white p-7 text-center shadow-[0_20px_60px_rgba(37,27,33,0.08)]">
        <img src={logo} alt="Cakeasy" className="mx-auto h-16 w-auto" />
        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D63384]">Studio CMS</p>
        <h1 className="mt-1 font-serif text-2xl font-bold text-[#251B21]">Sign in to manage Cakeasy</h1>
        <p className="mt-2 text-[13px] leading-5 text-gray-500">Use the Google account the owner added for you. There are no shared passwords.</p>
        <button
          onClick={signIn}
          disabled={busy}
          className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-[#E7DEDC] bg-white px-4 py-3 text-[13px] font-semibold text-[#251B21] transition hover:bg-[#FBF8F7] disabled:opacity-60"
        >
          <GoogleMark /> {busy ? 'Opening Google…' : 'Continue with Google'}
        </button>
        {error && <p className="mt-3 text-[12px] text-red-600">{error}</p>}
        <a href="/" className="mt-5 inline-block text-[12px] text-gray-400 hover:text-[#D63384]">Back to cakeasy.in</a>
      </div>
    </Shell>
  );
}

function NoAccess({ reason }: { reason: string }) {
  return (
    <Shell>
      <div className="w-full max-w-sm rounded-2xl border border-[#EDE3E2] bg-white p-7 text-center">
        <ShieldAlert className="mx-auto h-8 w-8 text-[#D63384]" />
        <h1 className="mt-3 font-serif text-xl font-bold text-[#251B21]">No CMS access</h1>
        <p className="mt-2 text-[13px] leading-5 text-gray-500">{reason}</p>
        <Button tone="primary" className="mt-5 w-full" onClick={() => signOut(auth)}>Use a different account</Button>
      </div>
    </Shell>
  );
}

function Layout() {
  const session = useSessionSafe();
  const items = useMemo(() => NAV.filter((item) => session.can(item.id)), [session]);

  return (
    <div className="min-h-screen bg-[#FBF8F7] text-[#251B21]">
      <header className="sticky top-0 z-30 border-b border-[#EDE3E2] bg-white/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between gap-3 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Cakeasy" className="h-9 w-auto" />
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-[#D63384] sm:inline">Studio CMS</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="hidden items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-gray-500 hover:bg-[#FBF8F7] hover:text-[#251B21] sm:inline-flex">View site <ExternalLink className="h-3.5 w-3.5" /></a>
            <div className="hidden text-right leading-tight md:block">
              <p className="text-[12px] font-semibold">{session.email}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">{ROLE_LABELS[session.role]}</p>
            </div>
            <button onClick={() => signOut(auth)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-[#FBF8F7] hover:text-[#251B21]" aria-label="Sign out" title="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto border-t border-[#F3ECEA] px-3 py-2 lg:hidden" aria-label="CMS sections">
          {items.map((item) => (
            <NavLink key={item.id} to={item.path} end={item.path === '/admin'} className={({ isActive }) => `flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold ${isActive ? 'bg-[#251B21] text-white' : 'text-gray-500 hover:bg-[#FBF8F7]'}`}>
              <item.icon className="h-3.5 w-3.5" /> {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <div className="flex">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 border-r border-[#EDE3E2] bg-white px-3 py-4 lg:block">
          <nav className="space-y-0.5" aria-label="CMS sections">
            {items.map((item) => (
              <NavLink key={item.id} to={item.path} end={item.path === '/admin'} className={({ isActive }) => `flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors ${isActive ? 'bg-[#FFF0F6] text-[#B02266]' : 'text-gray-600 hover:bg-[#FBF8F7] hover:text-[#251B21]'}`}>
                <item.icon className="h-4 w-4" /> {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-5 lg:px-8 lg:py-7">
          <div className="mx-auto max-w-6xl">
            <Routes>
              <Route path="/admin" element={<Dashboard />} />
              {session.can('enquiries') && <Route path="/admin/enquiries" element={<Enquiries />} />}
              <Route path="/admin/seo" element={<SeoManager />} />
              <Route path="/admin/redirects" element={<Redirects />} />
              <Route path="/admin/media" element={<MediaLibrary />} />
              {session.can('marketing') && <Route path="/admin/marketing" element={<MarketingModule />} />}
              {session.can('settings') && <Route path="/admin/settings" element={<SiteSettingsModule />} />}
              {session.can('users') && <Route path="/admin/users" element={<UsersModule />} />}
              {session.can('activity') && <Route path="/admin/activity" element={<Activity />} />}
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function useSessionSafe(): Session {
  const session = React.useContext(SessionContext);
  if (!session) throw new Error('No session');
  return session;
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
