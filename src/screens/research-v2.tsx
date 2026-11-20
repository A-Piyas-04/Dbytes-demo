/* Research V2: the simple version. Few features, short words, nothing nested. */
import React, { useMemo, useState } from 'react';
import { ArrowRight, Bookmark, Check, CheckCircle2, ChevronRight, CircleHelp, Clock, Columns3, ExternalLink, FileText, GraduationCap, Lightbulb, Search, Target, TriangleAlert, X } from 'lucide-react';
import type { TopicId } from '../data';
import type { L } from '../research/data';
import { COLLECTION, PX } from '../research/data';
import { useStore, findPaper } from '../store';
import { digits } from '../i18n';
import { Btn, Empty, Header, Level, Seg, TopBar, TopicChips } from '../ui';
import { openPrereq, prereqDone } from './research';

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
      <div className="explore-chips" style={{ paddingTop: 4 }}><TopicChips value={topic} onChange={setTopic} /></div>
      <div className="list pad">
        {ids.map((id) => <SimpleRow key={id} id={id} />)}
        {!ids.length && <Empty icon={<FileText size={28} />} title={s.tt('No papers here yet', 'এখানে এখনো পেপার নেই')} />}
      </div>
    </>
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
  if (!saved.length && !read.length) {
    return <Empty icon={<Bookmark size={28} />} title={s.tt('Nothing saved yet', 'এখনো কিছু সেভ নেই')} action={<Btn onClick={onFind}>{s.tt('Find a paper', 'পেপার খুঁজুন')}</Btn>} />;
  }
  return (
    <div className="pad">
      <div className="sec-head" style={{ marginTop: 0 }}><h2><Bookmark size={18} /> {s.tt('Saved', 'সেভ করা')} <span className="muted">{digits(s.lang, saved.length)}</span></h2></div>
      {saved.length ? <div className="list">{saved.map((id) => <SimpleRow key={id} id={id} />)}</div> : <p className="fine">{s.tt('Tap the bookmark to save.', 'সেভ করতে বুকমার্কে চাপুন।')}</p>}
      <div className="sec-head"><h2><CheckCircle2 size={18} /> {s.tt('Read', 'পড়া শেষ')} <span className="muted">{digits(s.lang, read.length)}</span></h2></div>
      {read.length ? <div className="list">{read.map((id) => <SimpleRow key={id} id={id} />)}</div> : <p className="fine">{s.tt('Papers you finish show here.', 'শেষ করা পেপার এখানে দেখাবে।')}</p>}
    </div>
  );
}

/* ---------------- Paper ---------------- */

export function SimplePaper({ id }: { id: string }) {
  const s = useStore();
  const p = findPaper(s, id)!;
  const x = PX[id];
  const [cl, setCl] = useState(s.lang);
  const v = (l: L | string) => (typeof l === 'string' ? l : l[cl]);
  const saved = s.saves.has(id);
  const read = isRead(s, id);
  const prereqs = x.prereqs.slice(0, 3);
  const related = [...x.builtBy, ...x.buildsOn].filter((r) => PX[r]).slice(0, 2);
  const premium = s.plan === 'premium';
  return (
    <div className="screen-col">
      <Header title={s.tt('Paper', 'পেপার')} />
      <div className="scroll">
        <div className="pad v2-paper">
          <div className="pc-tags"><Level level={x.difficulty} /><span className="v2-meta"><Clock size={14} /> {digits(s.lang, p.readMin)} {s.t('min')}</span></div>
          <h1 className="pd-title">{p.title}</h1>
          <div className="pd-src">{p.authors}, {p.year}</div>

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

          {related.length > 0 && (
            <button className="v2-pro tap" onClick={() => s.push('tool', { tool: 'compare', papers: [id, ...related] })}>
              <span className="v2-pro-icon"><Columns3 size={20} /></span>
              <span className="set-label">{s.tt('Compare with similar papers', 'মিলিয়ে দেখুন')}<small>{premium ? s.tt(`${s.left('compare')} left this month`, `এ মাসে ${digits('bn', s.left('compare'))}টি বাকি`) : s.left('compare') ? s.tt('1 free try', '১টি ফ্রি ট্রায়াল') : s.tt('Premium feature', 'প্রিমিয়াম ফিচার')}</small></span>
              <span className="pro-badge sm"><i />Pro</span>
            </button>
          )}
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
