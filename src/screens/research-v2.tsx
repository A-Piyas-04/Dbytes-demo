/* Research V2: the simple version. Few features, short words, nothing nested.
   Free: search, summary, learn first, figures, reviews + discussion, related papers, my papers.
   Paid AI (limited free, then Premium): reading map, reproduction roadmap. */
import React, { useMemo, useState } from 'react';
import { ArrowRight, Bookmark, Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp, Clock, ExternalLink, FileText, GraduationCap, ImageOff, Lightbulb, ListChecks, MessageCircle, Play, Search, Send, Target, TriangleAlert, Workflow, X } from 'lucide-react';
import type { TopicId } from '../data';
import type { L } from '../research/data';
import { COLLECTION, PX } from '../research/data';
import { useStore, findPaper, creatorOf } from '../store';
import { ROADMAPS } from '../research/content';
import { Scene, SCENE_BG } from '../scenes';
import { digits } from '../i18n';
import { Avatar, Btn, Empty, Header, Level, Name, Seg, TopBar, TopicChips } from '../ui';
import { MiniPaper, openPrereq, prereqDone } from './research';
import { OutputRow } from './tools';

const isRead = (s: ReturnType<typeof useStore>, id: string) => (s.reading[id]?.step || 0) >= 1;

function useSearch(q: string) {
  const s = useStore();
  return useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return [];
    return COLLECTION.filter((id) => {
      const p = findPaper(s, id)!;
      const x = PX[id];
      return [p.title, p.authors, x.question.en, x.question.bn].some((f) => f.toLowerCase().includes(n));
    });
  }, [q, s.lang]);
}

/* ---------------- Home ---------------- */

export function SimpleResearchHome() {
  const s = useStore();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<'papers' | 'mine'>('papers');
  const results = useSearch(q);
  return (
    <div className="screen-col">
      <TopBar noSearch />
      <div className="search-wrap">
        <label className="search">
          <Search size={19} aria-hidden="true" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={s.tt('Search papers', 'পেপার খুঁজুন')} aria-label={s.tt('Search papers', 'পেপার খুঁজুন')} enterKeyHint="search" />
          {q && <button className="icon-btn sm tap" onClick={() => setQ('')} aria-label={s.t('clear')}><X size={16} /></button>}
        </label>
      </div>
      {q.trim() ? (
        <div className="scroll pad">
          {results.length ? <div className="list">{results.map((id) => <SimpleRow key={id} id={id} />)}</div> : (
            <Empty icon={<Search size={28} />} title={s.tt('No papers found', 'কোনো পেপার নেই')} action={<p className="empty-sub">{s.tt('Try “LoRA” or “attention”.', '“LoRA” বা “attention” লিখে দেখুন।')}</p>} />
          )}
        </div>
      ) : (
        <>
          <div className="pad-x seg-wrap">
            <Seg value={tab} onChange={setTab} options={[{ id: 'papers', label: s.tt('Papers', 'পেপার') }, { id: 'mine', label: s.tt('My papers', 'আমার পেপার') }]} />
          </div>
          <div className="scroll" key={tab}>
            {tab === 'papers' ? <PapersList /> : <MyPapers onFind={() => setTab('papers')} />}
            <div className="bottom-space" />
          </div>
        </>
      )}
    </div>
  );
}

function PapersList() {
  const s = useStore();
  const [topic, setTopic] = useState<TopicId | null>(null);
  const ids = COLLECTION.filter((id) => !topic || findPaper(s, id)!.topic === topic)
    .sort((a, b) => (PX[a].trend ?? 99) - (PX[b].trend ?? 99));
  const saved = Array.from(s.saves).find((id) => PX[id] && !isRead(s, id));
  return (
    <>
      {saved && !topic && (
        <button className="continue-paper tap" onClick={() => s.push('paper', { id: saved })}>
          <span className="qc-label"><Bookmark size={14} /> {s.tt('Up next', 'এরপর পড়ুন')}</span>
          <span className="cp-title">{findPaper(s, saved)!.title}</span>
          <span className="qc-go"><ArrowRight size={18} /></span>
        </button>
      )}
      {!topic && <ReadMapCard />}
      <div className="explore-chips" style={{ paddingTop: 4 }}><TopicChips value={topic} onChange={setTopic} /></div>
      <div className="list pad">
        {ids.map((id) => <SimpleRow key={id} id={id} />)}
        {!ids.length && <Empty icon={<FileText size={28} />} title={s.tt('No papers here yet', 'এখানে এখনো পেপার নেই')} />}
      </div>
    </>
  );
}

