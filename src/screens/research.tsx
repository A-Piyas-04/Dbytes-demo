import React, { useMemo, useState } from 'react';
import {
  ArrowRight, Bookmark, CalendarDays, Check, ChevronRight, CircleHelp, Clock, ExternalLink, FileText, Flame, ImageOff, Info,
  Layers, Lightbulb, Lock, MessageCircle, NotebookPen, Play, Quote, Route, Search, Send, Share2, Sparkles, Star, Target,
  TriangleAlert, Users, X, ChevronDown, GraduationCap, BookOpenCheck,
} from 'lucide-react';
import { TOPICS, type Paper, type TopicId } from '../data';
import type { L } from '../research/data';
import { useStore, creatorOf, findPaper, type Store } from '../store';
import { compact, digits } from '../i18n';
import { Scene, SCENE_BG } from '../scenes';
import { Avatar, Btn, Chip, Empty, Header, Level, Name, Progress, Seg, Sheet, TopBar, TopicChips, TopicTag, openCreator } from '../ui';
import { COLLECTION, PX, SOURCE_LABEL, type Prereq, type PaperX, type SourceId } from '../research/data';
import { CLUBS, PATHS } from '../research/content';
import { OutputRow, PlanCard, PausedBanner, ToolCard, toolsFor, ToolIcon } from './tools';

/* ---------------- shared bits ---------------- */

export const px = (id: string): PaperX | undefined => PX[id];

const dayNum = (w: string) => parseInt(w.replace(/\D/g, ''), 10) || 0;

export const STEP_LABELS = [
  { en: 'Explored', bn: 'দেখা হয়েছে', subEn: 'Read the Paper Card', subBn: 'পেপার কার্ড পড়েছেন' },
  { en: 'Studied', bn: 'পড়া হয়েছে', subEn: 'Read the full paper', subBn: 'পুরো পেপার পড়েছেন' },
  { en: 'Reproduced', bn: 'রিপ্রোডিউস', subEn: 'Implemented it yourself', subBn: 'নিজে বাস্তবায়ন করেছেন' },
];

export function stepName(s: Store, step: number) {
  if (!step) return s.tt('Not started', 'শুরু হয়নি');
  const st = STEP_LABELS[step - 1];
  return s.tt(st.en, st.bn);
}

export function SourceChips({ ids }: { ids: SourceId[] }) {
  return <span className="src-chips">{ids.map((i) => <span key={i} className={`src-chip ${i}`}>{SOURCE_LABEL[i]}</span>)}</span>;
}

function StepDots({ step }: { step: number }) {
  return <span className="step-dots" aria-hidden="true">{[1, 2, 3].map((n) => <i key={n} className={step >= n ? 'on' : ''} />)}</span>;
}

export function ReadPill({ id }: { id: string }) {
  const s = useStore();
  const st = s.reading[id]?.step || 0;
  if (!st) return null;
  return <span className={`read-pill s${st}`}><StepDots step={st} /> {stepName(s, st)}</span>;
}

export const prereqDone = (s: Store, pr: Prereq) => {
  if (s.known.has(pr.id)) return true;
  const l = pr.link;
  if (l.kind === 'lesson') return !!s.done[l.course]?.includes(l.lesson);
  if (l.kind === 'quiz') return s.quizHistory.some((h) => h.setId === l.id);
  return false;
};

export function PaperItem({ id, compactView }: { id: string; compactView?: boolean }) {
  const s = useStore();
  const p = findPaper(s, id);
  const x = px(id);
  if (!p) return null;
  if (!x) return null;
  const saved = s.saves.has(id);
  return (
    <article className="rp-card">
      <button className="rp-main tap-soft" onClick={() => s.push('paper', { id })}>
        <span className="rp-top">
          <Level level={x.difficulty} />
          {x.isNew && <span className="rp-new">{s.tt('New', 'নতুন')}</span>}
          {x.trend && <span className="rp-trend"><Flame size={13} /> {s.tt('Trending', 'ট্রেন্ডিং')} #{digits(s.lang, x.trend)}</span>}
        </span>
        <h3 className="paper-title">{p.title}</h3>
        <span className="paper-src">{p.authors}, {p.source}</span>
        {!compactView && <span className="rp-q">{s.x(x.question)}</span>}
      </button>
      <div className="rp-foot">
        <ReadPill id={id} />
        <span className="rp-stat" title={s.tt('Citations', 'সাইটেশন')}><Quote size={13} /> {compact(s.lang, x.citations)}</span>
        {x.hf && <span className="rp-stat hf" title="Hugging Face upvotes">▲ {digits(s.lang, x.hf)}</span>}
        <span className="rp-spacer" />
        <button className={`icon-btn sm tap save ${saved ? 'on' : ''}`} onClick={() => s.toggleSave(id)} aria-label={s.t('save')} aria-pressed={saved}>
          <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
    </article>
  );
}

export function MiniPaper({ id, right }: { id: string; right?: React.ReactNode }) {
  const s = useStore();
  const p = findPaper(s, id);
  if (!p) return null;
  return (
    <button className="res-row tap mini-paper" onClick={() => s.push('paper', { id })}>
      <span className="res-thumb" style={p.scene ? { ['--h' as string]: SCENE_BG[p.scene] } : undefined}>{p.scene ? <Scene kind={p.scene} playing={false} /> : <FileText size={18} />}</span>
      <span className="res-text"><b>{p.title}</b><span className="sub">{p.authors}, {p.year}</span></span>
      {right ?? <ChevronRight size={18} className="muted" />}
    </button>
  );
}

/* ---------------- Research home (tab root) ---------------- */

export function ResearchHome({ pushed }: { pushed?: boolean }) {
  const s = useStore();
  const seg = s.researchSeg;
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return [];
    return COLLECTION.filter((id) => {
      const p = findPaper(s, id)!;
      const x = PX[id];
      return [p.title, p.authors, p.source, s.x(p.keyIdea), x.question.en, x.question.bn, ...x.glossary.map((g) => g.term)].some((f) => f.toLowerCase().includes(n));
    });
  }, [q, s.lang]);

  return (
    <div className="screen-col">
      {pushed ? <Header title={s.t('research')} /> : <TopBar noSearch />}
      <div className="search-wrap">
        <label className="search">
          <Search size={19} aria-hidden="true" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={s.tt('Search papers, authors, terms…', 'পেপার, লেখক, শব্দ খুঁজুন…')} aria-label={s.tt('Search papers', 'পেপার খুঁজুন')} enterKeyHint="search" />
          {q && <button className="icon-btn sm tap" onClick={() => setQ('')} aria-label={s.t('clear')}><X size={16} /></button>}
        </label>
      </div>
      {q.trim() ? (
        <div className="scroll pad">
          <div className="sec-head" style={{ marginTop: 0 }}><h3>{digits(s.lang, results.length)} {s.tt('papers', 'পেপার')}</h3></div>
          {results.length ? <div className="list">{results.map((id) => <PaperItem key={id} id={id} />)}</div> : (
            <Empty icon={<Search size={28} />} title={s.tt(`No papers match “${q}”`, `“${q}” মেলে এমন পেপার নেই`)} action={<p className="empty-sub">{s.tt('The collection starts small and curated. Try “LoRA”, “attention” or “small models”.', 'সংগ্রহ ছোট ও বাছাই করা। “LoRA”, “attention” বা “small models” লিখে দেখুন।')}</p>} />
          )}
        </div>
      ) : (
        <>
          <div className="pad-x seg-wrap">
            <Seg
              options={[{ id: 'discover', label: s.tt('Discover', 'খুঁজুন') }, { id: 'tools', label: s.tt('Tools', 'টুলস') }, { id: 'library', label: s.tt('My reading', 'আমার পড়া') }]}
              value={seg}
              onChange={s.setResearchSeg}
            />
          </div>
          <div className="scroll" key={seg}>
            {seg === 'discover' && <Discover />}
            {seg === 'tools' && <ToolsHub />}
            {seg === 'library' && <Library />}
            <div className="bottom-space" />
          </div>
        </>
      )}
    </div>
  );
}

