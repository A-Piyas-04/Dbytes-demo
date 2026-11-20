import React, { useState } from 'react';
import {
  ArrowRight, BookOpenCheck, Bookmark, Check, ChevronRight, FileText, Flame, Info, Layers, Play, Quote, Target, X,
} from 'lucide-react';
import { type Paper } from '../data';
import { useStore, findPaper, type Store } from '../store';
import { compact, digits } from '../i18n';
import { Scene, SCENE_BG } from '../scenes';
import { Btn, Header, Level, Progress, Sheet } from '../ui';
import { PX, type Prereq, type PaperX } from '../research/data';

/* ---------------- shared bits ---------------- */

export const px = (id: string): PaperX | undefined => PX[id];

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

/* ---------------- Private note ---------------- */

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

export type { Paper };