/* Premium: a topic becomes a step-by-step map of papers. */
export function ReadMapCard() {
  const s = useStore();
  const left = s.left('readmap');
  const sub = s.plan === 'premium' ? s.tt(`${left} left this month`, `এ মাসে ${digits('bn', left)}টি বাকি`) : left ? s.tt('1 free this month', 'এ মাসে ১টি ফ্রি') : s.tt('Premium', 'প্রিমিয়াম');
  return (
    <div className="pad-x rm-card-wrap">
      <button className="v2-pro tap" onClick={() => s.push('tool', { tool: 'readmap' })}>
        <span className="v2-pro-icon"><Workflow size={20} /></span>
        <span className="set-label">{s.tt('Reading map', 'রিডিং ম্যাপ')}<small>{s.tt('Pick a topic. Get papers in order.', 'টপিক বাছুন। ক্রমানুসারে পেপার পান।')}</small><small className="rm-sub">{sub}</small></span>
        <span className="pro-badge sm"><i />Pro</span>
      </button>
    </div>
  );
}

function SimpleRow({ id }: { id: string }) {
  const s = useStore();
  const p = findPaper(s, id);
  const x = PX[id];
  if (!p || !x) return null;
  const saved = s.saves.has(id);
  return (
    <article className="rp-card v2-row">
      <button className="rp-main tap-soft" onClick={() => s.push('paper', { id })}>
        <span className="rp-top">
          <Level level={x.difficulty} />
          {isRead(s, id) && <span className="v2-done"><Check size={13} strokeWidth={3} /> {s.tt('Read', 'পড়া শেষ')}</span>}
        </span>
        <h3 className="paper-title">{p.title}</h3>
        <span className="rp-q">{s.x(x.question)}</span>
      </button>
      <button className={`icon-btn sm tap save v2-save ${saved ? 'on' : ''}`} onClick={() => s.toggleSave(id)} aria-label={s.t('save')} aria-pressed={saved}>
        <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
      </button>
    </article>
  );
}

function MyPapers({ onFind }: { onFind: () => void }) {
  const s = useStore();
  const saved = Array.from(s.saves).filter((id) => PX[id] && !isRead(s, id));
  const read = COLLECTION.filter((id) => isRead(s, id));
  const plans = s.outputs.filter((o) => o.tool === 'readmap' || o.tool === 'roadmap');
  if (!saved.length && !read.length && !plans.length) {
    return <Empty icon={<Bookmark size={28} />} title={s.tt('Nothing saved yet', 'এখনো কিছু সেভ নেই')} action={<Btn onClick={onFind}>{s.tt('Find a paper', 'পেপার খুঁজুন')}</Btn>} />;
  }
  return (
    <div className="pad">
      <div className="sec-head" style={{ marginTop: 0 }}><h2><Bookmark size={18} /> {s.tt('Saved', 'সেভ করা')} <span className="muted">{digits(s.lang, saved.length)}</span></h2></div>
      {saved.length ? <div className="list">{saved.map((id) => <SimpleRow key={id} id={id} />)}</div> : <p className="fine">{s.tt('Tap the bookmark to save.', 'সেভ করতে বুকমার্কে চাপুন।')}</p>}
      <div className="sec-head"><h2><CheckCircle2 size={18} /> {s.tt('Read', 'পড়া শেষ')} <span className="muted">{digits(s.lang, read.length)}</span></h2></div>
      {read.length ? <div className="list">{read.map((id) => <SimpleRow key={id} id={id} />)}</div> : <p className="fine">{s.tt('Papers you finish show here.', 'শেষ করা পেপার এখানে দেখাবে।')}</p>}
      {plans.length > 0 && (
        <>
          <div className="sec-head"><h2><Workflow size={18} /> {s.tt('Maps and roadmaps', 'ম্যাপ ও রোডম্যাপ')} <span className="muted">{digits(s.lang, plans.length)}</span></h2></div>
          <div className="out-list">{plans.map((o) => <OutputRow key={o.id} o={o} />)}</div>
        </>
      )}
    </div>
  );
}

/* ---------------- Paper ---------------- */

type PTab = 'summary' | 'figures' | 'discuss';

