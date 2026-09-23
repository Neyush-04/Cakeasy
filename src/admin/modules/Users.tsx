import React, { useCallback, useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { Trash2, UserPlus } from 'lucide-react';
import { BOOTSTRAP_OWNER_EMAIL } from '../../../shared/site';
import { db, friendlyError, logAudit, stamp } from '../firebase';
import { ROLE_ACCESS, ROLE_LABELS, useSession, type Role } from '../session';
import { Badge, Button, Card, Field, Loading, Notice, PageHeader, inputClass, useToast } from '../ui';

interface Member { email: string; name?: string; role: Role; active: boolean; updatedBy?: string }

const ROLE_HELP: Record<Role, string> = {
  owner: 'Everything, including enquiries, studio details and users.',
  editor: 'SEO, redirects and media. Cannot see enquiries.',
  marketing: 'SEO, redirects, media and tracking IDs. Cannot see enquiries.',
};

export default function UsersModule() {
  const notify = useToast();
  const session = useSession();
  const [members, setMembers] = useState<Member[] | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('editor');
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, 'cms_users'));
      setMembers(snapshot.docs.map((item) => item.data() as Member).sort((a, b) => a.email.localeCompare(b.email)));
    } catch (error) { notify(friendlyError(error), 'error'); setMembers([]); }
  }, [notify]);
  useEffect(() => { refresh(); }, [refresh]);

  const write = async (member: Member, action: string) => {
    await setDoc(doc(db, 'cms_users', member.email), { email: member.email, name: member.name || '', role: member.role, active: member.active, ...stamp() });
    void logAudit(action, member.email, `${member.role}${member.active ? '' : ' (inactive)'}`);
  };

  const add = async () => {
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean)) { notify('Enter a valid Google account email.', 'error'); return; }
    if (clean === BOOTSTRAP_OWNER_EMAIL) { notify('That account already has permanent owner access.', 'error'); return; }
    if (members?.some((member) => member.email === clean)) { notify('This person already has access. Change their role below.', 'error'); return; }
    setBusy(true);
    try {
      await write({ email: clean, name: name.trim().slice(0, 80), role, active: true }, 'user.add');
      notify(`${clean} can now sign in with Google.`);
      setEmail(''); setName('');
      await refresh();
    } catch (error) { notify(friendlyError(error), 'error'); } finally { setBusy(false); }
  };

  const update = async (member: Member, patch: Partial<Member>) => {
    try {
      await write({ ...member, ...patch }, 'user.update');
      notify('Access updated');
      await refresh();
    } catch (error) { notify(friendlyError(error), 'error'); }
  };

  const remove = async (member: Member) => {
    if (!window.confirm(`Remove CMS access for ${member.email}?`)) return;
    try {
      await deleteDoc(doc(db, 'cms_users', member.email));
      void logAudit('user.remove', member.email);
      notify('Access removed');
      await refresh();
    } catch (error) { notify(friendlyError(error), 'error'); }
  };

  return (
    <div>
      <PageHeader eyebrow="Access" title="Users & roles" description="People sign in with their own Google account. Add their Gmail address here to give access; remove it to take access away instantly." />

      <Card className="mb-5 space-y-3 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Give someone access</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.3fr_1fr_1fr_auto] md:items-end">
          <Field label="Google account email"><input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@gmail.com" className={inputClass} /></Field>
          <Field label="Name (optional)"><input value={name} onChange={(event) => setName(event.target.value)} className={inputClass} /></Field>
          <Field label="Role">
            <select value={role} onChange={(event) => setRole(event.target.value as Role)} className={inputClass}>
              {(Object.keys(ROLE_LABELS) as Role[]).map((value) => <option key={value} value={value}>{ROLE_LABELS[value]}</option>)}
            </select>
          </Field>
          <Button tone="primary" onClick={add} busy={busy} disabled={!email}><UserPlus className="h-3.5 w-3.5" /> Add</Button>
        </div>
        <p className="text-[12px] text-gray-500">{ROLE_LABELS[role]}: {ROLE_HELP[role]}</p>
      </Card>

      {members === null ? <Loading /> : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-[#F3ECEA]">
            <li className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold">{BOOTSTRAP_OWNER_EMAIL}</p>
                <p className="text-[12px] text-gray-500">Site administrator · permanent access</p>
              </div>
              <Badge tone="pink">Owner</Badge>
            </li>
            {members.map((member) => {
              const isSelf = member.email === session.email;
              return (
                <li key={member.email} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold">{member.name ? `${member.name} · ` : ''}{member.email}{isSelf ? ' (you)' : ''}</p>
                    <p className="text-[12px] text-gray-500">Can open: {ROLE_ACCESS[member.role]?.length ? ROLE_HELP[member.role] : '—'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={member.role} disabled={isSelf} onChange={(event) => update(member, { role: event.target.value as Role })} className={`${inputClass} w-40`}>
                      {(Object.keys(ROLE_LABELS) as Role[]).map((value) => <option key={value} value={value}>{ROLE_LABELS[value]}</option>)}
                    </select>
                    <button disabled={isSelf} onClick={() => update(member, { active: !member.active })} className="disabled:opacity-40">
                      <Badge tone={member.active ? 'green' : 'gray'}>{member.active ? 'Active' : 'Paused'}</Badge>
                    </button>
                    <button disabled={isSelf} onClick={() => remove(member)} className="rounded p-1 text-gray-400 hover:text-red-600 disabled:opacity-30" aria-label={`Remove ${member.email}`}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
      <div className="mt-4"><Notice tone="blue">Tip: click Active/Paused to pause someone's access without deleting them.</Notice></div>
    </div>
  );
}