export function Discover({ plain }: { plain?: boolean } = {}) {
  const s = useStore();
  const [topic, setTopic] = useState<TopicId | null>(null);
  const [sort, setSort] = useState<'trending' | 'new' | 'cited'>('trending');
  const cont = Object.entries(s.reading).filter(([, r]) => r.step === 1 || r.step === 2).sort((a, b) => dayNum(b[1].when) - dayNum(a[1].when))[0];
  let ids = COLLECTION.filter((id) => !topic || findPaper(s, id)!.topic === topic);
  ids = [...ids].sort((a, b) => {
    const A = PX[a], B = PX[b];
    if (sort === 'cited') return B.citations - A.citations;
    if (sort === 'new') return Number(!!B.isNew) - Number(!!A.isNew) || findPaper(s, b)!.year - findPaper(s, a)!.year;
    return (A.trend ?? 99) - (B.trend ?? 99) || (B.hf ?? 0) - (A.hf ?? 0);
  });
  return (
    <>
      {cont && <ContinueCard id={cont[0]} />}
      <div className="explore-chips" style={{ paddingTop: cont ? 0 : 4 }}><TopicChips value={topic} onChange={setTopic} /></div>
      <div className="pad-x sort-row" role="radiogroup" aria-label={s.tt('Sort', 'সাজান')}>
        {([['trending', s.tt('Trending this week', 'এই সপ্তাহে ট্রেন্ডিং')], ['new', s.tt('New', 'নতুন')], ['cited', s.tt('Most cited', 'সর্বাধিক সাইটেড')]] as const).map(([id, l]) => (
          <Chip key={id} small active={sort === id} onClick={() => setSort(id)}>{l}</Chip>
        ))}
      </div>
      <div className="list pad">
        {ids.slice(0, 3).map((id) => <PaperItem key={id} id={id} />)}
      </div>
      {!topic && !plain && <PathsRow />}
      <div className="list pad">
        {ids.slice(3, 7).map((id) => <PaperItem key={id} id={id} />)}
        {!topic && !plain && <ClubsTeaser />}
        {ids.slice(7).map((id) => <PaperItem key={id} id={id} />)}
        {!ids.length && <Empty icon={<FileText size={28} />} title={s.tt('No papers in this topic yet', 'এই টপিকে এখনো পেপার নেই')} />}
      </div>
      <p className="fine pad-x"><Info size={13} /> {s.tt(`A curated AI/ML collection of ${COLLECTION.length} papers. Details come from OpenAlex, Semantic Scholar and Hugging Face. Full papers open on arXiv.`, `${digits('bn', COLLECTION.length)}টি এআই/এমএল পেপারের বাছাই করা সংগ্রহ। তথ্য OpenAlex, Semantic Scholar ও Hugging Face থেকে। পুরো পেপার arXiv-এ খোলে।`)}</p>
    </>
  );
}

export function ContinueCard({ id }: { id: string }) {
  const s = useStore();
  const p = findPaper(s, id)!;
  const r = s.reading[id];
  return (
    <button className="continue-paper tap" onClick={() => s.push('paper', { id })}>
      <span className="qc-label"><BookOpenCheck size={14} /> {s.tt('Continue reading', 'পড়া চালিয়ে যান')}</span>
      <span className="cp-title">{p.title}</span>
      <span className="cp-step">
        <StepDots step={r.step} />
        {s.tt(`Step ${r.step} of 3: ${STEP_LABELS[r.step - 1].en}`, `৩ ধাপের ${digits('bn', r.step)}: ${STEP_LABELS[r.step - 1].bn}`)}
      </span>
      {r.note && <span className="cp-note">“{r.note}”</span>}
      <span className="qc-go"><ArrowRight size={18} /></span>
    </button>
  );
}

function PathsRow() {
  const s = useStore();
  return (
    <section>
      <div className="sec-head pad-x" style={{ marginTop: 4 }}><h2>{s.tt('Reading paths', 'রিডিং পাথ')}</h2></div>
      <div className="h-scroll">
        {PATHS.map((p) => <PathCard key={p.id} id={p.id} />)}
      </div>
    </section>
  );
}

export function pathProgress(s: Store, papers: string[]) {
  return papers.filter((id) => (s.reading[id]?.step || 0) >= 1).length;
}

export function PathCard({ id }: { id: string }) {
  const s = useStore();
  const p = PATHS.find((x) => x.id === id)!;
  const done = pathProgress(s, p.papers);
  const c = creatorOf(s, p.by);
  return (
    <button className="path-card tap" style={{ ['--h' as string]: p.hue }} onClick={() => s.push('path', { id })}>
      <span className="path-steps" aria-hidden="true">{p.papers.map((pid, i) => <i key={pid} className={(s.reading[pid]?.step || 0) >= 1 ? 'on' : ''} style={{ ['--i' as string]: i }} />)}</span>
      <span className="path-title">{s.x(p.title)}</span>
      <span className="path-by"><Avatar c={c} size={18} /> {s.x(c.name)}</span>
      <span className="path-meta">{digits(s.lang, p.papers.length)} {s.tt('papers', 'পেপার')} <span className="dot-sep" /> {done ? s.tt(`${done} explored`, `${digits('bn', done)}টি দেখা`) : `${compact(s.lang, p.learners)} ${s.t('learners')}`}</span>
    </button>
  );
}

function ClubsTeaser() {
  const s = useStore();
  return (
    <button className="clubs-teaser tap" onClick={() => s.push('clubs')}>
      <span className="ct-avatars">{CLUBS.map((c) => <Avatar key={c.id} c={creatorOf(s, c.host)} size={34} ring />)}</span>
      <span className="ct-text">
        <b>{s.tt('Paper clubs', 'পেপার ক্লাব')} <span className="later">{s.tt('Coming later', 'শীঘ্রই')}</span></b>
        <span>{s.tt('Read one paper together, guided by a creator.', 'একজন ক্রিয়েটরের সাথে একসাথে একটি পেপার পড়ুন।')}</span>
      </span>
      <ChevronRight size={18} className="muted" />
    </button>
  );
}

export function ToolsHub() {
  const s = useStore();
  return (
    <div className="pad tools-hub">
      <PlanCard />
      {s.aiPaused && <PausedBanner />}
      <div className="sec-head"><h2>{s.tt('Research tools', 'রিসার্চ টুলস')}</h2><span className="later">{s.tt('Later release', 'পরের রিলিজ')}</span></div>
      <p className="hub-lede">{s.tt('Each tool runs a bounded job and saves a structured result you can reopen anytime. It is not a chat.', 'প্রতিটি টুল একটি সীমিত কাজ চালায় এবং একটি কাঠামোবদ্ধ ফল সেভ করে, যা যেকোনো সময় খোলা যায়। এটি চ্যাট নয়।')}</p>
      <div className="list">{toolsFor(s.navMode).map((t) => <ToolCard key={t} tool={t} />)}</div>
      <div className="sec-head"><h2>{s.tt('Saved outputs', 'সেভ করা আউটপুট')}</h2></div>
      {s.outputs.length ? <div className="out-list">{s.outputs.map((o) => <OutputRow key={o.id} o={o} />)}</div> : (
        <Empty icon={<Sparkles size={26} />} title={s.tt('Your maps, comparisons and roadmaps will appear here', 'আপনার ম্যাপ, তুলনা ও রোডম্যাপ এখানে দেখাবে')} />
      )}
      <p className="fine"><Info size={13} /> {s.tt('Opening a saved output is free and never uses your monthly allowance.', 'সেভ করা আউটপুট খোলা ফ্রি, মাসিক বরাদ্দ খরচ হয় না।')}</p>
    </div>
  );
}