export function SimplePaper({ id, tab: initial }: { id: string; tab?: PTab }) {
  const s = useStore();
  const p = findPaper(s, id)!;
  const x = PX[id];
  const [tab, setTab] = useState<PTab>(initial === 'figures' || initial === 'discuss' ? initial : 'summary');
  const saved = s.saves.has(id);
  const read = isRead(s, id);
  return (
    <div className="screen-col">
      <Header title={s.tt('Paper', 'পেপার')} />
      <div className="scroll">
        <div className="pad v2-head">
          <div className="pc-tags"><Level level={x.difficulty} /><span className="v2-meta"><Clock size={14} /> {digits(s.lang, p.readMin)} {s.t('min')}</span></div>
          <h1 className="pd-title">{p.title}</h1>
          <div className="pd-src">{p.authors}, {p.year}</div>
        </div>
        <div className="sticky-seg">
          <Seg variant="tabs" value={tab} onChange={setTab} options={[
            { id: 'summary', label: s.tt('Summary', 'সারাংশ') },
            { id: 'figures', label: s.tt('Figures', 'ফিগার') },
            { id: 'discuss', label: s.tt('Discuss', 'আলোচনা') },
          ]} />
        </div>
        <div className="pad v2-paper" key={tab}>
          {tab === 'summary' && <SummaryTab id={id} />}
          {tab === 'figures' && <FiguresTab id={id} />}
          {tab === 'discuss' && <DiscussTab id={id} />}
        </div>
        <div className="bottom-space" />
      </div>
      <div className="bottom-bar v2-bar">
        <button className={`v2-act tap ${saved ? 'on' : ''}`} onClick={() => s.toggleSave(id)} aria-pressed={saved}>
          <Bookmark size={20} fill={saved ? 'currentColor' : 'none'} /><span>{saved ? s.tt('Saved', 'সেভড') : s.t('save')}</span>
        </button>
        <button className={`v2-act tap ${read ? 'on' : ''}`} onClick={() => { s.setReading(id, { step: read ? 0 : 1 }); if (!read) s.toast(s.tt('Marked as read', 'পড়া শেষ')); }} aria-pressed={read}>
          <CheckCircle2 size={20} /><span>{read ? s.tt('Read', 'পড়া শেষ') : s.tt('Mark read', 'পড়া শেষ?')}</span>
        </button>
        <Btn size="lg" variant="dark" icon={<ExternalLink size={18} />} onClick={() => { s.toast(s.t('openingLink')); window.open(p.url, '_blank', 'noopener'); }}>{s.tt('Open', 'খুলুন')}</Btn>
      </div>
    </div>
  );
}

/* Summary: the card, what to learn first, related papers, and the roadmap. */
function SummaryTab({ id }: { id: string }) {
  const s = useStore();
  const p = findPaper(s, id)!;
  const x = PX[id];
  const [cl, setCl] = useState(s.lang);
  const v = (l: L | string) => (typeof l === 'string' ? l : l[cl]);
  const prereqs = x.prereqs.slice(0, 3);
  const related = [...x.buildsOn, ...x.builtBy].filter((r) => PX[r]).slice(0, 3);
  return (
    <>
      <div className="explain-lang">
        <span>{s.tt('Language', 'ভাষা')}</span>
        <Seg value={cl} onChange={setCl} options={[{ id: 'en', label: 'English' }, { id: 'bn', label: 'বাংলা' }]} />
      </div>
      <section className="pcs q"><span className="pb-label"><CircleHelp size={17} /> {cl === 'bn' ? 'প্রশ্ন' : 'Question'}</span><p className="pcs-lead">{v(x.question)}</p></section>
      <section className="pcs idea"><span className="pb-label"><Lightbulb size={17} /> {cl === 'bn' ? 'আইডিয়া' : 'Idea'}</span><p className="pcs-lead">{v(p.keyIdea)}</p></section>
      <section className="pcs find"><span className="pb-label"><Target size={17} /> {cl === 'bn' ? 'ফলাফল' : 'Results'}</span><ul>{x.findings.map((f, i) => <li key={i}>{v(f)}</li>)}</ul></section>
      <section className="pcs limit"><span className="pb-label"><TriangleAlert size={17} /> {cl === 'bn' ? 'সীমাবদ্ধতা' : 'Limits'}</span><ul>{x.limitations.map((f, i) => <li key={i}>{v(f)}</li>)}</ul></section>

      {prereqs.length > 0 && (
        <section>
          <div className="sec-head"><h2><GraduationCap size={19} /> {s.tt('Learn first', 'আগে শিখুন')}</h2></div>
          <div className="set-group">
            {prereqs.map((pr) => {
              const d = prereqDone(s, pr);
              return (
                <button key={pr.id} className={`set-row tap v2-pre ${d ? 'done' : ''}`} onClick={() => openPrereq(s, pr)}>
                  <span className="v2-check">{d ? <Check size={15} strokeWidth={3} /> : null}</span>
                  <span className="set-label">{s.x(pr.label)}</span>
                  <ChevronRight size={18} className="muted" />
                </button>
              );
            })}
          </div>
        </section>
      )}

      <RoadmapButton id={id} />

      {related.length > 0 && (
        <section>
          <div className="sec-head"><h3>{s.tt('Related papers', 'সম্পর্কিত পেপার')}</h3></div>
          {related.map((r) => <MiniPaper key={r} id={r} />)}
        </section>
      )}
    </>
  );
}

