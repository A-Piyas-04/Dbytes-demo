import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight, Check, CheckCircle2, ChevronRight, CircleDashed, Columns3, CreditCard, FileText, Info, ListChecks, LoaderCircle,
  Lock, Map as MapIcon, PauseCircle, Receipt, ScanSearch, Search, Share2, ShieldCheck, Sparkles, Telescope, TriangleAlert, X,
  Smartphone, Wallet, CircleCheck, CircleX, CircleHelp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { findPaper, useStore, type Output, type Store } from '../store';
import { digits } from '../i18n';
import { Btn, Empty, Header, Level, Progress, Sheet } from '../ui';
import { COLLECTION, LIMITS, PRICE, PX, RENEW_DATE, RESET_DATE, SCOPE, type Plan, type ToolId } from '../research/data';
import { JOB_STEPS, MAPS, ROADMAPS, TOOL_META, matchMap, type LandscapeMap } from '../research/content';

export const TOOL_ORDER: ToolId[] = ['landscape', 'compare', 'claim', 'roadmap'];
const TOOL_ICON: Record<ToolId, LucideIcon> = { landscape: MapIcon, compare: Columns3, claim: ScanSearch, roadmap: ListChecks };

export function ToolIcon({ tool, size = 20 }: { tool: ToolId; size?: number }) {
  const I = TOOL_ICON[tool];
  return <span className="tool-icon" style={{ ['--h' as string]: TOOL_META[tool].hue }}><I size={size} /></span>;
}

export function ProBadge({ sm }: { sm?: boolean }) {
  return <span className={`pro-badge ${sm ? 'sm' : ''}`}><i />Premium</span>;
}

const shortTitle = (t: string) => {
  const m = t.match(/\(([^)]+)\)/);
  return m ? m[1] : t.split(':')[0];
};

/** Segmented allowance meter: each block is one run. */
export function Meter({ used, limit }: { used: number; limit: number }) {
  return (
    <span className={`meter ${limit > 5 ? 'dense' : ''}`} role="img" aria-label={`${used} of ${limit} used`}>
      {Array.from({ length: limit }, (_, i) => <i key={i} className={i < used ? 'used' : ''} />)}
    </span>
  );
}

export function quotaText(s: Store, tool: ToolId, plan: Plan = s.plan) {
  const limit = LIMITS[plan][tool];
  const left = Math.max(0, limit - s.usage[plan][tool]);
  if (plan === 'free' && tool === 'roadmap') return left ? s.tt('1 free trial', '১টি ফ্রি ট্রায়াল') : s.tt('Free trial used', 'ফ্রি ট্রায়াল শেষ');
  if (!left) return s.tt(`All ${limit} used · resets ${RESET_DATE.en}`, `${digits('bn', limit)}টিই শেষ · ${RESET_DATE.bn} রিসেট`);
  return s.tt(`${left} of ${limit} left this month`, `এ মাসে ${digits('bn', limit)}টির ${digits('bn', left)}টি বাকি`);
}

function scopeText(s: Store, tool: ToolId, plan: Plan = s.plan) {
  const sc = SCOPE[plan];
  if (tool === 'landscape') return s.tt(`Up to ${sc.mapPapers} papers per map`, `প্রতি ম্যাপে সর্বোচ্চ ${digits('bn', sc.mapPapers)}টি পেপার`);
  if (tool === 'compare') return s.tt(`Up to ${sc.comparePapers} papers, ${sc.pagesPerPaper} pages each`, `সর্বোচ্চ ${digits('bn', sc.comparePapers)}টি পেপার, প্রতিটি ${digits('bn', sc.pagesPerPaper)} পৃষ্ঠা`);
  if (tool === 'claim') return s.tt('One claim per check, supported papers', 'প্রতি যাচাইয়ে একটি দাবি, সমর্থিত পেপার');
  return s.tt('Supported papers only', 'শুধু সমর্থিত পেপার');
}

export function ToolCard({ tool }: { tool: ToolId }) {
  const s = useStore();
  const m = TOOL_META[tool];
  const limit = LIMITS[s.plan][tool];
  const used = s.usage[s.plan][tool];
  const out = used >= limit;
  return (
    <button className={`tool-card tap ${out ? 'out' : ''}`} onClick={() => s.push('tool', { tool })}>
      <ToolIcon tool={tool} size={22} />
      <span className="tc-body">
        <b>{s.x(m.name)}</b>
        <span className="tc-desc">{s.x(m.desc)}</span>
        <span className="tc-quota"><Meter used={Math.min(used, limit)} limit={limit} /> <span>{quotaText(s, tool)}</span></span>
        <span className="tc-scope">{scopeText(s, tool)}</span>
      </span>
      <ChevronRight size={18} className="muted" />
    </button>
  );
}