export function Library({ onFind }: { onFind?: () => void } = {}) {
  const s = useStore();
  const [f, setF] = useState<0 | 1 | 2 | 3>(0);
  const tracked = Object.entries(s.reading).filter(([, r]) => r.step > 0).sort((a, b) => dayNum(b[1].when) - dayNum(a[1].when));
  const shown = tracked.filter(([, r]) => !f || r.step === f);
  const savedPapers = Array.from(s.saves).filter((id) => PX[id]);
  const count = (n: number) => tracked.filter(([, r]) => r.step === n).length;
  return (
    <div className="pad">
      <div className="lib-stats" role="radiogroup" aria-label={s.tt('Filter by step', 'ধাপ অনুযায়ী')}>
        {STEP_LABELS.map((st, i) => {
          const n = (i + 1) as 1 | 2 | 3;
          return (
            <button key={n} role="radio" aria-checked={f === n} className={`lib-stat tap s${n} ${f === n ? 'on' : ''}`} onClick={() => setF(f === n ? 0 : n)}>
              <b>{digits(s.lang, count(n))}</b>
              <span>{s.tt(st.en, st.bn)}</span>
            </button>
          );
        })}
      </div>
      <p className="fine" style={{ marginTop: 10 }}>{s.tt('Explored → studied → reproduced. Mark each step on a paper’s card.', 'দেখা → পড়া → রিপ্রোডিউস। প্রতিটি পেপার কার্ডে ধাপ চিহ্নিত করুন।')}</p>
      <div className="list" style={{ marginTop: 12 }}>
        {shown.map(([id, r]) => {
          const p = findPaper(s, id);
          if (!p) return null;
          return (
            <button key={id} className="track-row tap" onClick={() => s.push('paper', { id })}>
              <span className="tr-top"><b>{p.title}</b><ReadPill id={id} /></span>
              {r.note ? <span className="tr-note"><NotebookPen size={13} /> {r.note}</span> : <span className="tr-note muted">{s.tt('No notes yet', 'এখনো নোট নেই')}</span>}
              <span className="sub">{s.tt('Updated', 'আপডেট')} {r.when}</span>
            </button>
          );
        })}
        {!shown.length && <Empty icon={<BookOpenCheck size={28} />} title={s.tt('Nothing here yet', 'এখনো কিছু নেই')} action={<Btn onClick={onFind || (() => s.setResearchSeg('discover'))}>{s.tt('Find a paper', 'পেপার খুঁজুন')}</Btn>} />}
      </div>
      {savedPapers.length > 0 && (
        <>
          <div className="sec-head"><h2>{s.tt('Saved papers', 'সেভ করা পেপার')}</h2></div>
          <div className="list">{savedPapers.map((id) => <PaperItem key={id} id={id} compactView />)}</div>
        </>
      )}
    </div>
  );
}

/* ---------------- Paper Card (detail) ---------------- */