/* One tap: reopen a saved roadmap for free, or build one (1 free try, then Premium). */
function RoadmapButton({ id }: { id: string }) {
  const s = useStore();
  const supported = !!ROADMAPS[id];
  const saved = s.outputs.find((o) => o.tool === 'roadmap' && o.params.paper === id);
  const left = s.left('roadmap');
  const premium = s.plan === 'premium';
  const sub = !supported ? s.tt('Not ready for this paper yet', 'এই পেপারের জন্য এখনো নেই')
    : saved ? s.tt('Saved. Open for free', 'সেভ করা। ফ্রি খুলুন')
    : premium ? s.tt(`${left} left this month`, `এ মাসে ${digits('bn', left)}টি বাকি`)
    : left ? s.tt('1 free try', '১টি ফ্রি ট্রায়াল') : s.tt('Premium', 'প্রিমিয়াম');
  const go = () => {
    if (saved) { s.push('output', { id: saved.id }); return; }
    if (s.aiPaused) { s.setSheet({ name: 'paused' }); return; }
    if (left <= 0) { s.setSheet({ name: 'limit', params: { tool: 'roadmap' } }); return; }
    s.setDialog({
      title: premium ? s.tt(`Use 1 of your ${left} roadmaps?`, `${digits('bn', left)}টির ১টি রোডম্যাপ ব্যবহার করবেন?`) : s.tt('Use your free roadmap try?', 'ফ্রি রোডম্যাপ ট্রায়াল ব্যবহার করবেন?'),
      confirm: s.tt('Build', 'তৈরি করুন'),
      onConfirm: () => { s.spend('roadmap'); s.push('job', { tool: 'roadmap', params: { paper: id }, outId: `o${Date.now()}` }); },
    });
  };
  return (
    <button className={`v2-pro tap ${supported ? '' : 'off'}`} onClick={go} disabled={!supported}>
      <span className="v2-pro-icon"><ListChecks size={20} /></span>
      <span className="set-label">{s.tt('How to reproduce it', 'কীভাবে রিপ্রোডিউস করবেন')}<small>{sub}</small></span>
      {supported && !saved && <span className="pro-badge sm"><i />Pro</span>}
      {supported && saved && <ChevronRight size={18} />}
    </button>
  );
}

