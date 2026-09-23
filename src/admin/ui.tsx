import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const inputClass = 'w-full rounded-lg border border-[#E7DEDC] bg-white px-3 py-2 text-[13px] text-[#251B21] placeholder:text-gray-400 focus:border-[#D63384] focus:outline-none focus:ring-2 focus:ring-[#D63384]/10 disabled:bg-gray-50 disabled:text-gray-400';

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D63384]">{eyebrow}</p>}
        <h1 className="mt-0.5 font-serif text-2xl font-bold text-[#251B21]">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-[13px] leading-5 text-gray-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-[#EDE3E2] bg-white ${className}`}>{children}</div>;
}

export function Field({ label, hint, count, max, children }: { label: string; hint?: React.ReactNode; count?: number; max?: number; children: React.ReactNode }) {
  const over = max !== undefined && count !== undefined && count > max;
  return (
    <label className="block space-y-1">
      <span className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#43242F]">{label}</span>
        {max !== undefined && count !== undefined && (
          <span className={`text-[11px] tabular-nums ${over ? 'font-bold text-amber-600' : 'text-gray-400'}`}>{count}/{max}</span>
        )}
      </span>
      {children}
      {hint && <span className="block text-[11px] leading-4 text-gray-400">{hint}</span>}
    </label>
  );
}

type ButtonTone = 'primary' | 'accent' | 'ghost' | 'danger' | 'success';
const tones: Record<ButtonTone, string> = {
  primary: 'bg-[#251B21] text-white hover:bg-[#43242F]',
  accent: 'bg-[#D63384] text-white hover:bg-[#B02266]',
  ghost: 'border border-[#E7DEDC] bg-white text-[#43242F] hover:bg-[#FBF8F7]',
  danger: 'border border-red-200 bg-white text-red-600 hover:bg-red-50',
  success: 'bg-[#25D366] text-white hover:bg-[#20ba59]',
};

export function Button({ tone = 'ghost', busy, children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: ButtonTone; busy?: boolean }) {
  return (
    <button
      type="button"
      {...props}
      disabled={props.disabled || busy}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]} ${className}`}
    >
      {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>
  );
}

type BadgeTone = 'gray' | 'pink' | 'green' | 'amber' | 'blue' | 'red';
const badgeTones: Record<BadgeTone, string> = {
  gray: 'bg-gray-100 text-gray-600',
  pink: 'bg-[#FFF0F6] text-[#B02266]',
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  blue: 'bg-sky-50 text-sky-700',
  red: 'bg-red-50 text-red-600',
};

export function Badge({ tone = 'gray', children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeTones[tone]}`}>{children}</span>;
}

export function Toggle({ label, hint, checked, onChange, disabled }: { label: string; hint?: string; checked: boolean; onChange: (value: boolean) => void; disabled?: boolean }) {
  return (
    <label className={`flex items-start justify-between gap-3 rounded-lg border border-[#EDE3E2] px-3 py-2.5 ${disabled ? 'opacity-50' : 'cursor-pointer hover:bg-[#FBF8F7]'}`}>
      <span>
        <span className="block text-[13px] font-semibold text-[#251B21]">{label}</span>
        {hint && <span className="block text-[11px] leading-4 text-gray-500">{hint}</span>}
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input type="checkbox" className="peer sr-only" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
        <span className="h-5 w-9 rounded-full bg-gray-200 transition-colors peer-checked:bg-[#D63384] peer-focus-visible:ring-2 peer-focus-visible:ring-[#D63384]/30" />
        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </span>
    </label>
  );
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-[#E7DEDC] bg-[#FBF8F7] px-6 py-10 text-center">
      <p className="font-serif text-lg font-bold text-[#251B21]">{title}</p>
      {children && <div className="mx-auto mt-1 max-w-md text-[13px] text-gray-500">{children}</div>}
    </div>
  );
}

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return <div className="flex items-center gap-2 py-10 text-[13px] text-gray-400"><Loader2 className="h-4 w-4 animate-spin" /> {label}</div>;
}

export function Notice({ tone = 'amber', children }: { tone?: 'amber' | 'blue' | 'red' | 'green'; children: React.ReactNode }) {
  const styles = { amber: 'border-amber-200 bg-amber-50 text-amber-800', blue: 'border-sky-200 bg-sky-50 text-sky-800', red: 'border-red-200 bg-red-50 text-red-700', green: 'border-emerald-200 bg-emerald-50 text-emerald-800' };
  return <div className={`rounded-lg border px-3 py-2.5 text-[12px] leading-5 ${styles[tone]}`}>{children}</div>;
}

// ---------- Toasts ----------
type Toast = { id: number; message: string; tone: 'success' | 'error' };
const ToastContext = createContext<(message: string, tone?: Toast['tone']) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const notify = useCallback((message: string, tone: Toast['tone'] = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), tone === 'error' ? 6000 : 3200);
  }, []);
  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((toast) => (
          <div key={toast.id} role="status" className={`pointer-events-auto flex items-start gap-2 rounded-xl border bg-white px-3.5 py-3 text-[13px] shadow-lg animate-fadeIn ${toast.tone === 'error' ? 'border-red-200 text-red-700' : 'border-emerald-200 text-emerald-800'}`}>
            {toast.tone === 'error' ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

export function formatDateTime(value: unknown): string {
  const date = value && typeof value === 'object' && 'toDate' in value ? (value as { toDate: () => Date }).toDate() : value instanceof Date ? value : null;
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
}
