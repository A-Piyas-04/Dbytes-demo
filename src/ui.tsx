import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

export const ActiveCtx = createContext(true);
export const useActive = () => useContext(ActiveCtx);
import { ArrowLeft, BadgeCheck, Bell, Check, FileText, Image as ImageIcon, Images, Play, Plus, Video, Layers, Search, SquarePlus } from 'lucide-react';
import { useStore, creatorOf } from './store';
import { TOPICS, type Creator, type Lang, type TopicId, type LessonType } from './data';
import { digits } from './i18n';

/** Resolve a /public path against the Vite base so the demo works from a subfolder. */
export const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;

export function Avatar({ c, size = 40, ring = false }: { c: Creator; size?: number; ring?: boolean }) {
  return (
    <span
      className={`avatar ${ring ? 'ring' : ''} ${c.img ? 'img' : ''}`}
      style={{
        width: size, height: size, fontSize: size * 0.36,
        background: c.img ? 'var(--ink)' : `linear-gradient(140deg, hsl(${c.hue} 62% 58%), hsl(${(c.hue + 40) % 360} 58% 38%))`,
      }}
      aria-hidden="true"
    >
      {c.img ? <img src={asset(c.img)} alt="" draggable={false} /> : c.initials}
    </span>
  );
}

export function Name({ c, className = '' }: { c: Creator; className?: string }) {
  const { x } = useStore();
  return (
    <span className={`name ${className}`}>
      {x(c.name)}
      {c.verified && <BadgeCheck size={15} className="verified" aria-label="Verified" />}
    </span>
  );
}

/* The two lockups differ in proportion; this keeps the main word the same
   optical size when the language flips. */
const LOCKUP_SCALE = { en: 1, bn: 0.92 } as const;

export function Wordmark({ size = 30, tone = 'dark', lang: force }: { size?: number; tone?: 'dark' | 'light'; lang?: Lang }) {
  const { lang: appLang } = useStore();
  const lang = force ?? appLang;
  return (
    <img
      className="wordmark-img"
      src={asset(`logo/lockup-${lang}${tone === 'light' ? '-light' : ''}.png`)}
      style={{ height: Math.round(size * LOCKUP_SCALE[lang]) }}
      alt="Doshomik Bytes"
      draggable={false}
    />
  );
}