/* Figures: thumbnails, then the guess-first reader. */
function FiguresTab({ id }: { id: string }) {
  const s = useStore();
  const p = findPaper(s, id)!;
  const x = PX[id];
  if (!x.license.reuse || !x.figures.length) {
    return (
      <Empty icon={<ImageOff size={28} />} title={s.tt('Figures are in the original paper', 'ফিগার মূল পেপারে আছে')}
        action={<Btn variant="secondary" icon={<ExternalLink size={17} />} onClick={() => { s.toast(s.t('openingLink')); window.open(p.url, '_blank', 'noopener'); }}>{s.tt('View on arXiv', 'arXiv-এ দেখুন')}</Btn>} />
    );
  }
  const answered = x.figures.filter((f) => s.figAnswers[`${id}-${f.n}`] !== undefined).length;
  const all = answered === x.figures.length;
  return (
    <>
      <p className="v2-lede">{s.tt('Guess what each figure shows. Then see the answer.', 'প্রতিটি ফিগার কী দেখায় অনুমান করুন। তারপর উত্তর দেখুন।')}</p>
      <Btn block size="lg" icon={<Play size={18} fill="currentColor" />} onClick={() => s.push('figures', { id, i: all ? 0 : answered })}>
        {answered === 0 ? s.tt('Start', 'শুরু করুন') : all ? s.tt('See again', 'আবার দেখুন') : s.tt(`Continue: figure ${answered + 1}`, `চালিয়ে যান: ফিগার ${digits('bn', answered + 1)}`)}
      </Btn>
      <div className="fig-grid">
        {x.figures.map((f, i) => {
          const done = s.figAnswers[`${id}-${f.n}`] !== undefined;
          return (
            <button key={f.n} className="fig-thumb tap" onClick={() => s.push('figures', { id, i })} style={{ ['--h' as string]: SCENE_BG[f.scene] }}>
              <span className="fig-art"><Scene kind={f.scene} playing={false} /></span>
              <span className="fig-cap"><b>{s.tt('Figure', 'ফিগার')} {digits(s.lang, f.n)}</b>{s.x(f.caption)}</span>
              {done && <span className="fig-state done"><Check size={13} /> {s.tt('Done', 'শেষ')}</span>}
            </button>
          );
        })}
      </div>
    </>
  );
}

/* Expert reviews (if any) and the comment thread, on one page. */
function DiscussTab({ id }: { id: string }) {
  const s = useStore();
  const x = PX[id];
  const r = x.review;
  const [open, setOpen] = useState<string | null>(null);
  const [text, setText] = useState('');
  const key = `paper:${id}`;
  const comments = [...(s.extraComments[key] || []), ...x.discussion];
  const send = () => { if (text.trim()) { s.addComment(key, text.trim()); setText(''); } };
  return (
    <>
      <div className="sec-head" style={{ marginTop: 0 }}>
        <h2>{s.tt('Expert reviews', 'বিশেষজ্ঞ রিভিউ')}</h2>
        {r && <span className="rv-decision">{r.venue} · {s.x(r.decision)}</span>}
      </div>
      {r ? (
        <div className="list">
          {r.reviews.map((rv, k) => (
            <article key={rv.id} className={`review ${open === rv.id ? 'open' : ''}`}>
              <button className="review-top tap" onClick={() => setOpen(open === rv.id ? null : rv.id)} aria-expanded={open === rv.id}>
                <span className={`rv-score ${rv.rating >= 8 ? 'hi' : rv.rating >= 6 ? 'mid' : 'lo'}`}>{digits(s.lang, rv.rating)}</span>
                <span className="res-text"><b>{s.tt(`Reviewer ${k + 1}`, `রিভিউয়ার ${digits('bn', k + 1)}`)}</b><span className="sub">{s.x(rv.label)}</span></span>
                <ChevronDown size={18} className="muted chev" />
              </button>
              {open === rv.id && (
                <div className="review-body">
                  <p className="review-sum" style={{ marginTop: 0 }}>{s.x(rv.summary)}</p>
                  <h4 className="pos">{s.tt('Strengths', 'শক্তি')}</h4>
                  <ul>{rv.strengths.map((t, i) => <li key={i}>{s.x(t)}</li>)}</ul>
                  <h4 className="neg">{s.tt('Weaknesses', 'দুর্বলতা')}</h4>
                  <ul>{rv.weaknesses.map((t, i) => <li key={i}>{s.x(t)}</li>)}</ul>
                </div>
              )}
            </article>
          ))}
        </div>
      ) : <p className="fine">{s.tt('No public reviews for this paper.', 'এই পেপারের পাবলিক রিভিউ নেই।')}</p>}

      <div className="sec-head"><h2>{s.tt('Discussion', 'আলোচনা')} <span className="muted">{digits(s.lang, comments.length)}</span></h2></div>
      <div className="disc-input">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder={s.tt('Ask or share something', 'প্রশ্ন করুন বা লিখুন')} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} enterKeyHint="send" />
        <button className="send-btn tap" disabled={!text.trim()} onClick={send} aria-label={s.t('send')}><Send size={18} /></button>
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
            </div>
          );
        })}
        {!comments.length && <Empty icon={<MessageCircle size={26} />} title={s.tt('Be the first to ask', 'প্রথম প্রশ্নটি করুন')} />}
      </div>
    </>
  );
}