export function PlanCard() {
  const s = useStore();
  const premium = s.plan === 'premium';
  return (
    <div className={`plan-card ${premium ? 'pro' : ''}`}>
      <div className="plan-top">
        {premium ? <ProBadge /> : <span className="free-badge">{s.tt('Free plan', 'ফ্রি প্ল্যান')}</span>}
        <button className="link-btn tap" onClick={() => s.push(premium ? 'subscription' : 'premium', {})}>{premium ? s.tt('Manage', 'ম্যানেজ') : s.tt('See Premium', 'প্রিমিয়াম দেখুন')}</button>
      </div>
      <p className="plan-copy">{premium
        ? s.tt(`Renews ${RENEW_DATE.en}. Allowances reset on ${RESET_DATE.en}.`, `${RENEW_DATE.bn} নবায়ন। বরাদ্দ ${RESET_DATE.bn} রিসেট।`)
        : s.tt('Reading, Paper Cards and discussions are free. Research tools include a small monthly allowance.', 'পড়া, পেপার কার্ড ও আলোচনা ফ্রি। রিসার্চ টুলসে ছোট মাসিক বরাদ্দ আছে।')}</p>
      <div className="plan-meters">
        {TOOL_ORDER.map((t) => {
          const limit = LIMITS[s.plan][t];
          const used = Math.min(limit, s.usage[s.plan][t]);
          return (
            <div key={t} className="pm-row">
              <span>{s.x(TOOL_META[t].short)}</span>
              <Meter used={used} limit={limit} />
              <b className={used >= limit ? 'none' : ''}>{s.tt(`${limit - used} left`, `${digits('bn', limit - used)} বাকি`)}</b>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PausedBanner() {
  const s = useStore();
  return (
    <div className="paused-banner" role="status">
      <PauseCircle size={20} />
      <span><b>{s.tt('New research jobs are paused', 'নতুন রিসার্চ কাজ বন্ধ আছে')}</b>{s.tt(`This month’s shared AI budget is used up. Jobs restart on ${RESET_DATE.en}. Saved outputs and all reading features work as usual.`, `এ মাসের শেয়ার করা এআই বাজেট শেষ। ${RESET_DATE.bn} আবার চালু হবে। সেভ করা আউটপুট ও পড়ার সব সুবিধা চালু আছে।`)}</span>
    </div>
  );
}

export function outputTitle(s: Store, o: Output) {
  if (o.tool === 'landscape') return s.x(MAPS.find((m) => m.id === o.params.map)!.topic);
  if (o.tool === 'compare') return (o.params.papers as string[]).map((id) => shortTitle(findPaper(s, id)!.title)).join(s.tt(' vs ', ' বনাম '));
  return findPaper(s, o.params.paper)!.title;
}

export function OutputRow({ o }: { o: Output }) {
  const s = useStore();
  return (
    <button className="out-row tap" onClick={() => s.push('output', { id: o.id })}>
      <ToolIcon tool={o.tool} size={18} />
      <span className="res-text">
        <b>{outputTitle(s, o)}</b>
        <span className="sub">{s.x(TOOL_META[o.tool].short)} <span className="dot-sep" /> {o.when}{o.cached && <> <span className="dot-sep" /> {s.tt('Shared map', 'শেয়ার করা ম্যাপ')}</>}</span>
      </span>
      <ChevronRight size={18} className="muted" />
    </button>
  );
}

/* ---------------- sheets: limit + paused ---------------- */

export function LimitSheet({ tool }: { tool: ToolId }) {
  const s = useStore();
  const m = TOOL_META[tool];
  const premium = s.plan === 'premium';
  const limit = LIMITS[s.plan][tool];
  const saved = s.outputs.filter((o) => o.tool === tool);
  const close = () => s.setSheet(null);
  const lifetime = !premium && tool === 'roadmap';
  return (
    <Sheet onClose={close}>
      <div className="limit-sheet">
        <ToolIcon tool={tool} size={26} />
        <h2>{premium
          ? s.tt(`You’ve used all ${limit} ${m.units.en} this month`, `এ মাসের ${digits('bn', limit)}টি ${m.units.bn} শেষ`)
          : lifetime ? s.tt('You’ve used your free roadmap trial', 'ফ্রি রোডম্যাপ ট্রায়াল শেষ')
          : s.tt(`You’ve used this month’s free ${m.unit.en}`, `এ মাসের ফ্রি ${m.unit.bn} শেষ`)}</h2>
        <div className="ls-meter"><Meter used={limit} limit={limit} /><span>{lifetime ? s.tt('One trial per account', 'প্রতি অ্যাকাউন্টে একটি ট্রায়াল') : s.tt(`Resets ${RESET_DATE.en}`, `${RESET_DATE.bn} রিসেট`)}</span></div>
        {premium ? (
          <p className="ls-copy">{s.tt('Premium allowances are generous but not unlimited, so costs stay predictable and the app stays free for learners.', 'প্রিমিয়াম বরাদ্দ বেশি, তবে সীমাহীন নয়, যাতে খরচ নিয়ন্ত্রণে থাকে এবং অ্যাপ শিক্ষার্থীদের জন্য ফ্রি থাকে।')}</p>
        ) : (
          <>
            <div className="ls-compare">
              <div className="lsc cur"><span>{s.tt('Free (your plan)', 'ফ্রি (আপনার প্ল্যান)')}</span><b>{lifetime ? s.tt('1 trial', '১টি ট্রায়াল') : s.tt(`${LIMITS.free[tool]} / month`, `মাসে ${digits('bn', LIMITS.free[tool])}টি`)}</b><small>{scopeText(s, tool, 'free')}</small></div>
              <div className="lsc pro"><span><ProBadge sm /></span><b>{s.tt(`${LIMITS.premium[tool]} / month`, `মাসে ${digits('bn', LIMITS.premium[tool])}টি`)}</b><small>{scopeText(s, tool, 'premium')}</small></div>
            </div>
            <p className="ls-copy">{s.tt('Reading, Paper Cards, figures and discussions stay free either way.', 'যেভাবেই হোক, পড়া, পেপার কার্ড, ফিগার ও আলোচনা ফ্রি থাকবে।')}</p>
          </>
        )}
        <div className="ls-actions">
          {!premium && <Btn block size="lg" onClick={() => { close(); setTimeout(() => s.push('premium', { from: tool }), 10); }}>{s.tt(`See Premium, ৳${PRICE.bdt}/month`, `প্রিমিয়াম দেখুন, মাসে ৳${digits('bn', PRICE.bdt)}`)}</Btn>}
          {saved.length > 0 && <Btn block variant="secondary" onClick={() => { close(); setTimeout(() => s.push('output', { id: saved[0].id }), 10); }}>{s.tt(`Open your saved ${m.unit.en}`, `সেভ করা ${m.unit.bn} খুলুন`)}</Btn>}
          <button className="link-btn tap center" onClick={close}>{premium ? s.t('done') : s.tt(`Not now, wait until ${RESET_DATE.en}`, `এখন না, ${RESET_DATE.bn} পর্যন্ত অপেক্ষা`)}</button>
        </div>
      </div>
    </Sheet>
  );
}

export function PausedSheet() {
  const s = useStore();
  const close = () => s.setSheet(null);
  return (
    <Sheet onClose={close}>
      <div className="limit-sheet">
        <span className="tool-icon paused"><PauseCircle size={26} /></span>
        <h2>{s.tt('Research tools are paused for now', 'রিসার্চ টুলস আপাতত বন্ধ')}</h2>
        <p className="ls-copy">{s.tt(`We set a monthly AI budget so the app never runs up surprise costs. It has been reached, so new jobs restart on ${RESET_DATE.en}. Your allowance was not used.`, `অ্যাপে হঠাৎ খরচ এড়াতে মাসিক এআই বাজেট আছে। সেটি শেষ, তাই নতুন কাজ ${RESET_DATE.bn} চালু হবে। আপনার বরাদ্দ খরচ হয়নি।`)}</p>
        <ul className="ls-list">
          <li><Check size={16} /> {s.tt('Saved outputs open as usual', 'সেভ করা আউটপুট খোলা যাবে')}</li>
          <li><Check size={16} /> {s.tt('Paper Cards, figures, tracker and discussions work', 'পেপার কার্ড, ফিগার, ট্র্যাকার ও আলোচনা চালু')}</li>
        </ul>
        <div className="ls-actions"><Btn block size="lg" onClick={close}>{s.tt('OK', 'ঠিক আছে')}</Btn></div>
      </div>
    </Sheet>
  );
}

/* ---------------- tool setup ---------------- */

export function ToolSetup({ tool, paper, papers }: { tool: ToolId; paper?: string; papers?: string[] }) {
  const s = useStore();
  const m = TOOL_META[tool];
  const left = s.left(tool);
  const [ready, setReady] = useState<Record<string, any> | null>(null);
  const [cachedMap, setCachedMap] = useState<LandscapeMap | null>(null);

  const start = (params: Record<string, any>) => {
    if (s.aiPaused) { s.setSheet({ name: 'paused' }); return; }
    if (left <= 0) { s.setSheet({ name: 'limit', params: { tool } }); return; }
    s.spend(tool);
    s.replace('job', { tool, params, outId: `o${Date.now()}` });
  };
  const openCached = () => {
    const id = `o${Date.now()}`;
    s.addOutput({ id, tool: 'landscape', when: 'Nov 12', plan: 'free', params: { map: cachedMap!.id, n: 8 }, cached: true });
    s.replace('output', { id });
    s.toast(s.tt('Opened a saved map. No allowance used.', 'সেভ করা ম্যাপ খোলা হয়েছে। বরাদ্দ খরচ হয়নি।'));
  };

  const usesLine = s.plan === 'free' && tool === 'roadmap'
    ? s.tt('Uses your one free roadmap trial', 'আপনার একমাত্র ফ্রি রোডম্যাপ ট্রায়াল খরচ হবে')
    : s.tt(`Uses 1 of your ${LIMITS[s.plan][tool]} ${m.units.en} this month`, `এ মাসের ${digits('bn', LIMITS[s.plan][tool])}টি ${m.units.bn}-এর ১টি খরচ হবে`);

  const cta = { landscape: s.tt('Build map', 'ম্যাপ তৈরি'), compare: s.tt('Compare papers', 'পেপার তুলনা'), claim: s.tt('Check this claim', 'দাবি যাচাই'), roadmap: s.tt('Build roadmap', 'রোডম্যাপ তৈরি') }[tool];

  return (
    <div className="screen-col tool-screen">
      <Header title={s.x(m.name)} right={<span className={`quota-chip ${left ? '' : 'out'}`}>{left ? s.tt(`${left} left`, `${digits('bn', left)}টি বাকি`) : s.tt('0 left', '০ বাকি')}</span>} />
      <div className="scroll pad">
        {s.aiPaused && <PausedBanner />}
        <div className="tool-lede">
          <ToolIcon tool={tool} size={22} />
          <p>{s.x(m.desc)}</p>
        </div>
        {tool === 'landscape' && <LandscapeSetup onReady={setReady} onCached={setCachedMap} />}
        {tool === 'compare' && <CompareSetup initial={papers} onReady={setReady} />}
        {tool === 'claim' && <ClaimSetup initial={paper} onReady={setReady} />}
        {tool === 'roadmap' && <RoadmapSetup initial={paper} onReady={setReady} />}
        <div className="bottom-space" />
      </div>
      <div className="bottom-bar tool-bar">
        {cachedMap ? (
          <>
            <Btn block size="lg" icon={<CheckCircle2 size={18} />} onClick={openCached}>{s.tt('Open saved map, free', 'সেভ করা ম্যাপ খুলুন, ফ্রি')}</Btn>
            <button className="link-btn tap center" disabled={!ready} onClick={() => ready && start(ready)}>{s.tt('Build a fresh map instead', 'বদলে নতুন ম্যাপ তৈরি করুন')} <span className="muted">({usesLine.toLowerCase()})</span></button>
          </>
        ) : (
          <>
            <span className="uses-line">{left ? usesLine : quotaText(s, tool)}</span>
            <Btn block size="lg" disabled={!ready} icon={<Sparkles size={18} />} onClick={() => ready && start(ready)}>{cta}</Btn>
          </>
        )}
      </div>
    </div>
  );
}

type ReadyFn = (params: Record<string, any> | null) => void;

function LandscapeSetup({ onReady, onCached }: { onReady: ReadyFn; onCached: (m: LandscapeMap | null) => void }) {
  const s = useStore();
  const cap = SCOPE[s.plan].mapPapers;
  const [topic, setTopic] = useState('');
  const [n, setN] = useState(cap);
  const map = matchMap(topic);
  useEffect(() => {
    onReady(map ? { map: map.id, n } : null);
    onCached(map?.id === 'slm' ? map : null);
  }, [map?.id, n]);
  useEffect(() => setN(cap), [cap]);
  return (
    <>
      <label className="field">
        <span className="field-label">{s.tt('Topic', 'টপিক')}</span>
        <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={s.tt('e.g. small language models', 'যেমন: ছোট ভাষা মডেল')} />
      </label>
      <div className="chip-row wrap" style={{ marginTop: -8, marginBottom: 14 }}>
        {MAPS.map((mp) => <button key={mp.id} className={`chip sm tap ${map?.id === mp.id ? 'on' : ''}`} onClick={() => setTopic(s.x(mp.topic))}>{s.x(mp.topic)}</button>)}
      </div>
      {topic.trim() && !map && <div className="note-box"><Info size={16} /> <span>{s.tt('This demo has prepared maps for the suggested topics. Pick one to see a realistic result.', 'এই ডেমোতে প্রস্তাবিত টপিকগুলোর ম্যাপ প্রস্তুত আছে। বাস্তবসম্মত ফল দেখতে একটি বাছুন।')}</span></div>}
      {map?.id === 'slm' && (
        <div className="cached-box">
          <CheckCircle2 size={18} />
          <span><b>{s.tt('A saved map for this topic already exists', 'এই টপিকের একটি সেভ করা ম্যাপ আছে')}</b>{s.tt('Made on Nov 12 from 8 papers. Opening it is free and does not use your allowance.', '১২ নভেম্বর ৮টি পেপার থেকে তৈরি। খোলা ফ্রি, বরাদ্দ খরচ হবে না।')}</span>
        </div>
      )}
      <div className="field">
        <span className="field-label">{s.tt('Papers to include', 'কতগুলো পেপার')}<span className="field-count">{digits(s.lang, n)}</span></span>
        <input type="range" className="range" min={4} max={cap} value={n} onChange={(e) => setN(+e.target.value)} aria-label={s.tt('Papers to include', 'কতগুলো পেপার')} />
        <span className="range-ends"><span>{digits(s.lang, 4)}</span><span>{s.tt(`Max ${cap} on your plan`, `আপনার প্ল্যানে সর্বোচ্চ ${digits('bn', cap)}`)}</span></span>
        {s.plan === 'free' && <button className="pro-hint tap" onClick={() => s.push('premium', { from: 'landscape' })}><Lock size={14} /> {s.tt('Premium maps include up to 25 papers, plus papers outside our collection', 'প্রিমিয়াম ম্যাপে সর্বোচ্চ ২৫টি পেপার, আমাদের সংগ্রহের বাইরেরও')}</button>}
      </div>
      <WhatYouGet items={[
        s.tt('3–5 themes: the main approaches in the topic', '৩–৫টি থিম: টপিকের প্রধান পদ্ধতি'),
        s.tt('Representative papers for each theme', 'প্রতিটি থিমের প্রতিনিধি পেপার'),
        s.tt('How the themes connect, with reasons', 'থিমগুলো কীভাবে যুক্ত, কারণসহ'),
        s.tt('Open questions worth investigating', 'অনুসন্ধানের মতো খোলা প্রশ্ন'),
      ]} limits={s.tt('Uses titles, abstracts and citation links from OpenAlex and Semantic Scholar. It does not read full papers, and it is not exhaustive.', 'OpenAlex ও Semantic Scholar থেকে শিরোনাম, অ্যাবস্ট্রাক্ট ও সাইটেশন সংযোগ ব্যবহার করে। পুরো পেপার পড়ে না, সম্পূর্ণ তালিকাও নয়।')} />
    </>
  );
}

function WhatYouGet({ items, limits }: { items: string[]; limits: string }) {
  const s = useStore();
  return (
    <div className="wyg">
      <span className="field-label">{s.tt('What you’ll get', 'যা পাবেন')}</span>
      <ul>{items.map((i) => <li key={i}><Check size={15} /> {i}</li>)}</ul>
      <p className="fine"><Info size={13} /> {limits}</p>
    </div>
  );
}

function CompareSetup({ initial = [], onReady }: { initial?: string[]; onReady: ReadyFn }) {
  const s = useStore();
  const cap = SCOPE[s.plan].comparePapers;
  const [sel, setSel] = useState<string[]>(() => initial.filter((id) => PX[id]).slice(0, cap));
  const [q, setQ] = useState('');
  useEffect(() => { onReady(sel.length >= 2 ? { papers: sel } : null); }, [sel.join()]);
  const full = sel.length >= cap;
  const list = COLLECTION.filter((id) => !q.trim() || findPaper(s, id)!.title.toLowerCase().includes(q.toLowerCase()));
  const toggle = (id: string) => setSel((x) => (x.includes(id) ? x.filter((y) => y !== id) : full ? x : [...x, id]));
  return (
    <>
      <div className="sel-bar">
        <span className="field-label">{s.tt('Selected', 'নির্বাচিত')} <span className="field-count">{digits(s.lang, sel.length)}/{digits(s.lang, cap)}</span></span>
        <div className="chip-row wrap">
          {sel.map((id) => <button key={id} className="chip sm on tap" onClick={() => toggle(id)}>{shortTitle(findPaper(s, id)!.title)} <X size={13} /></button>)}
          {!sel.length && <span className="sub">{s.tt('Pick 2 or more papers', '২ বা তার বেশি পেপার বাছুন')}</span>}
        </div>
      </div>
      {full && (
        <div className="note-box cap-note">
          <Info size={16} />
          <span>{s.plan === 'free'
            ? <>{s.tt('Free comparisons include up to 3 papers. Premium compares up to 5.', 'ফ্রি তুলনায় সর্বোচ্চ ৩টি পেপার। প্রিমিয়ামে ৫টি।')} <button className="link-btn tap inline" onClick={() => s.push('premium', { from: 'compare' })}>{s.tt('See Premium', 'প্রিমিয়াম দেখুন')}</button></>
            : s.tt('Each comparison includes up to 5 papers, so results stay readable and costs stay bounded.', 'প্রতি তুলনায় সর্বোচ্চ ৫টি পেপার, যাতে ফল পড়া সহজ ও খরচ সীমিত থাকে।')}</span>
        </div>
      )}
      <label className="search sm-search">
        <Search size={17} aria-hidden="true" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={s.tt('Filter papers', 'পেপার খুঁজুন')} aria-label={s.tt('Filter papers', 'পেপার খুঁজুন')} />
      </label>
      <div className="pick-list">
        {list.map((id) => {
          const p = findPaper(s, id)!;
          const on = sel.includes(id);
          const dis = !on && full;
          return (
            <button key={id} className={`pick-row tap ${on ? 'on' : ''}`} disabled={dis} onClick={() => toggle(id)} aria-pressed={on}>
              <span className={`checkbox ${on ? 'on' : ''}`}>{on && <Check size={14} strokeWidth={3} />}</span>
              <span className="res-text"><b>{p.title}</b><span className="sub">{p.authors}, {p.source}</span></span>
            </button>
          );
        })}
      </div>
      <WhatYouGet items={[
        s.tt('Method, data, reported results, strengths and weaknesses for each paper', 'প্রতিটি পেপারের পদ্ধতি, ডেটা, ফল, শক্তি ও দুর্বলতা'),
        s.tt('A section or table reference for every cell', 'প্রতিটি ঘরে অংশ বা টেবিলের সূত্র'),
        s.tt('Missing and non-comparable results marked clearly', 'অনুপস্থিত ও অতুলনীয় ফল স্পষ্টভাবে চিহ্নিত'),
      ]} limits={s.tt(`Reads up to ${SCOPE[s.plan].pagesPerPaper} pages per paper from accessible full text.`, `প্রবেশযোগ্য পুরো টেক্সট থেকে প্রতি পেপারে সর্বোচ্চ ${digits('bn', SCOPE[s.plan].pagesPerPaper)} পৃষ্ঠা পড়ে।`)} />
    </>
  );
}

const UNSUPPORTED = ['p8', 'p11', 'p17'];

function ClaimSetup({ initial, onReady }: { initial?: string; onReady: ReadyFn }) {
  const s = useStore();
  const supported = COLLECTION.filter((id) => PX[id].claims?.length);
  const [paper, setPaper] = useState<string | null>(initial && PX[initial]?.claims ? initial : null);
  const [claim, setClaim] = useState<string | null>(null);
  useEffect(() => { setClaim(paper ? PX[paper].claims![0].id : null); }, [paper]);
  useEffect(() => { onReady(paper && claim ? { paper, claim } : null); }, [paper, claim]);
  return (
    <>
      <span className="field-label step-label"><span className="step-n">{digits(s.lang, 1)}</span>{s.tt('Choose a paper', 'পেপার বাছুন')}</span>
      <div className="pick-list">
        {supported.map((id) => (
          <button key={id} className={`pick-row tap ${paper === id ? 'on' : ''}`} onClick={() => setPaper(id)} aria-pressed={paper === id}>
            <span className={`radio ${paper === id ? 'on' : ''}`} />
            <span className="res-text"><b>{findPaper(s, id)!.title}</b><span className="sub">{digits(s.lang, PX[id].claims!.length)} {s.tt('key claims found', 'প্রধান দাবি পাওয়া গেছে')}</span></span>
          </button>
        ))}
        {UNSUPPORTED.map((id) => (
          <div key={id} className="pick-row disabled" aria-disabled="true">
            <span className="radio" />
            <span className="res-text"><b>{findPaper(s, id)!.title}</b><span className="sub">{s.tt('Not supported yet: full-text sections not accessible', 'এখনো সমর্থিত নয়: পুরো টেক্সট পাওয়া যায় না')}</span></span>
          </div>
        ))}
      </div>
      {paper && (
        <>
          <span className="field-label step-label"><span className="step-n">{digits(s.lang, 2)}</span>{s.tt('Choose one claim', 'একটি দাবি বাছুন')}</span>
          <div className="claim-pick">
            {PX[paper].claims!.map((c) => (
              <button key={c.id} className={`claim-opt tap ${claim === c.id ? 'on' : ''}`} onClick={() => setClaim(c.id)} aria-pressed={claim === c.id}>
                <span className={`radio ${claim === c.id ? 'on' : ''}`} />
                <span><q>{s.x(c.text)}</q><span className="sub">{c.where}</span></span>
              </button>
            ))}
          </div>
        </>
      )}
      <p className="fine" style={{ marginTop: 14 }}><Info size={13} /> {s.tt('This traces the paper’s own evidence for a claim. It is not an automatic fact check.', 'এটি দাবির পক্ষে পেপারের নিজস্ব প্রমাণ খুঁজে দেখায়। এটি স্বয়ংক্রিয় তথ্য-যাচাই নয়।')}</p>
    </>
  );
}

function RoadmapSetup({ initial, onReady }: { initial?: string; onReady: ReadyFn }) {
  const s = useStore();
  const supported = Object.keys(ROADMAPS);
  const [paper, setPaper] = useState<string | null>(initial && ROADMAPS[initial] ? initial : null);
  useEffect(() => { onReady(paper ? { paper } : null); }, [paper]);
  return (
    <>
      <span className="field-label">{s.tt('Choose a paper', 'পেপার বাছুন')}</span>
      <div className="pick-list">
        {supported.map((id) => (
          <button key={id} className={`pick-row tap ${paper === id ? 'on' : ''}`} onClick={() => setPaper(id)} aria-pressed={paper === id}>
            <span className={`radio ${paper === id ? 'on' : ''}`} />
            <span className="res-text"><b>{findPaper(s, id)!.title}</b><span className="sub">{PX[id].code?.repo}</span></span>
          </button>
        ))}
        {['p8', 'p3'].map((id) => (
          <div key={id} className="pick-row disabled" aria-disabled="true">
            <span className="radio" />
            <span className="res-text"><b>{findPaper(s, id)!.title}</b><span className="sub">{id === 'p8' ? s.tt('Not supported: model weights and data are not public', 'সমর্থিত নয়: মডেল ওয়েট ও ডেটা পাবলিক নয়') : s.tt('Coming soon', 'শীঘ্রই')}</span></span>
          </div>
        ))}
      </div>
      {paper && (
        <div className="wyg">
          <span className="field-label">{s.tt('What we’ll read', 'যা পড়া হবে')}</span>
          <ul>
            <li><FileText size={15} /> {s.tt(`Method and appendix sections (up to ${SCOPE[s.plan].pagesPerPaper} pages)`, `পদ্ধতি ও পরিশিষ্ট (সর্বোচ্চ ${digits('bn', SCOPE[s.plan].pagesPerPaper)} পৃষ্ঠা)`)}</li>
            <li><FileText size={15} /> {s.tt('Linked code:', 'সংযুক্ত কোড:')} {PX[paper].code?.repo}</li>
            <li><FileText size={15} /> {s.tt('Datasets named in the paper', 'পেপারে উল্লেখিত ডেটাসেট')}</li>
          </ul>
          <p className="fine"><Info size={13} /> {s.tt('The roadmap is a plan. It does not run experiments or promise that results will reproduce.', 'রোডম্যাপ একটি পরিকল্পনা। এটি পরীক্ষা চালায় না, ফল মিলবে এমন নিশ্চয়তাও দেয় না।')}</p>
        </div>
      )}
    </>
  );
}

/* ---------------- job runner ---------------- */

type Tag = 'source' | 'small' | 'strong' | 'save';
const JOB_TAGS: Record<ToolId, Tag[]> = {
  landscape: ['source', 'source', 'source', 'strong', 'strong', 'save'],
  compare: ['source', 'small', 'small', 'strong', 'save'],
  claim: ['small', 'small', 'source', 'strong', 'save'],
  roadmap: ['small', 'source', 'strong', 'strong', 'save'],
};

function jobCaps(s: Store, tool: ToolId, params: Record<string, any>) {
  const sc = SCOPE[s.plan];
  if (tool === 'landscape') return { papers: Math.min(params.n, landscapeCount(s.plan, params.map)), papersCap: sc.mapPapers, pages: 0, pagesCap: 0, tokensCap: s.plan === 'premium' ? 120 : 60 };
  if (tool === 'compare') return { papers: params.papers.length, papersCap: sc.comparePapers, pages: params.papers.length * 18, pagesCap: params.papers.length * sc.pagesPerPaper, tokensCap: params.papers.length * 30 };
  return { papers: 1, papersCap: 1, pages: tool === 'claim' ? 9 : 22, pagesCap: tool === 'claim' ? 12 : sc.pagesPerPaper, tokensCap: tool === 'claim' ? 40 : 50 };
}

export function landscapeCount(plan: Plan, mapId: string) {
  const m = MAPS.find((x) => x.id === mapId)!;
  const inCol = m.themes.reduce((a, t) => a + t.papers.length, 0);
  const ext = m.themes.reduce((a, t) => a + t.external.length, 0);
  return plan === 'premium' ? Math.min(25, inCol + ext) : Math.min(8, inCol);
}

export function JobScreen({ tool, params, outId }: { tool: ToolId; params: Record<string, any>; outId: string }) {
  const s = useStore();
  const steps = JOB_STEPS[tool];
  const tags = JOB_TAGS[tool];
  const [i, setI] = useState(0);
  const [frac, setFrac] = useState(0);
  const caps = useMemo(() => jobCaps(s, tool, params), []);
  const finished = useRef(false);
  const saveOutput = () => {
    if (finished.current) return;
    finished.current = true;
    s.addOutput({ id: outId, tool, when: 'Nov 20', plan: s.plan, params });
  };
  useEffect(() => {
    if (i >= steps.length) {
      saveOutput();
      const id = setTimeout(() => { s.replace('output', { id: outId }); s.toast(s.tt('Saved to your outputs', 'আপনার আউটপুটে সেভ হয়েছে')); }, 500);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setI(i + 1), i === 0 ? 900 : 1150);
    return () => clearTimeout(id);
  }, [i]);
  useEffect(() => {
    const id = setInterval(() => setFrac((f) => Math.min(1, f + 1 / (steps.length * 11))), 100);
    return () => clearInterval(id);
  }, []);
  const prog = Math.min(1, i >= steps.length ? 1 : frac);
  const leave = () => {
    saveOutput();
    s.back();
    s.toast(s.tt('Still working. It will appear in your saved outputs.', 'কাজ চলছে। সেভ করা আউটপুটে দেখাবে।'));
  };
  const detail = (k: number) => {
    if (tool === 'landscape') {
      const m = MAPS.find((x) => x.id === params.map)!;
      return [s.tt(`${m.candidates} candidate papers`, `${digits('bn', m.candidates)}টি সম্ভাব্য পেপার`), s.tt(`Kept the ${caps.papers} most relevant`, `সবচেয়ে প্রাসঙ্গিক ${digits('bn', caps.papers)}টি রাখা হয়েছে`), s.tt(`${m.links.length * 6 + 3} citation links`, `${digits('bn', m.links.length * 6 + 3)}টি সাইটেশন সংযোগ`), s.tt(`${m.themes.length} themes`, `${digits('bn', m.themes.length)}টি থিম`), s.tt(`${m.links.length} links, ${m.questions.length + (s.plan === 'premium' ? m.extraQuestions.length : 0)} questions`, `${digits('bn', m.links.length)}টি সংযোগ, ${digits('bn', m.questions.length)}টি প্রশ্ন`), ''][k];
    }
    if (tool === 'compare') return [s.tt(`${params.papers.length} papers`, `${digits('bn', params.papers.length)}টি পেপার`), s.tt(`${caps.pages} pages`, `${digits('bn', caps.pages)} পৃষ্ঠা`), s.tt(`5 fields × ${params.papers.length} papers`, `৫টি তথ্য × ${digits('bn', params.papers.length)}টি পেপার`), '', ''][k];
    if (tool === 'claim') return ['', s.tt(`${PX[params.paper].claims!.find((c) => c.id === params.claim)!.evidence.length} experiments`, `${digits('bn', PX[params.paper].claims!.find((c) => c.id === params.claim)!.evidence.length)}টি পরীক্ষা`), PX[params.paper].review ? s.tt('Reviews found', 'রিভিউ পাওয়া গেছে') : s.tt('No public reviews', 'পাবলিক রিভিউ নেই'), '', ''][k];
    return ['', PX[params.paper].code?.repo || '', '', '', ''][k];
  };
  const tagLabel: Record<Tag, string> = { source: s.tt('Source', 'উৎস'), small: s.tt('Small model', 'ছোট মডেল'), strong: s.tt('Strong model', 'বড় মডেল'), save: s.tt('Saved', 'সেভ') };
  const tokens = Math.round(caps.tokensCap * 0.62 * prog);
  return (
    <div className="screen-col job-screen">
      <header className="header">
        <button className="icon-btn tap" onClick={leave} aria-label={s.tt('Leave, keep working', 'বেরিয়ে যান, কাজ চলবে')}><X size={22} /></button>
        <div className="header-title">{s.x(TOOL_META[tool].short)}</div>
        <div className="header-right" />
      </header>
      <div className="scroll pad">
        <div className="job-head">
          <span className="job-kicker">{i >= steps.length ? s.tt('Done', 'সম্পন্ন') : s.tt('Working on it', 'কাজ চলছে')}</span>
          <h1>{tool === 'landscape' ? s.x(MAPS.find((m) => m.id === params.map)!.topic) : tool === 'compare' ? (params.papers as string[]).map((id) => shortTitle(findPaper(s, id)!.title)).join(' · ') : findPaper(s, params.paper)!.title}</h1>
          <div className="job-bar"><span style={{ width: `${prog * 100}%` }} /></div>
        </div>
        <ol className="job-steps">
          {steps.map((st, k) => {
            const state = k < i ? 'done' : k === i ? 'run' : 'wait';
            return (
              <li key={k} className={`job-step ${state}`}>
                <span className="js-icon">{state === 'done' ? <CircleCheck size={20} /> : state === 'run' ? <LoaderCircle size={20} className="spin" /> : <CircleDashed size={20} />}</span>
                <span className="js-text">
                  <b>{s.x(st)}</b>
                  {state !== 'wait' && detail(k) && <span>{detail(k)}</span>}
                </span>
                <span className={`js-tag ${tags[k]}`}>{tagLabel[tags[k]]}</span>
              </li>
            );
          })}
        </ol>
        <div className="job-caps">
          <span className="jc-title">{s.tt('This job has fixed limits', 'এই কাজের নির্দিষ্ট সীমা আছে')}</span>
          <div className="jc-row"><span>{s.tt('Papers', 'পেপার')}</span><Progress value={caps.papers / caps.papersCap} thin /><b>{digits(s.lang, caps.papers)}/{digits(s.lang, caps.papersCap)}</b></div>
          {caps.pagesCap > 0 ? (
            <div className="jc-row"><span>{s.tt('Pages read', 'পৃষ্ঠা পড়া')}</span><Progress value={(caps.pages * prog) / caps.pagesCap} thin /><b>{digits(s.lang, Math.round(caps.pages * prog))}/{digits(s.lang, caps.pagesCap)}</b></div>
          ) : (
            <div className="jc-row"><span>{s.tt('Pages read', 'পৃষ্ঠা পড়া')}</span><span className="jc-note">{s.tt('Abstracts only', 'শুধু অ্যাবস্ট্রাক্ট')}</span></div>
          )}
          <div className="jc-row"><span>{s.tt('AI tokens', 'এআই টোকেন')}</span><Progress value={tokens / caps.tokensCap} thin /><b>{digits(s.lang, tokens)}K/{digits(s.lang, caps.tokensCap)}K</b></div>
        </div>
        <p className="job-foot">{s.tt('You can close this screen. The job keeps running and the result is saved to your outputs.', 'স্ক্রিন বন্ধ করতে পারেন। কাজ চলবে এবং ফল আপনার আউটপুটে সেভ হবে।')}</p>
      </div>
    </div>
  );
}

/* ---------------- outputs ---------------- */

export function OutputScreen({ id }: { id: string }) {
  const s = useStore();
  const o = s.outputs.find((x) => x.id === id);
  if (!o) return <div className="screen-col"><Header /><Empty icon={<Sparkles size={26} />} title={s.tt('Output not found', 'আউটপুট পাওয়া যায়নি')} /></div>;
  return (
    <div className="screen-col">
      <Header title={s.x(TOOL_META[o.tool].short)} right={<button className="icon-btn tap" onClick={() => s.setSheet({ name: 'share', params: { id } })} aria-label={s.t('share')}><Share2 size={21} /></button>} />
      <div className="scroll">
        {o.tool === 'landscape' && <LandscapeOut o={o} />}
        {o.tool === 'compare' && <MatrixOut o={o} />}
        {o.tool === 'claim' && <ClaimOut o={o} />}
        {o.tool === 'roadmap' && <RoadmapOut o={o} />}
        <div className="bottom-space" />
      </div>
    </div>
  );
}

function OutHead({ o, title, meta }: { o: Output; title: string; meta: React.ReactNode }) {
  const s = useStore();
  return (
    <div className="out-head pad">
      <span className="out-kicker"><ToolIcon tool={o.tool} size={15} /> {s.x(TOOL_META[o.tool].name)}</span>
      <h1>{title}</h1>
      <div className="out-meta">{meta}</div>
    </div>
  );
}

const THEME_HUES = [172, 210, 330, 36, 140];

function LandscapeOut({ o }: { o: Output }) {
  const s = useStore();
  const m = MAPS.find((x) => x.id === o.params.map)!;
  const expanded = o.plan === 'premium' && !o.cached;
  const [sel, setSel] = useState<string | null>(null);
  const refs = useRef<Record<string, HTMLElement | null>>({});
  // free: cap collection papers at 8
  let budget = expanded ? 25 : 8;
  const themes = m.themes.map((t) => {
    const papers = t.papers.slice(0, Math.max(0, budget));
    budget -= papers.length;
    const external = expanded ? t.external : [];
    return { ...t, papers, external };
  });
  const total = themes.reduce((a, t) => a + t.papers.length + t.external.length, 0);
  const hiddenExt = m.themes.reduce((a, t) => a + t.external.length, 0);
  const W = 360, H = 300, cx = 180, cy = 150, R = 98;
  const pos = themes.map((_, i) => {
    const a = (-90 + (i * 360) / themes.length) * (Math.PI / 180);
    return { x: cx + R * Math.cos(a) * 1.2, y: cy + R * Math.sin(a) * 0.9 };
  });
  const idx = (tid: string) => themes.findIndex((t) => t.id === tid);
  const pick = (tid: string) => { setSel(tid); refs.current[tid]?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const wrap = (txt: string) => {
    const w = txt.split(' ');
    if (txt.length < 14 || w.length < 2) return [txt];
    const mid = Math.ceil(w.length / 2);
    return [w.slice(0, mid).join(' '), w.slice(mid).join(' ')];
  };
  return (
    <>
      <OutHead o={o} title={s.x(m.topic)} meta={<>
        <span>{o.when}</span><span className="dot-sep" /><span>{digits(s.lang, total)} {s.tt('papers', 'পেপার')}</span><span className="dot-sep" />
        {expanded ? <ProBadge sm /> : <span>{o.cached ? s.tt('Shared map', 'শেয়ার করা ম্যাপ') : s.tt('Starter map', 'স্টার্টার ম্যাপ')}</span>}
      </>} />
      <div className="pad-x">
        <figure className="map-fig">
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={s.tt('Map of themes and how they connect', 'থিম ও সংযোগের ম্যাপ')}>
            {m.links.map((l, k) => {
              const a = pos[idx(l.a)], b2 = pos[idx(l.b)];
              if (!a || !b2) return null;
              const mx = (a.x + b2.x) / 2, my = (a.y + b2.y) / 2;
              const on = sel === l.a || sel === l.b;
              return (
                <g key={k} className={`map-link ${on ? 'on' : ''}`}>
                  <line x1={a.x} y1={a.y} x2={b2.x} y2={b2.y} />
                  <circle cx={mx} cy={my} r={9} />
                  <text x={mx} y={my + 4} textAnchor="middle">{digits(s.lang, k + 1)}</text>
                </g>
              );
            })}
            {themes.map((t, i) => {
              const n = t.papers.length + t.external.length;
              const r = 15 + n * 3;
              const h = THEME_HUES[i % THEME_HUES.length];
              const lines = wrap(s.x(t.name));
              const below = pos[i].y > cy - 10;
              return (
                <g key={t.id} className={`map-node ${sel === t.id ? 'on' : ''}`} onClick={() => pick(t.id)} style={{ cursor: 'pointer' }} role="button" tabIndex={0} aria-label={s.x(t.name)} onKeyDown={(e) => e.key === 'Enter' && pick(t.id)}>
                  <circle cx={pos[i].x} cy={pos[i].y} r={r} style={{ fill: `hsl(${h} 55% 90%)`, stroke: `hsl(${h} 50% 40%)` }} />
                  <text x={pos[i].x} y={pos[i].y + 5} textAnchor="middle" className="map-n" style={{ fill: `hsl(${h} 55% 25%)` }}>{digits(s.lang, n)}</text>
                  {lines.map((ln, k) => (
                    <text key={k} x={pos[i].x} y={below ? pos[i].y + r + 13 + k * 12 : pos[i].y - r - 6 - (lines.length - 1 - k) * 12} textAnchor="middle" className="map-label">{ln}</text>
                  ))}
                </g>
              );
            })}
          </svg>
          <figcaption>{s.tt('Circle size shows how many papers. Tap a theme to jump to it.', 'বৃত্তের আকার পেপারের সংখ্যা। থিমে ট্যাপ করে সেখানে যান।')}</figcaption>
        </figure>

        <div className="sec-head"><h3>{s.tt('How the themes connect', 'থিমগুলো কীভাবে যুক্ত')}</h3></div>
        <ol className="link-list">
          {m.links.map((l, k) => (
            <li key={k}><span className="ll-n">{digits(s.lang, k + 1)}</span><span><b>{s.x(themes[idx(l.a)].name)} ↔ {s.x(themes[idx(l.b)].name)}</b>{s.x(l.label)}</span></li>
          ))}
        </ol>

        <div className="sec-head"><h3>{s.tt('Main approaches', 'প্রধান পদ্ধতি')}</h3></div>
        <div className="list">
          {themes.map((t, i) => (
            <section key={t.id} ref={(el) => { refs.current[t.id] = el; }} className={`theme-card ${sel === t.id ? 'on' : ''}`} style={{ ['--h' as string]: THEME_HUES[i % THEME_HUES.length] }}>
              <h4>{s.x(t.name)}</h4>
              <p>{s.x(t.summary)}</p>
              {t.papers.map((pid) => {
                const p = findPaper(s, pid)!;
                return <button key={pid} className="theme-paper tap" onClick={() => s.push('paper', { id: pid })}><FileText size={14} /> <span>{p.title}</span> <span className="muted">{p.year}</span></button>;
              })}
              {t.external.map((e) => <div key={e.title} className="theme-paper ext"><FileText size={14} /> <span>{e.title}</span> <span className="muted">{e.year}</span> <span className="ext-tag">{s.tt('Not in collection', 'সংগ্রহে নেই')}</span></div>)}
              {!t.papers.length && !t.external.length && <p className="fine">{s.tt('Outside this map’s paper limit.', 'এই ম্যাপের পেপার সীমার বাইরে।')}</p>}
            </section>
          ))}
        </div>

        <div className="sec-head"><h3>{s.tt('Open questions worth investigating', 'অনুসন্ধানের মতো খোলা প্রশ্ন')}</h3></div>
        <ul className="q-list">
          {[...m.questions, ...(expanded ? m.extraQuestions : [])].map((q, k) => <li key={k}><Telescope size={16} /> {s.x(q)}</li>)}
        </ul>
        {!expanded && hiddenExt > 0 && (
          <button className="pro-teaser tap" onClick={() => s.push('premium', { from: 'landscape' })}>
            <Lock size={16} />
            <span><b>{s.tt(`An expanded map adds ${hiddenExt} more papers and ${m.extraQuestions.length} more questions`, `বর্ধিত ম্যাপে আরও ${digits('bn', hiddenExt)}টি পেপার ও ${digits('bn', m.extraQuestions.length)}টি প্রশ্ন`)}</b>{s.tt('Including papers outside our collection. Premium.', 'আমাদের সংগ্রহের বাইরের পেপারসহ। প্রিমিয়াম।')}</span>
            <ChevronRight size={18} />
          </button>
        )}
        <Sources lines={[
          s.tt(`Retrieved ${m.candidates} candidates from OpenAlex; kept ${total} by relevance and citations.`, `OpenAlex থেকে ${digits('bn', m.candidates)}টি সম্ভাব্য পেপার; প্রাসঙ্গিকতা ও সাইটেশনে ${digits('bn', total)}টি রাখা।`),
          s.tt('Citation links from Semantic Scholar. Themes and explanations written by AI and saved.', 'সাইটেশন সংযোগ Semantic Scholar থেকে। থিম ও ব্যাখ্যা এআই লিখেছে ও সেভ করা।'),
          s.tt('A starting point, not a complete survey. Check the papers themselves.', 'এটি শুরুর জায়গা, সম্পূর্ণ সার্ভে নয়। মূল পেপার যাচাই করুন।'),
        ]} />
      </div>
    </>
  );
}

function Sources({ lines }: { lines: string[] }) {
  const s = useStore();
  return (
    <div className="sources">
      <span className="jc-title"><ShieldCheck size={15} /> {s.tt('Sources and limits', 'উৎস ও সীমা')}</span>
      <ul>{lines.map((l, i) => <li key={i}>{l}</li>)}</ul>
    </div>
  );
}

function MatrixOut({ o }: { o: Output }) {
  const s = useStore();
  const ids: string[] = o.params.papers;
  const benches = new Set(ids.map((id) => PX[id].extract.result?.bench).filter(Boolean));
  const missing = ids.filter((id) => !PX[id].extract.result);
  const rows: [string, (id: string) => React.ReactNode][] = [
    [s.tt('Method', 'পদ্ধতি'), (id) => <Cell e={PX[id].extract.method} />],
    [s.tt('Data', 'ডেটা'), (id) => <Cell e={PX[id].extract.data} />],
    [s.tt('Reported result', 'প্রকাশিত ফল'), (id) => PX[id].extract.result ? <Cell e={PX[id].extract.result!} /> : <span className="cell-missing">{s.tt('Not reported as a single number', 'একক সংখ্যায় প্রকাশিত নয়')}</span>],
    [s.tt('Strengths', 'শক্তি'), (id) => <span>{s.x(PX[id].extract.strengths)}</span>],
    [s.tt('Weaknesses', 'দুর্বলতা'), (id) => <span>{s.x(PX[id].extract.weaknesses)}</span>],
  ];
  return (
    <>
      <OutHead o={o} title={ids.map((id) => shortTitle(findPaper(s, id)!.title)).join(s.tt(' vs ', ' বনাম '))} meta={<><span>{o.when}</span><span className="dot-sep" /><span>{digits(s.lang, ids.length)} {s.tt('papers', 'পেপার')}</span><span className="dot-sep" />{o.plan === 'premium' ? <ProBadge sm /> : <span>{s.tt('Free plan', 'ফ্রি প্ল্যান')}</span>}</>} />
      {benches.size > 1 && (
        <div className="pad-x"><div className="note-box warn"><TriangleAlert size={16} /> <span>{s.tt('These results come from different benchmarks, so the numbers are not directly comparable.', 'এই ফলগুলো ভিন্ন বেঞ্চমার্কের, তাই সংখ্যাগুলো সরাসরি তুলনীয় নয়।')}</span></div></div>
      )}
      <div className="matrix-wrap" role="region" aria-label={s.tt('Comparison table, scroll sideways', 'তুলনা টেবিল, পাশে স্ক্রল করুন')} tabIndex={0}>
        <table className="matrix">
          <thead>
            <tr><th className="mx-corner" />{ids.map((id) => <th key={id}><button className="tap mx-paper" onClick={() => s.push('paper', { id })}>{shortTitle(findPaper(s, id)!.title)}<small>{findPaper(s, id)!.source}</small></button></th>)}</tr>
          </thead>
          <tbody>
            {rows.map(([label, f]) => <tr key={label}><th scope="row">{label}</th>{ids.map((id) => <td key={id}>{f(id)}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
      <p className="fine pad-x swipe-hint">{s.tt('Swipe the table sideways to see every paper.', 'সব পেপার দেখতে টেবিল পাশে সরান।')}</p>
      <div className="pad-x">
        <div className="sec-head"><h3>{s.tt('Key differences', 'মূল পার্থক্য')}</h3></div>
        <ul className="diff-list">
          {ids.map((id) => <li key={id}><b>{shortTitle(findPaper(s, id)!.title)}</b> {s.x(PX[id].extract.method.t)}</li>)}
          {missing.length > 0 && <li><b>{s.tt('Missing', 'অনুপস্থিত')}</b> {missing.map((id) => shortTitle(findPaper(s, id)!.title)).join(', ')} {s.tt('does not report a single headline number.', 'একক প্রধান সংখ্যা প্রকাশ করেনি।')}</li>}
        </ul>
        <Sources lines={[
          s.tt(`Read methods, experiments and results sections, up to ${SCOPE[o.plan].pagesPerPaper} pages per paper.`, `পদ্ধতি, পরীক্ষা ও ফলাফল অংশ, প্রতি পেপারে সর্বোচ্চ ${digits('bn', SCOPE[o.plan].pagesPerPaper)} পৃষ্ঠা।`),
          s.tt('Fields extracted by a small model; differences written by a stronger model. Every cell links to a section or table.', 'ছোট মডেলে তথ্য বের করা; বড় মডেলে পার্থক্য লেখা। প্রতিটি ঘরে অংশ বা টেবিলের সূত্র।'),
        ]} />
      </div>
    </>
  );
}

function Cell({ e }: { e: { t: { en: string; bn: string } | string; ref: string } }) {
  const s = useStore();
  return <span>{s.x(e.t)} <span className="ref">{e.ref}</span></span>;
}

function ClaimOut({ o }: { o: Output }) {
  const s = useStore();
  const p = findPaper(s, o.params.paper)!;
  const c = PX[o.params.paper].claims!.find((x) => x.id === o.params.claim)!;
  return (
    <>
      <OutHead o={o} title={p.title} meta={<><span>{o.when}</span><span className="dot-sep" /><span>{p.authors}, {p.year}</span></>} />
      <div className="pad-x">
        <blockquote className="claim-quote"><q>{s.x(c.text)}</q><span>{c.where}</span></blockquote>
        <div className="sec-head"><h3><CircleCheck size={16} className="pos-ic" /> {s.tt('Evidence in the paper', 'পেপারে প্রমাণ')}</h3></div>
        <div className="list">
          {c.evidence.map((e, k) => (
            <div key={k} className="ev-card">
              <span className="ev-top"><span className="ref lg">{e.ref}</span><span className={`ev-strength ${e.strength}`}>{e.strength === 'strong' ? s.tt('Direct support', 'সরাসরি সমর্থন') : s.tt('Partial support', 'আংশিক সমর্থন')}</span></span>
              <p>{s.x(e.what)}</p>
            </div>
          ))}
        </div>
        <div className="sec-head"><h3><CircleHelp size={16} className="mid-ic" /> {s.tt('It depends on these assumptions', 'যে অনুমানের উপর নির্ভর করে')}</h3></div>
        <ul className="plain-list">{c.assumptions.map((a, k) => <li key={k}>{s.x(a)}</li>)}</ul>
        <div className="sec-head"><h3><CircleX size={16} className="neg-ic" /> {s.tt('What this evidence does not show', 'এই প্রমাণ যা দেখায় না')}</h3></div>
        <ul className="plain-list">{c.notShown.map((a, k) => <li key={k}>{s.x(a)}</li>)}</ul>
        {c.reviewer && (
          <>
            <div className="sec-head"><h3>{s.tt('Reviewer notes', 'রিভিউয়ারের মন্তব্য')} <span className="muted">OpenReview</span></h3></div>
            <div className="note-box">{s.x(c.reviewer)}</div>
          </>
        )}
        <div className="note-box disclaimer"><Info size={16} /> <span>{s.tt('This breaks down the paper’s own evidence. It is not an automatic fact check, and it does not say whether the claim is true.', 'এটি পেপারের নিজস্ব প্রমাণ ভেঙে দেখায়। এটি স্বয়ংক্রিয় তথ্য-যাচাই নয়, দাবিটি সত্য কিনা তাও বলে না।')}</span></div>
        <Sources lines={[
          s.tt(`Read ${c.where} and the cited tables and figures (about 9 pages).`, `${c.where} এবং উল্লেখিত টেবিল ও ফিগার (প্রায় ৯ পৃষ্ঠা) পড়া হয়েছে।`),
          PX[o.params.paper].review ? s.tt(`Public reviews from OpenReview (${PX[o.params.paper].review!.venue}).`, `OpenReview-এর পাবলিক রিভিউ (${PX[o.params.paper].review!.venue})।`) : s.tt('No public reviews were available.', 'পাবলিক রিভিউ পাওয়া যায়নি।'),
        ]} />
      </div>
    </>
  );
}

function RoadmapOut({ o }: { o: Output }) {
  const s = useStore();
  const r = ROADMAPS[o.params.paper];
  const p = findPaper(s, r.paper)!;
  const x = PX[r.paper];
  const items = [...r.steps.map((_, k) => `st${k}`), ...r.evaluation.map((_, k) => `ev${k}`)];
  const k = (id: string) => `rm:${o.id}:${id}`;
  const done = items.filter((id) => s.known.has(k(id))).length;
  const pres = x.prereqs.filter((pr) => r.prereqs.includes(pr.id));
  const Check2 = ({ id, children }: { id: string; children: React.ReactNode }) => {
    const on = s.known.has(k(id));
    return (
      <button className={`chk-row tap ${on ? 'on' : ''}`} onClick={() => s.toggleKnown(k(id))} aria-pressed={on}>
        <span className={`checkbox ${on ? 'on' : ''}`}>{on && <Check size={14} strokeWidth={3} />}</span>
        <span>{children}</span>
      </button>
    );
  };
  const avIcon = (a: string) => (a === 'yes' ? <CircleCheck size={17} className="pos-ic" /> : a === 'partial' ? <CircleHelp size={17} className="mid-ic" /> : <CircleX size={17} className="neg-ic" />);
  return (
    <>
      <OutHead o={o} title={p.title} meta={<><span>{o.when}</span><span className="dot-sep" /><Level level={x.difficulty} /></>} />
      <div className="pad-x">
        <p className="rm-summary">{s.x(r.summary)}</p>
        <div className="rm-progress"><Progress value={done / items.length} /><span>{digits(s.lang, done)}/{digits(s.lang, items.length)} {s.tt('done', 'সম্পন্ন')}</span></div>
        <div className="compute-card"><span className="jc-title">{s.tt('Compute estimate', 'কম্পিউট অনুমান')}</span><p>{s.x(r.compute)}</p></div>

        <div className="sec-head"><h3>{s.tt('Before you start', 'শুরুর আগে')}</h3></div>
        {pres.map((pr) => (
          <button key={pr.id} className="res-row tap" onClick={() => s.push('prereqs', { id: r.paper })}>
            <span className="res-icon">{avIcon(s.done[(pr.link as { course?: string }).course || '']?.includes((pr.link as { lesson?: string }).lesson || '') || s.known.has(pr.id) ? 'yes' : 'partial')}</span>
            <span className="res-text"><b>{s.x(pr.label)}</b><span className="sub">{s.x(pr.why)}</span></span>
            <ChevronRight size={18} className="muted" />
          </button>
        ))}

        <div className="sec-head"><h3>{s.tt('Code and data', 'কোড ও ডেটা')}</h3></div>
        <div className="set-group">
          {r.availability.map((a, i) => (
            <div key={i} className="set-row">{avIcon(a.status)}<span className="set-label">{s.x(a.label)}<small>{s.x(a.note)}</small></span></div>
          ))}
        </div>

        <div className="sec-head"><h3>{s.tt('Experiment steps', 'পরীক্ষার ধাপ')}</h3></div>
        <ol className="chk-list">{r.steps.map((st, i) => <li key={i}><Check2 id={`st${i}`}><span className="chk-n">{digits(s.lang, i + 1)}.</span> {s.x(st)}</Check2></li>)}</ol>

        <div className="sec-head"><h3>{s.tt('Evaluation plan', 'মূল্যায়ন পরিকল্পনা')}</h3></div>
        <ul className="chk-list">{r.evaluation.map((st, i) => <li key={i}><Check2 id={`ev${i}`}>{s.x(st)}</Check2></li>)}</ul>

        <div className="sec-head"><h3>{s.tt('Likely blockers', 'সম্ভাব্য বাধা')}</h3></div>
        <div className="list">
          {r.blockers.map((bl, i) => <div key={i} className="blocker"><b><TriangleAlert size={15} /> {s.x(bl.label)}</b><p>{s.x(bl.fix)}</p></div>)}
        </div>
        <div className="note-box disclaimer"><Info size={16} /> <span>{s.tt('This roadmap does not run experiments and cannot promise the results will reproduce.', 'এই রোডম্যাপ পরীক্ষা চালায় না এবং ফল মিলবে এমন নিশ্চয়তা দিতে পারে না।')}</span></div>
        {done === items.length ? (
          <Btn block size="lg" className="mt16" icon={<CheckCircle2 size={18} />} onClick={() => { s.setReading(r.paper, { step: 3 }); s.toast(s.tt('Marked as reproduced', 'রিপ্রোডিউস হিসেবে চিহ্নিত')); }}>{s.tt('Mark paper as reproduced', 'পেপার রিপ্রোডিউস হিসেবে চিহ্নিত করুন')}</Btn>
        ) : null}
      </div>
    </>
  );
}

/* ---------------- Premium, checkout, subscription ---------------- */

export function PremiumScreen({ from }: { from?: ToolId }) {
  const s = useStore();
  const premium = s.plan === 'premium';
  const free = [
    s.tt('Paper Cards in Bangla and English', 'বাংলা ও ইংরেজিতে পেপার কার্ড'),
    s.tt('Figure-first reader', 'ফিগার-ফার্স্ট রিডার'),
    s.tt('Reading tracker and notes', 'রিডিং ট্র্যাকার ও নোট'),
    s.tt('Learn-before-reading lessons', 'পড়ার আগে শেখার লেসন'),
    s.tt('Related papers and reading paths', 'সম্পর্কিত পেপার ও রিডিং পাথ'),
    s.tt('Expert reviews and discussions', 'বিশেষজ্ঞ রিভিউ ও আলোচনা'),
  ];
  return (
    <div className="screen-col premium-screen">
      <header className="header">
        <button className="icon-btn tap" onClick={s.back} aria-label={s.t('close')}><X size={22} /></button>
        <div className="header-title" />
        <div className="header-right" />
      </header>
      <div className="scroll pad">
        <div className="prem-hero">
          <ProBadge />
          <h1>{s.tt('More research help, when you need it', 'যখন দরকার, আরও রিসার্চ সহায়তা')}</h1>
          <p>{s.tt('Learning on Doshomik Bytes stays free. Premium gives you bigger monthly allowances for the four research tools.', 'দশমিক বাইটসে শেখা ফ্রি থাকবে। প্রিমিয়ামে চারটি রিসার্চ টুলে বেশি মাসিক বরাদ্দ।')}</p>
        </div>
        <table className="prem-table">
          <thead><tr><th />{(['free', 'premium'] as Plan[]).map((pl) => <th key={pl} className={pl === s.plan ? 'cur' : ''}>{pl === 'free' ? s.tt('Free', 'ফ্রি') : 'Premium'}{pl === s.plan && <small>{s.tt('Your plan', 'আপনার প্ল্যান')}</small>}</th>)}</tr></thead>
          <tbody>
            {TOOL_ORDER.map((t) => (
              <tr key={t} className={from === t ? 'hl' : ''}>
                <th scope="row"><ToolIcon tool={t} size={15} /> {s.x(TOOL_META[t].short)}</th>
                <td>{t === 'roadmap' ? s.tt('1 trial', '১টি ট্রায়াল') : s.tt(`${LIMITS.free[t]}/mo`, `মাসে ${digits('bn', LIMITS.free[t])}`)}<small>{t === 'landscape' ? s.tt('8 papers', '৮ পেপার') : t === 'compare' ? s.tt('3 papers', '৩ পেপার') : ''}</small></td>
                <td>{s.tt(`${LIMITS.premium[t]}/mo`, `মাসে ${digits('bn', LIMITS.premium[t])}`)}<small>{t === 'landscape' ? s.tt('25 papers', '২৫ পেপার') : t === 'compare' ? s.tt('5 papers', '৫ পেপার') : ''}</small></td>
              </tr>
            ))}
            <tr><th scope="row">{s.tt('Club tools', 'ক্লাব টুলস')}</th><td>–</td><td><Check size={15} /></td></tr>
          </tbody>
        </table>
        <div className="always-free">
          <span className="jc-title">{s.tt('Always free, on every plan', 'সব প্ল্যানে সবসময় ফ্রি')}</span>
          <ul>{free.map((f) => <li key={f}><Check size={15} /> {f}</li>)}</ul>
        </div>
        <div className="note-box"><ShieldCheck size={16} /> <span>{s.tt('Premium is not unlimited. Fair allowances keep AI costs predictable, so the app can stay free for every learner.', 'প্রিমিয়াম সীমাহীন নয়। ন্যায্য বরাদ্দ এআই খরচ নিয়ন্ত্রণে রাখে, যাতে অ্যাপ সব শিক্ষার্থীর জন্য ফ্রি থাকে।')}</span></div>
        <div className="price-card">
          <div><b>৳{digits(s.lang, PRICE.bdt)}</b><span>/{s.tt('month', 'মাস')}</span></div>
          <p>{s.tt('Pilot price. The final price is set after we measure real costs. Cancel anytime.', 'পাইলট মূল্য। প্রকৃত খরচ মেপে চূড়ান্ত মূল্য ঠিক হবে। যেকোনো সময় বাতিল।')}</p>
        </div>
      </div>
      <div className="bottom-bar tool-bar">
        {premium ? (
          <Btn block size="lg" variant="secondary" onClick={() => s.replace('subscription', {})}>{s.tt('You’re on Premium. Manage plan', 'আপনি প্রিমিয়ামে আছেন। প্ল্যান ম্যানেজ')}</Btn>
        ) : (
          <>
            <Btn block size="lg" onClick={() => s.setSheet({ name: 'checkout', params: { from } })}>{s.tt(`Continue with Premium, ৳${PRICE.bdt}/month`, `প্রিমিয়াম নিন, মাসে ৳${digits('bn', PRICE.bdt)}`)}</Btn>
            <button className="link-btn tap center" onClick={s.back}>{s.tt('Keep using Free', 'ফ্রি-তেই থাকুন')}</button>
          </>
        )}
      </div>
    </div>
  );
}

export function CheckoutSheet({ from }: { from?: ToolId }) {
  const s = useStore();
  const [busy, setBusy] = useState(false);
  const methods: { id: 'bkash' | 'nagad' | 'card'; label: string; sub: string; icon: React.ReactNode }[] = [
    { id: 'bkash', label: 'bKash', sub: s.tt('Confirm in the bKash app', 'বিকাশ অ্যাপে নিশ্চিত করুন'), icon: <Smartphone size={19} /> },
    { id: 'nagad', label: 'Nagad', sub: s.tt('Confirm in the Nagad app', 'নগদ অ্যাপে নিশ্চিত করুন'), icon: <Wallet size={19} /> },
    { id: 'card', label: s.tt('Debit or credit card', 'ডেবিট বা ক্রেডিট কার্ড'), sub: 'Visa, Mastercard', icon: <CreditCard size={19} /> },
  ];
  const pay = () => {
    setBusy(true);
    setTimeout(() => {
      s.setPlan('premium');
      s.setSheet(null);
      s.replace('paySuccess', { from });
    }, 1600);
  };
  return (
    <Sheet onClose={() => !busy && s.setSheet(null)} title={s.tt('Start Premium', 'প্রিমিয়াম শুরু')}>
      <div className="pad checkout">
        <div className="co-sum"><span>{s.tt('Premium, monthly', 'প্রিমিয়াম, মাসিক')}</span><b>৳{digits(s.lang, PRICE.bdt)}</b></div>
        <p className="sub" style={{ whiteSpace: 'normal' }}>{s.tt(`Renews on ${RENEW_DATE.en}. Cancel anytime in Settings.`, `${RENEW_DATE.bn} নবায়ন। সেটিংসে যেকোনো সময় বাতিল।`)}</p>
        <div className="set-group" role="radiogroup" aria-label={s.tt('Payment method', 'পেমেন্ট পদ্ধতি')} style={{ marginTop: 12 }}>
          {methods.map((m) => (
            <button key={m.id} role="radio" aria-checked={s.payMethod === m.id} className="set-row tap" onClick={() => s.setPayMethod(m.id)} disabled={busy}>
              <span className={`set-icon pay-${m.id}`}>{m.icon}</span>
              <span className="set-label">{m.label}<small>{m.sub}</small></span>
              <span className={`radio ${s.payMethod === m.id ? 'on' : ''}`} />
            </button>
          ))}
        </div>
        <Btn block size="lg" onClick={pay} disabled={busy} icon={busy ? <LoaderCircle size={18} className="spin" /> : undefined}>
          {busy ? s.tt('Waiting for confirmation…', 'নিশ্চিতকরণের অপেক্ষা…') : s.tt(`Pay ৳${PRICE.bdt}`, `৳${digits('bn', PRICE.bdt)} পরিশোধ`)}
        </Btn>
        <p className="fine center-text"><ShieldCheck size={13} /> {s.tt('Demo only: no real payment is made.', 'শুধু ডেমো: কোনো আসল পেমেন্ট হবে না।')}</p>
      </div>
    </Sheet>
  );
}

export function PaySuccess({ from }: { from?: ToolId }) {
  const s = useStore();
  return (
    <div className="screen-col published">
      <div className="pub-center">
        <div className="pub-badge"><CheckCircle2 size={52} /></div>
        <h1>{s.tt('You’re on Premium', 'আপনি এখন প্রিমিয়ামে')}</h1>
        <p>{s.tt('Your bigger allowances are ready now.', 'বেশি বরাদ্দ এখনই প্রস্তুত।')}</p>
        <div className="plan-meters success-meters">
          {TOOL_ORDER.map((t) => (
            <div key={t} className="pm-row"><span>{s.x(TOOL_META[t].short)}</span><Meter used={Math.min(LIMITS.premium[t], s.usage.premium[t])} limit={LIMITS.premium[t]} /><b>{digits(s.lang, LIMITS.premium[t] - s.usage.premium[t])} {s.tt('left', 'বাকি')}</b></div>
          ))}
        </div>
        <span className="pub-kind"><Receipt size={14} /> {s.tt('Receipt sent to rakib@mail.com', 'রসিদ rakib@mail.com-এ পাঠানো হয়েছে')}</span>
      </div>
      <div className="pub-actions">
        {from
          ? <Btn block size="lg" icon={<ArrowRight size={18} />} onClick={s.back}>{s.tt(`Continue: ${TOOL_META[from].short.en}`, `চালিয়ে যান: ${TOOL_META[from].short.bn}`)}</Btn>
          : <Btn block size="lg" onClick={s.back}>{s.t('done')}</Btn>}
      </div>
    </div>
  );
}

export function SubscriptionScreen() {
  const s = useStore();
  const premium = s.plan === 'premium';
  const method = { bkash: 'bKash •••• 4821', nagad: 'Nagad •••• 4821', card: 'Visa •••• 0417' }[s.payMethod];
  return (
    <div className="screen-col">
      <Header title={s.tt('Subscription', 'সাবস্ক্রিপশন')} />
      <div className="scroll pad">
        <PlanCard />
        {premium ? (
          <>
            <div className="set-caption">{s.tt('Billing', 'বিলিং')}</div>
            <div className="set-group">
              <div className="set-row"><span className="set-icon"><CreditCard size={18} /></span><span className="set-label">{s.tt('Payment method', 'পেমেন্ট পদ্ধতি')}<small>{method}</small></span></div>
              <div className="set-row"><span className="set-icon"><Receipt size={18} /></span><span className="set-label">{s.tt('Nov 20, Premium monthly', '২০ নভেম্বর, প্রিমিয়াম মাসিক')}<small>{s.tt('Paid', 'পরিশোধিত')}</small></span><span className="set-value">৳{digits(s.lang, PRICE.bdt)}</span></div>
            </div>
            <div className="set-group">
              <button className="set-row tap danger" onClick={() => s.setDialog({
                title: s.tt(`Cancel Premium? Saved outputs stay. Allowances return to Free.`, 'প্রিমিয়াম বাতিল করবেন? সেভ করা আউটপুট থাকবে। বরাদ্দ ফ্রি-তে ফিরবে।'),
                confirm: s.tt('Cancel Premium', 'প্রিমিয়াম বাতিল'), danger: true,
                onConfirm: () => { s.setPlan('free'); s.toast(s.tt('Premium cancelled. You’re on Free.', 'প্রিমিয়াম বাতিল। আপনি ফ্রি-তে।')); },
              })}>
                <span className="set-icon"><X size={18} /></span><span className="set-label">{s.tt('Cancel Premium', 'প্রিমিয়াম বাতিল')}</span>
              </button>
            </div>
            <p className="fine">{s.tt(`In the real app you keep Premium until ${RENEW_DATE.en}. In this demo the change is immediate.`, `আসল অ্যাপে ${RENEW_DATE.bn} পর্যন্ত প্রিমিয়াম থাকবে। ডেমোতে সাথে সাথে বদলায়।`)}</p>
          </>
        ) : (
          <Btn block size="lg" className="mt16" onClick={() => s.push('premium', {})}>{s.tt('See Premium', 'প্রিমিয়াম দেখুন')}</Btn>
        )}
      </div>
    </div>
  );
}