export function LogoMark({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <img
      className={`logo-mark ${className}`}
      src={asset('logo/mark-512.png')}
      style={{ width: size, height: size }}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}

export function LangToggle() {
  const { lang, setLang } = useStore();
  return (
    <button className="lang-toggle tap" onClick={() => setLang(lang === 'en' ? 'bn' : 'en')} aria-label="Switch language">
      <span className={lang === 'bn' ? 'on' : ''}>বাং</span>
      <span className={lang === 'en' ? 'on' : ''}>EN</span>
    </button>
  );
}

export function TopBar({ children, noSearch }: { children?: React.ReactNode; noSearch?: boolean }) {
  const s = useStore();
  const unread = !s.activityRead && s.activity.some((a) => a.unread);
  const v2 = s.navMode === 'v2';
  return (
    <header className="topbar">
      <Wordmark size={v2 ? 27 : 30} />
      <div className="topbar-right">
        <LangToggle />
        {v2 && !noSearch && (
          <button className="icon-btn tap" onClick={() => s.push('explore')} aria-label={s.tt('Search', 'খুঁজুন')}>
            <Search size={21} />
          </button>
        )}
        {v2 && (
          <button className="icon-btn tap" onClick={() => s.setSheet({ name: 'create' })} aria-label={s.t('create')}>
            <SquarePlus size={22} />
          </button>
        )}
        <button className="icon-btn tap" onClick={() => s.push('activity')} aria-label={s.t('activity')}>
          <Bell size={22} />
          {unread && <span className="badge-dot" />}
        </button>
      </div>
      {children}
    </header>
  );
}

export function Header({ title, right, onBack, transparent }: { title?: React.ReactNode; right?: React.ReactNode; onBack?: () => void; transparent?: boolean }) {
  const s = useStore();
  return (
    <header className={`header ${transparent ? 'transparent' : ''}`}>
      <button className="icon-btn tap" onClick={onBack || s.back} aria-label={s.t('back')}>
        <ArrowLeft size={22} />
      </button>
      <div className="header-title">{title}</div>
      <div className="header-right">{right}</div>
    </header>
  );
}

export function Seg<T extends string>({ options, value, onChange, variant = 'pill', className = '' }: { options: { id: T; label: React.ReactNode }[]; value: T; onChange: (v: T) => void; variant?: 'pill' | 'tabs' | 'overlay'; className?: string }) {
  const idx = Math.max(0, options.findIndex((o) => o.id === value));
  return (
    <div className={`seg seg-${variant} ${className}`} role="tablist" style={{ ['--n' as string]: options.length, ['--i' as string]: idx }}>
      <span className="seg-ind" aria-hidden="true" />
      {options.map((o) => (
        <button key={o.id} role="tab" aria-selected={o.id === value} className={`seg-btn ${o.id === value ? 'on' : ''}`} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Chip({ active, onClick, children, small, className = '' }: { active?: boolean; onClick?: () => void; children: React.ReactNode; small?: boolean; className?: string }) {
  return (
    <button className={`chip tap ${active ? 'on' : ''} ${small ? 'sm' : ''} ${className}`} onClick={onClick} aria-pressed={active}>
      {children}
    </button>
  );
}

export function TopicChips({ value, onChange, all = true, multi }: { value: TopicId | null; onChange: (v: TopicId | null) => void; all?: boolean; multi?: boolean }) {
  const { x, t } = useStore();
  return (
    <div className={`chip-row ${multi ? 'wrap' : ''}`}>
      {all && <Chip active={value === null} onClick={() => onChange(null)}>{t('all')}</Chip>}
      {TOPICS.map((tp) => (
        <Chip key={tp.id} active={value === tp.id} onClick={() => onChange(value === tp.id && all ? null : tp.id)}>
          {x(tp.label)}
        </Chip>
      ))}
    </div>
  );
}

export function TopicTag({ id, onDark }: { id: TopicId; onDark?: boolean }) {
  const s = useStore();
  const tp = TOPICS.find((t) => t.id === id)!;
  return (
    <button
      className={`topic-tag tap ${onDark ? 'dark' : ''}`}
      onClick={(e) => { e.stopPropagation(); s.goExplore('trending', id); }}
    >
      #{tp.tag}
    </button>
  );
}

export function FollowBtn({ id, onDark, size = 'sm' }: { id: string; onDark?: boolean; size?: 'sm' | 'md' }) {
  const s = useStore();
  if (id === 'me') return null;
  const on = s.isFollowing(id);
  return (
    <button
      className={`follow-btn tap ${on ? 'on' : ''} ${onDark ? 'dark' : ''} ${size}`}
      onClick={(e) => { e.stopPropagation(); s.toggleFollow(id); }}
      aria-pressed={on}
    >
      {on ? <><Check size={14} /> {s.t('followingBtn')}</> : <><Plus size={14} /> {s.t('follow')}</>}
    </button>
  );
}

export function CreatorRow({ id, sub, right, onClick }: { id: string; sub?: React.ReactNode; right?: React.ReactNode; onClick?: () => void }) {
  const s = useStore();
  const c = creatorOf(s, id);
  return (
    <div className="creator-row">
      <button className="creator-row-main tap" onClick={onClick || (() => openCreator(s, id))}>
        <Avatar c={c} size={44} />
        <span className="creator-row-text">
          <Name c={c} />
          <span className="sub">{sub ?? s.x(c.bio)}</span>
        </span>
      </button>
      {right}
    </div>
  );
}

export const openCreator = (s: ReturnType<typeof useStore>, id: string) => {
  if (id === 'me') s.setTab('profile');
  else s.push('creator', { id });
};

export function Btn({ children, variant = 'primary', size = 'md', block, disabled, onClick, icon, className = '', type }: { children?: React.ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent' | 'dark'; size?: 'sm' | 'md' | 'lg'; block?: boolean; disabled?: boolean; onClick?: () => void; icon?: React.ReactNode; className?: string; type?: 'button' | 'submit' }) {
  return (
    <button type={type || 'button'} className={`btn btn-${variant} btn-${size} ${block ? 'block' : ''} tap ${className}`} disabled={disabled} onClick={onClick}>
      {icon}
      {children}
    </button>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} className={`switch ${on ? 'on' : ''}`} onClick={() => onChange(!on)}>
      <span />
    </button>
  );
}

export function Progress({ value, thin }: { value: number; thin?: boolean }) {
  return (
    <div className={`progress ${thin ? 'thin' : ''}`} role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  );
}

export function Empty({ icon, title, action }: { icon: React.ReactNode; title: string; action?: React.ReactNode }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      {action}
    </div>
  );
}

export function KindIcon({ kind, size = 16 }: { kind: 'reel' | 'image' | 'carousel' | 'note' | 'paper' | 'course'; size?: number }) {
  if (kind === 'reel') return <Play size={size} fill="currentColor" />;
  if (kind === 'carousel') return <Images size={size} />;
  if (kind === 'image') return <ImageIcon size={size} />;
  if (kind === 'course') return <Layers size={size} />;
  return <FileText size={size} />;
}

export function LessonTypeIcon({ type, size = 16 }: { type: LessonType; size?: number }) {
  if (type === 'video') return <Video size={size} />;
  if (type === 'note') return <FileText size={size} />;
  return <Layers size={size} />;
}

export function Sheet({ children, title, onClose, className = '', tall }: { children: React.ReactNode; title?: React.ReactNode; onClose: () => void; className?: string; tall?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number; t: number } | null>(null);
  const [dy, setDy] = useState(0);
  const [closing, setClosing] = useState(false);
  const close = () => { setClosing(true); setTimeout(onClose, 200); };
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  });
  return (
    <div className={`sheet-layer ${closing ? 'closing' : ''}`}>
      <div className="scrim" onClick={close} />
      <div
        ref={ref}
        className={`sheet ${tall ? 'tall' : ''} ${className}`}
        role="dialog"
        aria-modal="true"
        style={dy ? { transform: `translateY(${dy}px)`, transition: 'none' } : undefined}
      >
        <div
          className="sheet-handle-area"
          onPointerDown={(e) => { drag.current = { y: e.clientY, t: Date.now() }; (e.target as HTMLElement).setPointerCapture(e.pointerId); }}
          onPointerMove={(e) => { if (drag.current) { const d = e.clientY - drag.current.y; setDy(d > 0 ? d : d / 6); } }}
          onPointerUp={(e) => {
            if (!drag.current) return;
            const d = e.clientY - drag.current.y;
            const v = d / Math.max(1, Date.now() - drag.current.t);
            drag.current = null;
            if (d > 110 || v > 0.5) close();
            setDy(0);
          }}
        >
          <span className="sheet-handle" />
          {title && <div className="sheet-title">{title}</div>}
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}

export function Stat({ n, label, onClick }: { n: string; label: string; onClick?: () => void }) {
  return (
    <button className="stat tap" onClick={onClick} disabled={!onClick}>
      <b>{n}</b>
      <span>{label}</span>
    </button>
  );
}

export function Level({ level }: { level: 'beginner' | 'intermediate' | 'advanced' | 'all' }) {
  const { t } = useStore();
  const map = { beginner: t('beginner'), intermediate: t('intermediate'), advanced: t('advanced'), all: t('allLevels') };
  return <span className={`level lv-${level}`}>{map[level]}</span>;
}

export function Num({ n }: { n: number | string }) {
  const { lang } = useStore();
  return <>{digits(lang, n)}</>;
}

export function useInView<T extends Element>(threshold = 0.6) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting && e.intersectionRatio >= threshold), { threshold: [0, threshold, 1] });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

export function useReorder<T>(items: T[], setItems: (v: T[]) => void, rowH: number) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  const start = useRef(0);
  const handle = (i: number) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      start.current = e.clientY;
      setDragIdx(i);
      setOffset(0);
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (dragIdx === null) return;
      const d = e.clientY - start.current;
      const shift = Math.round(d / rowH);
      const target = Math.max(0, Math.min(items.length - 1, dragIdx + shift));
      if (target !== dragIdx) {
        const next = items.slice();
        const [m] = next.splice(dragIdx, 1);
        next.splice(target, 0, m);
        setItems(next);
        start.current += (target - dragIdx) * rowH;
        setDragIdx(target);
        setOffset(d - (target - dragIdx) * rowH);
      } else setOffset(d);
    },
    onPointerUp: () => { setDragIdx(null); setOffset(0); },
    onPointerCancel: () => { setDragIdx(null); setOffset(0); },
    style: { touchAction: 'none' as const },
  });
  const rowStyle = (i: number): React.CSSProperties => (i === dragIdx ? { transform: `translateY(${offset}px)`, zIndex: 2, position: 'relative' } : {});
  return { handle, rowStyle, dragIdx };
}