export function ReadSteps({ id }: { id: string }) {
  const s = useStore();
  const r = s.reading[id];
  const step = r?.step || 0;
  const set = (n: 0 | 1 | 2 | 3) => {
    s.setReading(id, { step: n });
    if (n > step) s.toast(s.tt(`Marked as ${STEP_LABELS[n - 1].en.toLowerCase()}`, `${STEP_LABELS[n - 1].bn} হিসেবে চিহ্নিত`));
  };
  return (
    <div className="rsteps-wrap">
      <div className="rsteps" role="group" aria-label={s.tt('Reading progress', 'পড়ার অগ্রগতি')}>
        {STEP_LABELS.map((st, i) => {
          const n = (i + 1) as 1 | 2 | 3;
          const on = step >= n;
          return (
            <button key={n} className={`rstep tap ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => set(step === n ? ((n - 1) as 0 | 1 | 2) : n)}>
              <span className="rs-dot">{on ? <Check size={15} strokeWidth={3} /> : digits(s.lang, n)}</span>
              <span className="rs-label">{s.tt(st.en, st.bn)}</span>
              <span className="rs-sub">{s.tt(st.subEn, st.subBn)}</span>
            </button>
          );
        })}
      </div>
      <button className="rs-note tap" onClick={() => s.setSheet({ name: 'note', params: { id } })}>
        <NotebookPen size={16} />
        {r?.note ? <span className="rs-note-text">{r.note}</span> : <span>{s.tt('Add a private note', 'ব্যক্তিগত নোট যোগ করুন')}</span>}
      </button>
    </div>
  );
}

export function NoteSheet({ id }: { id: string }) {
  const s = useStore();
  const [text, setText] = useState(s.reading[id]?.note || '');
  const p = findPaper(s, id);
  return (
    <Sheet onClose={() => s.setSheet(null)} title={s.tt('Your note', 'আপনার নোট')}>
      <div className="pad" style={{ paddingTop: 4 }}>
        <p className="sub" style={{ whiteSpace: 'normal', marginBottom: 10 }}>{p?.title}</p>
        <textarea className="note-area" rows={5} maxLength={400} value={text} onChange={(e) => setText(e.target.value)} placeholder={s.tt('What did you learn? What will you try?', 'কী শিখলেন? কী চেষ্টা করবেন?')} autoFocus />
        <div className="note-foot"><span className="sub">{s.tt('Only you can see this', 'শুধু আপনি দেখতে পাবেন')}</span><span className="sub">{digits(s.lang, text.length)}/{digits(s.lang, 400)}</span></div>
        <Btn block size="lg" onClick={() => { s.setReading(id, { note: text.trim() }); s.setSheet(null); s.toast(s.tt('Note saved', 'নোট সেভ হয়েছে')); }}>{s.tt('Save note', 'নোট সেভ')}</Btn>
      </div>
    </Sheet>
  );
}

type PTab = 'card' | 'figures' | 'related' | 'discuss';

export function PaperCardScreen({ id, tab: initial }: { id: string; tab?: PTab }) {
  const s = useStore();
  const p = findPaper(s, id)!;
  const x = PX[id];
  const [tab, setTab] = useState<PTab>(initial || 'card');
  const saved = s.saves.has(id);
  return (
    <div className="screen-col">
      <Header
        title={s.tt('Paper Card', 'পেপার কার্ড')}
        right={<>
          <button className={`icon-btn tap save ${saved ? 'on' : ''}`} onClick={() => s.toggleSave(id)} aria-label={s.t('save')} aria-pressed={saved}><Bookmark size={21} fill={saved ? 'currentColor' : 'none'} /></button>
          <button className="icon-btn tap" onClick={() => s.setSheet({ name: 'share', params: { id } })} aria-label={s.t('share')}><Share2 size={21} /></button>
        </>}
      />
      <div className="scroll">
        <div className="pad pc-head">
          <div className="pc-tags"><TopicTag id={p.topic} /><Level level={x.difficulty} />{x.isNew && <span className="rp-new">{s.tt('New', 'নতুন')}</span>}</div>
          <h1 className="pd-title">{p.title}</h1>
          <div className="pd-src">{p.authors}, {p.source}</div>
          <div className="pc-meta">
            <span><Quote size={14} /> {compact(s.lang, x.citations)} {s.tt('citations', 'সাইটেশন')}</span>
            {x.hf && <span>▲ {digits(s.lang, x.hf)} {s.tt('upvotes', 'আপভোট')}</span>}
            <span><Clock size={14} /> {digits(s.lang, p.readMin)} {s.t('min')}</span>
          </div>
          <ReadSteps id={id} />
        </div>
        <div className="sticky-seg">
          <Seg variant="tabs" value={tab} onChange={setTab} options={[
            { id: 'card', label: s.tt('Card', 'কার্ড') },
            { id: 'figures', label: s.tt('Figures', 'ফিগার') },
            { id: 'related', label: s.tt('Related', 'সম্পর্কিত') },
            { id: 'discuss', label: s.tt('Discuss', 'আলোচনা') },
          ]} />
        </div>
        <div className="pad" key={tab}>
          {tab === 'card' && <CardTab id={id} />}
          {tab === 'figures' && <FiguresTab id={id} />}
          {tab === 'related' && <RelatedTab id={id} />}
          {tab === 'discuss' && <DiscussTab id={id} />}
        </div>
        <div className="bottom-space" />
      </div>
      <div className="bottom-bar">
        <Btn block size="lg" variant="dark" icon={<ExternalLink size={18} />} onClick={() => { s.toast(s.t('openingLink')); window.open(p.url, '_blank', 'noopener'); }}>{s.t('readOriginal')}</Btn>
      </div>
    </div>
  );
}

export function CardTab({ id, noTools }: { id: string; noTools?: boolean }) {
  const s = useStore();
  const p = findPaper(s, id)!;
  const x = PX[id];
  const [cl, setCl] = useState(s.lang);
  const v = (l: L | string) => (typeof l === 'string' ? l : l[cl]);
  const [open, setOpen] = useState<string | null>(null);
  const ready = x.prereqs.filter((pr) => prereqDone(s, pr)).length;
  const checker = x.checkedBy ? creatorOf(s, x.checkedBy) : null;
  return (
    <div className="card-tab">
      <div className="explain-lang">
        <span>{s.tt('Explanation in', 'ব্যাখ্যার ভাষা')}</span>
        <Seg value={cl} onChange={setCl} options={[{ id: 'en', label: 'English' }, { id: 'bn', label: 'বাংলা' }]} />
      </div>

      {x.prereqs.length > 0 && (
        <button className={`prep-banner tap ${ready === x.prereqs.length ? 'ready' : ''}`} onClick={() => s.push('prereqs', { id })}>
          <span className="prep-icon"><GraduationCap size={20} /></span>
          <span className="prep-text">
            <b>{ready === x.prereqs.length ? s.tt('You’re ready for this paper', 'আপনি এই পেপারের জন্য প্রস্তুত') : s.tt('Learn before reading', 'পড়ার আগে শিখুন')}</b>
            <span>{s.tt(`${ready} of ${x.prereqs.length} prerequisite topics done`, `${digits('bn', x.prereqs.length)}টির মধ্যে ${digits('bn', ready)}টি পূর্বজ্ঞান সম্পন্ন`)}</span>
            <Progress value={ready / x.prereqs.length} thin />
          </span>
          <ChevronRight size={18} className="muted" />
        </button>
      )}

      <section className="pcs q">
        <span className="pb-label"><CircleHelp size={17} /> {cl === 'bn' ? 'প্রশ্ন' : 'The question'}</span>
        <p className="pcs-lead">{v(x.question)}</p>
      </section>
      <section className="pcs idea">
        <span className="pb-label"><Lightbulb size={17} /> {cl === 'bn' ? 'মূল আইডিয়া' : 'Main idea'}</span>
        <p className="pcs-lead">{v(p.keyIdea)}</p>
      </section>
      <section className="pcs find">
        <span className="pb-label"><Target size={17} /> {cl === 'bn' ? 'ফলাফল' : 'What they found'}</span>
        <ul>{x.findings.map((f, i) => <li key={i}>{v(f)}</li>)}</ul>
      </section>
      <section className="pcs limit">
        <span className="pb-label"><TriangleAlert size={17} /> {cl === 'bn' ? 'সীমাবদ্ধতা' : 'Limitations'}</span>
        <ul>{x.limitations.map((f, i) => <li key={i}>{v(f)}</li>)}</ul>
      </section>
      {x.glossary.length > 0 && (
        <section className="pcs gloss">
          <span className="pb-label"><Layers size={17} /> {cl === 'bn' ? 'শব্দকোষ' : 'Glossary'}</span>
          <div className="gloss-list">
            {x.glossary.map((g) => (
              <div key={g.term} className={`gloss ${open === g.term ? 'open' : ''}`}>
                <button className="gloss-term tap" onClick={() => setOpen(open === g.term ? null : g.term)} aria-expanded={open === g.term}>
                  {g.term} <ChevronDown size={16} />
                </button>
                {open === g.term && <p>{v(g.def)}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="provenance">
        <Sparkles size={16} />
        <div>
          <p>{s.tt(`Prepared with AI once, on ${x.generated}, from the paper’s abstract and sections. Stored and shown to every reader.`, `${x.generated} তারিখে পেপারের অ্যাবস্ট্রাক্ট ও অংশ থেকে একবার এআই দিয়ে তৈরি। সংরক্ষিত, সবাই একই ব্যাখ্যা দেখে।`)}</p>
          {checker ? (
            <button className="prov-check tap" onClick={() => openCreator(s, checker.id)}><Avatar c={checker} size={20} /> {s.tt('Checked by', 'যাচাই করেছেন')} <Name c={checker} /></button>
          ) : <p className="muted">{s.tt('Not yet checked by a creator.', 'এখনো কোনো ক্রিয়েটর যাচাই করেননি।')}</p>}
          <button className="link-btn tap" style={{ padding: '6px 0', minHeight: 0 }} onClick={() => s.setSheet({ name: 'report', params: { id } })}>{s.tt('Spotted a mistake? Report it', 'ভুল চোখে পড়েছে? জানান')}</button>
        </div>
      </div>

      {!noTools && <GoDeeper id={id} />}
    </div>
  );
}

export function GoDeeper({ id }: { id: string }) {
  const s = useStore();
  const x = PX[id];
  const related = [...x.builtBy, ...x.buildsOn].filter((r) => PX[r]).slice(0, 2);
  const rows: [string, React.ReactNode, string, () => void][] = [];
  if (x.claims?.length) rows.push(['claim', <ToolIcon tool="claim" />, s.tt('Check a claim from this paper', 'এই পেপারের একটি দাবি যাচাই'), () => s.push('tool', { tool: 'claim', paper: id })]);
  if (x.roadmap) rows.push(['roadmap', <ToolIcon tool="roadmap" />, s.tt('Build a reproduction roadmap', 'রিপ্রোডাকশন রোডম্যাপ তৈরি'), () => s.push('tool', { tool: 'roadmap', paper: id })]);
  if (related.length) rows.push(['compare', <ToolIcon tool="compare" />, s.tt('Compare with related papers', 'সম্পর্কিত পেপারের সাথে তুলনা'), () => s.push('tool', { tool: 'compare', papers: [id, ...related] })]);
  if (!rows.length) return null;
  return (
    <section className="go-deeper">
      <div className="sec-head"><h3>{s.tt('Go deeper', 'আরও গভীরে')}</h3><span className="sub">{s.tt('Research tools', 'রিসার্চ টুলস')}</span></div>
      <div className="set-group">
        {rows.map(([k, icon, label, f]) => {
          const left = s.left(k as never);
          return (
            <button key={k} className="set-row tap" onClick={f}>
              {icon}
              <span className="set-label">{label}<small>{left ? s.tt(`${left} left this month`, `এ মাসে ${digits('bn', left)}টি বাকি`) : s.tt('Monthly limit used', 'মাসিক সীমা শেষ')}</small></span>
              <ChevronRight size={18} className="muted" />
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function FiguresTab({ id }: { id: string }) {
  const s = useStore();
  const p = findPaper(s, id)!;
  const x = PX[id];
  if (!x.license.reuse || !x.figures.length) {
    return (
      <div className="fig-locked">
        <Empty
          icon={<ImageOff size={28} />}
          title={!x.license.reuse ? s.tt('Figures can’t be shown in the app', 'ফিগার অ্যাপে দেখানো যাবে না') : s.tt('No figures prepared yet', 'এখনো ফিগার প্রস্তুত হয়নি')}
          action={<>
            <p className="empty-sub">{!x.license.reuse ? s.tt(`This paper uses the ${x.license.label}, which doesn’t allow us to reuse its figures. You can see them in the original paper.`, `এই পেপারের লাইসেন্স (${x.license.label}) ফিগার পুনর্ব্যবহারের অনুমতি দেয় না। মূল পেপারে দেখতে পারেন।`) : s.tt('We add figures when a paper’s licence allows reuse.', 'লাইসেন্স অনুমতি দিলে আমরা ফিগার যোগ করি।')}</p>
            <Btn variant="secondary" icon={<ExternalLink size={17} />} onClick={() => { s.toast(s.t('openingLink')); window.open(p.url, '_blank', 'noopener'); }}>{s.tt('View figures on arXiv', 'arXiv-এ ফিগার দেখুন')}</Btn>
          </>}
        />
      </div>
    );
  }
  const answered = x.figures.filter((f) => s.figAnswers[`${id}-${f.n}`] !== undefined).length;
  return (
    <div>
      <div className="fig-intro">
        <b>{s.tt('Figure-first reading', 'ফিগার-ফার্স্ট পড়া')}</b>
        <span>{s.tt('Look at each figure, guess what it shows, then read the explanation.', 'প্রতিটি ফিগার দেখুন, কী দেখাচ্ছে অনুমান করুন, তারপর ব্যাখ্যা পড়ুন।')}</span>
      </div>
      <div className="fig-grid">
        {x.figures.map((f, i) => {
          const done = s.figAnswers[`${id}-${f.n}`] !== undefined;
          return (
            <button key={f.n} className="fig-thumb tap" onClick={() => s.push('figures', { id, i })} style={{ ['--h' as string]: SCENE_BG[f.scene] }}>
              <span className="fig-art"><Scene kind={f.scene} playing={false} /></span>
              <span className="fig-cap"><b>{s.tt('Figure', 'ফিগার')} {digits(s.lang, f.n)}</b>{s.x(f.caption)}</span>
              <span className={`fig-state ${done ? 'done' : ''}`}>{done ? <><Check size={13} /> {s.tt('Answered', 'উত্তর দিয়েছেন')}</> : <><CircleHelp size={13} /> {s.tt('Quick question', 'ছোট প্রশ্ন')}</>}</span>
            </button>
          );
        })}
      </div>
      <Btn block size="lg" icon={<Play size={18} fill="currentColor" />} onClick={() => s.push('figures', { id, i: Math.min(answered, x.figures.length - 1) })}>
        {answered === 0 ? s.tt('Start with Figure 1', 'ফিগার ১ দিয়ে শুরু') : answered === x.figures.length ? s.tt('Review figures', 'ফিগার আবার দেখুন') : s.tt(`Continue: Figure ${answered + 1}`, `চালিয়ে যান: ফিগার ${digits('bn', answered + 1)}`)}
      </Btn>
      <p className="fine" style={{ marginTop: 12 }}><Info size={13} /> {s.tt(`Figures from ${p.authors} (${p.year}), reused under ${x.license.label}. Explanations prepared with AI and saved.`, `${p.authors} (${p.year})-এর ফিগার, ${x.license.label} অনুযায়ী ব্যবহৃত। ব্যাখ্যা এআই দিয়ে প্রস্তুত ও সংরক্ষিত।`)}</p>
    </div>
  );
}

export function RelatedTab({ id }: { id: string }) {
  const s = useStore();
  const x = PX[id];
  const paths = PATHS.filter((p) => p.papers.includes(id));
  const ext = (ids: string[]) => ids.filter((r) => findPaper(s, r));
  return (
    <div>
      <div className="sec-head" style={{ marginTop: 0 }}><h3>{s.tt('Came before (this paper builds on)', 'আগের কাজ (এই পেপার যার উপর দাঁড়িয়ে)')}</h3></div>
      {ext(x.buildsOn).length ? ext(x.buildsOn).map((r) => <MiniPaper key={r} id={r} />) : <p className="fine">{s.tt('No earlier papers from our collection.', 'আমাদের সংগ্রহে আগের পেপার নেই।')}</p>}
      <div className="sec-head"><h3>{s.tt('Came after (builds on this paper)', 'পরের কাজ (এই পেপারের উপর দাঁড়িয়ে)')}</h3></div>
      {ext(x.builtBy).length ? ext(x.builtBy).map((r) => <MiniPaper key={r} id={r} />) : <p className="fine">{s.tt('No later papers from our collection yet.', 'আমাদের সংগ্রহে এখনো পরের পেপার নেই।')}</p>}
      {paths.length > 0 && (
        <>
          <div className="sec-head"><h3>{s.tt('In reading paths', 'রিডিং পাথে আছে')}</h3></div>
          <div className="list">
            {paths.map((p) => (
              <button key={p.id} className="res-row tap" onClick={() => s.push('path', { id: p.id })}>
                <span className="res-icon" style={{ background: `hsl(${p.hue} 55% 93%)`, color: `hsl(${p.hue} 50% 32%)` }}><Route size={20} /></span>
                <span className="res-text"><b>{s.x(p.title)}</b><span className="sub">{s.tt(`Paper ${p.papers.indexOf(id) + 1} of ${p.papers.length}`, `${digits('bn', p.papers.length)}টির ${digits('bn', p.papers.indexOf(id) + 1)} নম্বর পেপার`)}</span></span>
                <ChevronRight size={18} className="muted" />
              </button>
            ))}
          </div>
        </>
      )}
      <p className="fine" style={{ marginTop: 14 }}><Info size={13} /> {s.tt('Citation links from Semantic Scholar and OpenAlex. Paths are curated by creators.', 'সাইটেশন সংযোগ Semantic Scholar ও OpenAlex থেকে। পাথ ক্রিয়েটরদের বাছাই করা।')}</p>
    </div>
  );
}

export function DiscussTab({ id }: { id: string }) {
  const s = useStore();
  const x = PX[id];
  const [text, setText] = useState('');
  const key = `paper:${id}`;
  const comments = [...(s.extraComments[key] || []), ...x.discussion];
  const club = CLUBS.find((c) => c.papers.includes(id));
  return (
    <div>
      {x.review ? (
        <button className="review-card tap" onClick={() => s.push('reviews', { id })}>
          <span className="rv-head"><span className="rv-venue">OpenReview <span className="dot-sep" /> {x.review.venue}</span><span className="rv-decision">{s.x(x.review.decision)}</span></span>
          <span className="rv-scores">
            {x.review.reviews.map((r) => <span key={r.id} className={`rv-score ${r.rating >= 8 ? 'hi' : r.rating >= 6 ? 'mid' : 'lo'}`}>{digits(s.lang, r.rating)}</span>)}
            <span className="rv-avg">{s.tt('Average', 'গড়')} {digits(s.lang, (x.review.reviews.reduce((a, r) => a + r.rating, 0) / x.review.reviews.length).toFixed(1))} / {digits(s.lang, 10)}</span>
          </span>
          <span className="rv-cta">{s.tt(`Read ${x.review.reviews.length} expert reviews`, `${digits('bn', x.review.reviews.length)}টি বিশেষজ্ঞ রিভিউ পড়ুন`)} <ChevronRight size={16} /></span>
        </button>
      ) : (
        <div className="note-box"><Info size={16} /> <span>{s.tt('No public peer reviews for this venue. OpenReview mainly covers ICLR and recent NeurIPS papers.', 'এই ভেন্যুর পাবলিক রিভিউ নেই। OpenReview মূলত ICLR ও সাম্প্রতিক NeurIPS কভার করে।')}</span></div>
      )}
      {club && (
        <button className="res-row tap club-hint" onClick={() => s.push('club', { id: club.id })}>
          <span className="res-icon" style={{ background: `hsl(${club.hue} 55% 93%)`, color: `hsl(${club.hue} 50% 32%)` }}><Users size={20} /></span>
          <span className="res-text"><b>{s.x(club.name)}</b><span className="sub">{s.tt('Paper club reading this paper', 'এই পেপার পড়ছে এমন ক্লাব')}</span></span>
          <ChevronRight size={18} className="muted" />
        </button>
      )}
      <div className="sec-head"><h3>{s.tt('Discussion', 'আলোচনা')} <span className="muted">{digits(s.lang, comments.length)}</span></h3></div>
      <div className="disc-input">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder={s.tt('Ask a question or share an insight', 'প্রশ্ন করুন বা ভাবনা জানান')} onKeyDown={(e) => { if (e.key === 'Enter' && text.trim()) { s.addComment(key, text.trim()); setText(''); } }} enterKeyHint="send" />
        <button className="send-btn tap" disabled={!text.trim()} onClick={() => { s.addComment(key, text.trim()); setText(''); }} aria-label={s.t('send')}><Send size={18} /></button>
      </div>
      <div className="disc-list">
        {comments.map((c) => {
          const who = creatorOf(s, c.who);
          return (
            <div className="comment" key={c.id}>
              <Avatar c={who} size={34} />
              <div className="comment-body">
                <div className="comment-top"><Name c={who} /> <span className="sub">{s.x(c.time)}</span></div>
                <div className="comment-text">{s.x(c.text)}</div>
              </div>
              <span className="comment-like"><Star size={14} />{digits(s.lang, c.likes)}</span>
            </div>
          );
        })}
        {!comments.length && <Empty icon={<MessageCircle size={26} />} title={s.tt('Start the discussion', 'আলোচনা শুরু করুন')} />}
      </div>
    </div>
  );
}

/* ---------------- Figure-first reader ---------------- */

export function FigureReader({ id, i: start = 0 }: { id: string; i?: number }) {
  const s = useStore();
  const x = PX[id];
  const p = findPaper(s, id)!;
  const [i, setI] = useState(start);
  const f = x.figures[i];
  const key = `${id}-${f.n}`;
  const picked = s.figAnswers[key];
  const [reveal, setReveal] = useState(picked !== undefined);
  const last = i === x.figures.length - 1;
  const go = (n: number) => { setI(n); setReveal(s.figAnswers[`${id}-${x.figures[n].n}`] !== undefined); };
  return (
    <div className="screen-col fig-reader">
      <header className="header">
        <button className="icon-btn tap" onClick={s.back} aria-label={s.t('close')}><X size={22} /></button>
        <div className="header-title"><span className="header-stack"><small>{s.tt(`Figure ${f.n} of ${x.figures.length}`, `ফিগার ${digits('bn', f.n)}/${digits('bn', x.figures.length)}`)}</small>{p.title}</span></div>
        <div className="header-right" />
      </header>
      <div className="fr-progress"><Progress value={(i + (reveal ? 1 : 0)) / x.figures.length} thin /></div>
      <div className="scroll" key={i}>
        <figure className="fr-figure" style={{ ['--h' as string]: SCENE_BG[f.scene] }}>
          <Scene kind={f.scene} />
        </figure>
        <div className="pad">
          <p className="fr-caption"><b>{s.tt('Figure', 'ফিগার')} {digits(s.lang, f.n)}.</b> {s.x(f.caption)}</p>
          <div className="fr-q">
            <span className="fr-q-label">{s.tt('Before the explanation, try this', 'ব্যাখ্যার আগে চেষ্টা করুন')}</span>
            <h2>{s.x(f.q)}</h2>
            <div className="options">
              {f.options.map((o, k) => {
                const state = picked === undefined ? '' : k === f.answer ? 'right' : k === picked ? 'wrong' : 'dim';
                return (
                  <button key={k} className={`option tap ${state}`} disabled={picked !== undefined} onClick={() => { s.answerFig(key, k); setReveal(true); }}>
                    <span className="opt-key">{String.fromCharCode(65 + k)}</span>
                    <span className="opt-text">{s.x(o)}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {reveal ? (
            <div className={`fr-explain ${picked === undefined ? '' : picked === f.answer ? 'right' : 'wrong'}`} role="status">
              {picked !== undefined && <b>{picked === f.answer ? s.t('correct') : s.tt(`Not quite. The answer is ${String.fromCharCode(65 + f.answer)}.`, `সঠিক নয়। উত্তর ${String.fromCharCode(65 + f.answer)}।`)}</b>}
              <p>{s.x(f.explain)}</p>
            </div>
          ) : (
            <button className="link-btn tap center" onClick={() => setReveal(true)}>{s.tt('Skip and show the explanation', 'বাদ দিয়ে ব্যাখ্যা দেখুন')}</button>
          )}
        </div>
        <div className="bottom-space" />
      </div>
      <div className="bottom-bar fr-bar">
        {i > 0 && <Btn variant="secondary" onClick={() => go(i - 1)}>{s.tt('Previous', 'আগের')}</Btn>}
        {last ? (
          <Btn block onClick={() => { s.back(); s.toast(s.tt('Figures done', 'ফিগার শেষ')); }} disabled={!reveal}>{s.t('done')}</Btn>
        ) : (
          <Btn block onClick={() => go(i + 1)} disabled={!reveal}>{s.tt('Next figure', 'পরের ফিগার')} <ArrowRight size={17} /></Btn>
        )}
      </div>
    </div>
  );
}

/* ---------------- Learn before reading ---------------- */

export function openPrereq(s: Store, pr: Prereq) {
  const l = pr.link;
  if (l.kind === 'lesson') s.push('lesson', { course: l.course, lesson: l.lesson });
  else if (l.kind === 'quiz') s.push('quiz', { id: l.id });
  else { s.markKnown(pr.id); s.push(l.kind === 'reel' ? 'reel' : 'note', { id: l.id }); }
}

export function PrereqScreen({ id }: { id: string }) {
  const s = useStore();
  const p = findPaper(s, id)!;
  const x = PX[id];
  const ready = x.prereqs.filter((pr) => prereqDone(s, pr)).length;
  const open = (pr: Prereq) => openPrereq(s, pr);
  const kindLabel = (pr: Prereq) => {
    const l = pr.link;
    if (l.kind === 'lesson') return <><Layers size={13} /> {s.t('lesson')} <span className="dot-sep" /> {digits(s.lang, l.min)} {s.t('min')}</>;
    if (l.kind === 'quiz') return <><Target size={13} /> {s.t('quiz')} <span className="dot-sep" /> {digits(s.lang, l.n)} {s.t('questions')}</>;
    if (l.kind === 'reel') return <><Play size={12} fill="currentColor" /> {s.t('reel')} <span className="dot-sep" /> {digits(s.lang, l.sec)}{s.tt('s', ' সে')}</>;
    return <><FileText size={13} /> {s.t('noteType')} <span className="dot-sep" /> {digits(s.lang, l.min)} {s.t('min')}</>;
  };
  return (
    <div className="screen-col">
      <Header title={s.tt('Learn before reading', 'পড়ার আগে শিখুন')} />
      <div className="scroll pad">
        <div className="prep-head">
          <div className="prep-ring" style={{ ['--p' as string]: ready / x.prereqs.length }}><b>{digits(s.lang, ready)}/{digits(s.lang, x.prereqs.length)}</b></div>
          <div>
            <h2>{p.title}</h2>
            <p>{s.tt('These ideas come up in the paper. Open any of them, then come back. Your place in the paper is kept.', 'এই ধারণাগুলো পেপারে আসে। যেকোনোটি খুলুন, তারপর ফিরে আসুন। পেপারে আপনার জায়গা রাখা থাকবে।')}</p>
          </div>
        </div>
        <ol className="prep-list">
          {x.prereqs.map((pr) => {
            const d = prereqDone(s, pr);
            return (
              <li key={pr.id} className={`prep-row ${d ? 'done' : ''}`}>
                <button className="prep-main tap" onClick={() => open(pr)}>
                  <span className="lr-num">{d ? <Check size={16} strokeWidth={3} /> : <BookOpenCheck size={16} />}</span>
                  <span className="lr-body">
                    <span className="lr-title">{s.x(pr.label)}</span>
                    <span className="prep-why">{s.x(pr.why)}</span>
                    <span className="lr-meta">{kindLabel(pr)}</span>
                  </span>
                  <ChevronRight size={18} className="muted" />
                </button>
                {!(pr.link.kind === 'lesson' && s.done[pr.link.course]?.includes(pr.link.lesson)) && !(pr.link.kind === 'quiz' && s.quizHistory.some((h) => h.setId === (pr.link as { id: string }).id)) && (
                  <button className={`know-btn tap ${s.known.has(pr.id) ? 'on' : ''}`} onClick={() => s.toggleKnown(pr.id)} aria-pressed={s.known.has(pr.id)}>
                    {s.known.has(pr.id) ? <><Check size={14} /> {s.tt('Marked as known', 'জানা হিসেবে চিহ্নিত')}</> : s.tt('I already know this', 'আমি এটা জানি')}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
        <p className="fine"><Info size={13} /> {s.tt('Prerequisites were suggested by AI when the Paper Card was prepared, then matched to Doshomik Bytes lessons, reels and quizzes.', 'পেপার কার্ড তৈরির সময় এআই পূর্বজ্ঞান প্রস্তাব করেছে, পরে দশমিক বাইটসের লেসন, রিল ও কুইজের সাথে মেলানো হয়েছে।')}</p>
      </div>
      <div className="bottom-bar">
        <Btn block size="lg" variant={ready === x.prereqs.length ? 'primary' : 'secondary'} onClick={s.back}>{s.tt('Back to the Paper Card', 'পেপার কার্ডে ফিরুন')}</Btn>
      </div>
    </div>
  );
}

/* ---------------- Reviews ---------------- */

export function ReviewsScreen({ id }: { id: string }) {
  const s = useStore();
  const p = findPaper(s, id)!;
  const r = PX[id].review!;
  const [open, setOpen] = useState<string | null>(r.reviews[0].id);
  return (
    <div className="screen-col">
      <Header title={<span className="header-stack"><small>OpenReview · {r.venue}</small>{s.tt('Expert reviews', 'বিশেষজ্ঞ রিভিউ')}</span>} />
      <div className="scroll pad">
        <h2 className="rv-paper">{p.title}</h2>
        <div className="rv-summary">
          <span className="rv-decision">{s.x(r.decision)}</span>
          <span>{digits(s.lang, r.reviews.length)} {s.tt('reviews', 'রিভিউ')}</span>
          <span className="sim-tag">{s.tt('Sample reviews for this demo', 'ডেমোর জন্য নমুনা রিভিউ')}</span>
        </div>
        <p className="fine" style={{ margin: '10px 0 14px' }}>{s.tt('Reviewers score from 1 to 10 and rate their confidence from 1 to 5. Reviews help you see what experts questioned, not just what the authors claimed.', 'রিভিউয়াররা ১–১০ স্কোর দেন এবং আত্মবিশ্বাস ১–৫। রিভিউ দেখায় বিশেষজ্ঞরা কী প্রশ্ন তুলেছেন, শুধু লেখকের দাবি নয়।')}</p>
        <div className="list">
          {r.reviews.map((rv, k) => (
            <article key={rv.id} className={`review ${open === rv.id ? 'open' : ''}`}>
              <button className="review-top tap" onClick={() => setOpen(open === rv.id ? null : rv.id)} aria-expanded={open === rv.id}>
                <span className={`rv-score lg ${rv.rating >= 8 ? 'hi' : rv.rating >= 6 ? 'mid' : 'lo'}`}>{digits(s.lang, rv.rating)}</span>
                <span className="res-text">
                  <b>{s.tt(`Reviewer ${k + 1}`, `রিভিউয়ার ${digits('bn', k + 1)}`)}: {s.x(rv.label)}</b>
                  <span className="sub">{s.tt('Confidence', 'আত্মবিশ্বাস')} {digits(s.lang, rv.confidence)}/{digits(s.lang, 5)}</span>
                </span>
                <ChevronDown size={18} className="muted chev" />
              </button>
              <p className="review-sum">{s.x(rv.summary)}</p>
              {open === rv.id && (
                <div className="review-body">
                  <h4 className="pos">{s.tt('Strengths', 'শক্তি')}</h4>
                  <ul>{rv.strengths.map((x, i) => <li key={i}>{s.x(x)}</li>)}</ul>
                  <h4 className="neg">{s.tt('Weaknesses', 'দুর্বলতা')}</h4>
                  <ul>{rv.weaknesses.map((x, i) => <li key={i}>{s.x(x)}</li>)}</ul>
                </div>
              )}
            </article>
          ))}
        </div>
        <Btn block variant="secondary" icon={<ExternalLink size={17} />} className="mt16" onClick={() => s.toast(s.tt('Opening openreview.net', 'openreview.net খোলা হচ্ছে'))}>{s.tt('View the full thread on OpenReview', 'OpenReview-এ পুরো থ্রেড দেখুন')}</Btn>
      </div>
    </div>
  );
}

/* ---------------- Reading path ---------------- */

export function PathScreen({ id }: { id: string }) {
  const s = useStore();
  const p = PATHS.find((x) => x.id === id)!;
  const c = creatorOf(s, p.by);
  const done = pathProgress(s, p.papers);
  const next = p.papers.find((pid) => (s.reading[pid]?.step || 0) === 0) || p.papers[0];
  return (
    <div className="screen-col">
      <Header title={s.tt('Reading path', 'রিডিং পাথ')} />
      <div className="scroll">
        <div className="path-hero pad" style={{ ['--h' as string]: p.hue }}>
          <span className="path-kicker"><Route size={15} /> {digits(s.lang, p.papers.length)} {s.tt('papers, in order', 'পেপার, ক্রমানুসারে')}</span>
          <h1>{s.x(p.title)}</h1>
          <p>{s.x(p.desc)}</p>
          <button className="course-creator tap" onClick={() => openCreator(s, c.id)}><Avatar c={c} size={26} /> <span className="muted">{s.tt('Curated by', 'বাছাই করেছেন')}</span> <Name c={c} /></button>
          <div className="course-progress"><Progress value={done / p.papers.length} /><span>{digits(s.lang, done)}/{digits(s.lang, p.papers.length)} {s.tt('explored', 'দেখা')}</span></div>
        </div>
        <ol className="path-list">
          {p.papers.map((pid, i) => {
            const paper = findPaper(s, pid)!;
            const st = s.reading[pid]?.step || 0;
            return (
              <li key={pid} className={`path-item ${st ? 'done' : ''} ${pid === next && done < p.papers.length ? 'current' : ''}`}>
                <span className="pi-rail"><span className="pi-num">{st ? <Check size={14} strokeWidth={3} /> : digits(s.lang, i + 1)}</span></span>
                <button className="pi-card tap" onClick={() => s.push('paper', { id: pid })}>
                  <b>{paper.title}</b>
                  <span className="sub">{paper.authors}, {paper.year}</span>
                  <span className="pi-q">{PX[pid] ? s.x(PX[pid].question) : s.x(paper.problem)}</span>
                  <span className="pi-foot">{PX[pid] && <Level level={PX[pid].difficulty} />}<ReadPill id={pid} /></span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="bottom-space" />
      </div>
      <div className="bottom-bar">
        <Btn block size="lg" icon={<BookOpenCheck size={18} />} onClick={() => s.push('paper', { id: next })}>
          {done === 0 ? s.tt('Start the path', 'পাথ শুরু করুন') : done === p.papers.length ? s.tt('Review from the start', 'শুরু থেকে আবার') : s.tt(`Continue with paper ${p.papers.indexOf(next) + 1}`, `${digits('bn', p.papers.indexOf(next) + 1)} নম্বর পেপার দিয়ে চালিয়ে যান`)}
        </Btn>
      </div>
    </div>
  );
}

/* ---------------- Paper clubs ---------------- */

export function ClubsScreen() {
  const s = useStore();
  return (
    <div className="screen-col">
      <Header title={s.tt('Paper clubs', 'পেপার ক্লাব')} />
      <div className="scroll pad">
        <div className="note-box later-box"><CalendarDays size={16} /> <span>{s.tt('Coming in a later release. This preview shows how clubs would work.', 'পরের রিলিজে আসছে। ক্লাব কীভাবে কাজ করবে, এটি তার প্রিভিউ।')}</span></div>
        <div className="list" style={{ marginTop: 14 }}>
          {CLUBS.map((c) => <ClubCard key={c.id} id={c.id} />)}
        </div>
      </div>
    </div>
  );
}

export function ClubCard({ id }: { id: string }) {
  const s = useStore();
  const c = CLUBS.find((x) => x.id === id)!;
  const host = creatorOf(s, c.host);
  const joined = s.clubs.has(id);
  return (
    <button className="club-card tap" style={{ ['--h' as string]: c.hue }} onClick={() => s.push('club', { id })}>
      <span className="club-top"><Avatar c={host} size={40} /><span className="res-text"><b>{s.x(c.name)}</b><span className="sub">{s.tt('Hosted by', 'হোস্ট')} {s.x(host.name)}</span></span>{joined && <span className="status done"><Check size={12} /> {s.tt('Joined', 'যুক্ত')}</span>}</span>
      <span className="club-papers">{c.papers.map((pid) => <span key={pid} className="club-paper">{findPaper(s, pid)!.title.split(':')[0]}</span>)}</span>
      <span className="club-meta"><CalendarDays size={14} /> {s.x(c.when)} <span className="dot-sep" /> <Users size={14} /> {digits(s.lang, c.members + (joined ? 1 : 0))}</span>
      <span className="club-week"><Progress value={c.week / c.weeks} thin /><span>{s.tt(`Week ${c.week} of ${c.weeks}`, `${digits('bn', c.weeks)} সপ্তাহের ${digits('bn', c.week)}`)}</span></span>
    </button>
  );
}

export function ClubScreen({ id }: { id: string }) {
  const s = useStore();
  const c = CLUBS.find((x) => x.id === id)!;
  const host = creatorOf(s, c.host);
  const joined = s.clubs.has(id);
  const premium = s.plan === 'premium';
  return (
    <div className="screen-col">
      <Header title={s.tt('Paper club', 'পেপার ক্লাব')} />
      <div className="scroll">
        <div className="pad club-hero" style={{ ['--h' as string]: c.hue }}>
          <span className="later">{s.tt('Coming later', 'শীঘ্রই')}</span>
          <h1>{s.x(c.name)}</h1>
          <button className="course-creator tap" onClick={() => openCreator(s, host.id)}><Avatar c={host} size={28} /> <span className="muted">{s.tt('Hosted by', 'হোস্ট')}</span> <Name c={host} /></button>
          <div className="course-meta">
            <span><CalendarDays size={15} /> {s.x(c.when)}</span>
            <span><Users size={15} /> {digits(s.lang, c.members + (joined ? 1 : 0))} {s.tt('members', 'সদস্য')}</span>
            <span><MessageCircle size={15} /> {s.x(c.lang)}</span>
          </div>
        </div>
        <div className="pad-x">
          <div className="sec-head" style={{ marginTop: 4 }}><h3>{s.tt('Papers', 'পেপার')}</h3></div>
          {c.papers.map((pid) => <MiniPaper key={pid} id={pid} />)}
          <div className="sec-head"><h3>{s.tt('Schedule', 'সময়সূচি')}</h3></div>
          <ol className="sched">
            {c.sessions.map((se, i) => (
              <li key={i} className={`sched-row ${se.state}`}>
                <span className="sched-dot">{se.state === 'done' ? <Check size={13} strokeWidth={3} /> : digits(s.lang, i + 1)}</span>
                <span className="res-text"><b>{s.x(se.title)}</b><span className="sub">{s.x(se.date)}{se.state === 'next' && <> <span className="dot-sep" /> {s.tt('Next session', 'পরের সেশন')}</>}</span></span>
              </li>
            ))}
          </ol>
          <div className="sec-head"><h3>{s.tt('Club tools', 'ক্লাব টুলস')}</h3>{!premium && <span className="pro-badge sm"><i />Premium</span>}</div>
          <div className="set-group">
            {[
              [s.tt('Shared highlights', 'শেয়ার করা হাইলাইট'), s.tt('See what others marked in the paper', 'অন্যরা পেপারে কী চিহ্নিত করেছে দেখুন')],
              [s.tt('Session recap', 'সেশন রিক্যাপ'), s.tt('A short summary after each session', 'প্রতি সেশনের পর ছোট সারাংশ')],
            ].map(([l, sub]) => (
              <button key={l} className="set-row tap" onClick={() => (premium ? s.toast(s.tt('Available when clubs launch', 'ক্লাব চালু হলে পাওয়া যাবে')) : s.push('premium', {}))}>
                <span className="set-icon">{premium ? <Sparkles size={18} /> : <Lock size={17} />}</span>
                <span className="set-label">{l}<small>{sub}</small></span>
                <ChevronRight size={18} className="muted" />
              </button>
            ))}
          </div>
          <p className="fine">{s.tt('Joining and discussing are free for everyone. Premium adds optional extras.', 'যোগ দেওয়া ও আলোচনা সবার জন্য ফ্রি। প্রিমিয়ামে ঐচ্ছিক বাড়তি সুবিধা।')}</p>
        </div>
        <div className="bottom-space" />
      </div>
      <div className="bottom-bar">
        <Btn block size="lg" variant={joined ? 'secondary' : 'primary'} icon={joined ? <Check size={18} /> : <Users size={18} />} onClick={() => { s.toggleClub(id); s.toast(joined ? s.tt('Left the club', 'ক্লাব ছেড়েছেন') : s.tt(`Joined. Next session: ${c.next.en}`, `যুক্ত হয়েছেন। পরের সেশন: ${c.next.bn}`)); }}>
          {joined ? s.tt('Joined', 'যুক্ত আছেন') : s.tt('Join club', 'ক্লাবে যোগ দিন')}
        </Btn>
      </div>
    </div>
  );
}

/* Explore (classic nav) uses this banner to reach the hub. */
export function ResearchHubBanner() {
  const s = useStore();
  return (
    <button className="hub-banner tap" onClick={() => (s.tabNav ? s.setTab('research') : s.push('researchHub'))}>
      <span className="hb-icon"><BookOpenCheck size={22} /></span>
      <span className="res-text"><b>{s.tt('Research hub', 'রিসার্চ হাব')}</b><span className="sub">{s.tt('Paper Cards, reading tracker, paths and tools', 'পেপার কার্ড, রিডিং ট্র্যাকার, পাথ ও টুলস')}</span></span>
      <ChevronRight size={18} className="muted" />
    </button>
  );
}

export type { Paper };
