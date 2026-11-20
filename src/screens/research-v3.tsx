/* Research V3: every feature, laid out so each one is visible and one tap away. */
import React, { useMemo, useState } from 'react';
import {
  ArrowRight, BookOpenCheck, Bookmark, ClipboardCheck, Clock, Quote, ExternalLink, FileText, FolderOpen, GraduationCap,
  Images, MessageCircle, Network, Route, Search, Share2, Sparkles, Users, X,
} from 'lucide-react';
import { COLLECTION, PX } from '../research/data';
import { CLUBS, PATHS } from '../research/content';
import { useStore, findPaper } from '../store';
import { compact, digits } from '../i18n';
import { Empty, Header, Level, TopBar, TopicTag } from '../ui';
import {
  CardTab, ContinueCard, Discover, DiscussTab, FiguresTab, GoDeeper, Library, PaperItem, PathCard, ReadSteps, RelatedTab, ToolsHub, prereqDone,
} from './research';
import { OutputRow } from './tools';
import { ReadMapCard } from './research-v2';

const dayNum = (w: string) => parseInt(w.replace(/\D/g, ''), 10) || 0;

function FeatureTile({ icon, label, hint, badge, hue, onClick, disabled }: {
  icon: React.ReactNode; label: string; hint: string; badge?: React.ReactNode; hue: number; onClick?: () => void; disabled?: boolean;
}) {
  return (
    <button className={`feature-tile tap ${disabled ? 'off' : ''}`} style={{ ['--h' as string]: hue }} onClick={onClick} disabled={disabled}>
      <span className="ft-top"><span className="ft-icon">{icon}</span>{badge != null && <span className="ft-badge">{badge}</span>}</span>
      <span className="ft-label">{label}</span>
      <span className="ft-hint">{hint}</span>
    </button>
  );
}

/* ---------------- Home ---------------- */

export function FullResearchHome() {
  const s = useStore();
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return [];
    return COLLECTION.filter((id) => {
      const p = findPaper(s, id)!;
      const x = PX[id];
      return [p.title, p.authors, p.source, x.question.en, x.question.bn, ...x.glossary.map((g) => g.term)].some((f) => f.toLowerCase().includes(n));
    });
  }, [q, s.lang]);
  const cont = Object.entries(s.reading).filter(([, r]) => r.step === 1 || r.step === 2).sort((a, b) => dayNum(b[1].when) - dayNum(a[1].when))[0];
  const tracked = Object.values(s.reading).filter((r) => r.step > 0).length;
  const trending = [...COLLECTION].sort((a, b) => (PX[a].trend ?? 99) - (PX[b].trend ?? 99)).slice(0, 3);
  const toolsLeft = (['landscape', 'compare', 'claim', 'roadmap'] as const).reduce((a, t) => a + s.left(t), 0);

  return (
    <div className="screen-col">
      <TopBar noSearch />
      <div className="search-wrap">
        <label className="search">
          <Search size={19} aria-hidden="true" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={s.tt('Search papers, authors, terms', 'পেপার, লেখক, শব্দ খুঁজুন')} aria-label={s.tt('Search papers', 'পেপার খুঁজুন')} enterKeyHint="search" />
          {q && <button className="icon-btn sm tap" onClick={() => setQ('')} aria-label={s.t('clear')}><X size={16} /></button>}
        </label>
      </div>
      {q.trim() ? (
        <div className="scroll pad">
          {results.length ? <div className="list">{results.map((id) => <PaperItem key={id} id={id} />)}</div> : (
            <Empty icon={<Search size={28} />} title={s.tt('No papers found', 'কোনো পেপার নেই')} action={<p className="empty-sub">{s.tt('Try “LoRA” or “attention”.', '“LoRA” বা “attention” লিখে দেখুন।')}</p>} />
          )}
        </div>
      ) : (
        <div className="scroll">
          {!s.howSeen && (
            <div className="how-strip">
              <ol>
                <li><b>1</b>{s.tt('Find', 'খুঁজুন')}</li>
                <li><b>2</b>{s.tt('Understand', 'বুঝুন')}</li>
                <li><b>3</b>{s.tt('Track', 'ট্র্যাক')}</li>
              </ol>
              <button className="icon-btn sm tap" onClick={() => s.setHowSeen(true)} aria-label={s.t('close')}><X size={16} /></button>
            </div>
          )}
          {cont && <ContinueCard id={cont[0]} />}
          <div className="feature-grid pad-x">
            <FeatureTile hue={172} icon={<FileText size={22} />} label={s.tt('Papers', 'পেপার')} hint={s.tt('Browse and sort', 'দেখুন ও সাজান')} badge={digits(s.lang, COLLECTION.length)} onClick={() => s.push('rPapers')} />
            <FeatureTile hue={330} icon={<Route size={22} />} label={s.tt('Reading paths', 'রিডিং পাথ')} hint={s.tt('Papers in order', 'ক্রমানুসারে পেপার')} badge={digits(s.lang, PATHS.length)} onClick={() => s.push('rPaths')} />
            <FeatureTile hue={24} icon={<Users size={22} />} label={s.tt('Paper clubs', 'পেপার ক্লাব')} hint={s.tt('Read together', 'একসাথে পড়ুন')} badge={digits(s.lang, CLUBS.length)} onClick={() => s.push('clubs')} />
            <FeatureTile hue={42} icon={<Sparkles size={22} />} label={s.tt('AI tools', 'এআই টুলস')} hint={s.tt('Reading map and more', 'রিডিং ম্যাপ ও আরও')} badge={s.tt(`${toolsLeft} left`, `${digits('bn', toolsLeft)} বাকি`)} onClick={() => s.push('rTools')} />
            <FeatureTile hue={210} icon={<BookOpenCheck size={22} />} label={s.tt('My library', 'আমার লাইব্রেরি')} hint={s.tt('Progress and notes', 'অগ্রগতি ও নোট')} badge={digits(s.lang, tracked)} onClick={() => s.push('rLibrary')} />
            <FeatureTile hue={140} icon={<FolderOpen size={22} />} label={s.tt('Saved results', 'সেভ করা ফল')} hint={s.tt('Your AI outputs', 'আপনার এআই আউটপুট')} badge={digits(s.lang, s.outputs.length)} onClick={() => s.push('rResults')} />
          </div>
          <div className="sec-head pad-x">
            <h2>{s.tt('Trending now', 'এখন ট্রেন্ডিং')}</h2>
            <button className="link-btn tap" onClick={() => s.push('rPapers')}>{s.tt('See all', 'সব দেখুন')} <ArrowRight size={15} /></button>
          </div>
          <div className="list pad-x">{trending.map((id) => <PaperItem key={id} id={id} />)}</div>
          <div className="bottom-space" />
        </div>
      )}
    </div>
  );
}

/* ---------------- Section screens ---------------- */

export function ResearchSection({ name }: { name: string }) {
  const s = useStore();
  const title = {
    rPapers: s.tt('Papers', 'পেপার'),
    rPaths: s.tt('Reading paths', 'রিডিং পাথ'),
    rTools: s.tt('AI tools', 'এআই টুলস'),
    rLibrary: s.tt('My library', 'আমার লাইব্রেরি'),
    rResults: s.tt('Saved results', 'সেভ করা ফল'),
  }[name];
  return (
    <div className="screen-col">
      <Header title={title} />
      <div className="scroll">
        {name === 'rPapers' && <Discover plain />}
        {name === 'rPaths' && (
          <div className="pad v3-paths">
            <p className="v3-lede">{s.tt('Short lists of papers, in the right order.', 'সঠিক ক্রমে সাজানো পেপারের ছোট তালিকা।')}</p>
            <div className="v3-mapcard"><ReadMapCard /></div>
            <div className="list">{PATHS.map((p) => <PathCard key={p.id} id={p.id} />)}</div>
          </div>
        )}
        {name === 'rTools' && <ToolsHub />}
        {name === 'rLibrary' && <Library onFind={() => s.replace('rPapers')} />}
        {name === 'rResults' && (
          <div className="pad">
            {s.outputs.length ? <div className="out-list">{s.outputs.map((o) => <OutputRow key={o.id} o={o} />)}</div> : (
              <Empty icon={<FolderOpen size={28} />} title={s.tt('No results yet', 'এখনো কোনো ফল নেই')} />
            )}
            <button className="link-btn tap center mt16" onClick={() => s.replace('rTools')}><Sparkles size={15} /> {s.tt('Open AI tools', 'এআই টুলস খুলুন')}</button>
          </div>
        )}
        <div className="bottom-space" />
      </div>
    </div>
  );
}

/* ---------------- Paper ---------------- */

export function FullPaper({ id }: { id: string }) {
  const s = useStore();
  const p = findPaper(s, id)!;
  const x = PX[id];
  const saved = s.saves.has(id);
  const figs = x.license.reuse ? x.figures.length : 0;
  const ready = x.prereqs.filter((pr) => prereqDone(s, pr)).length;
  const related = [...x.buildsOn, ...x.builtBy].filter((r) => findPaper(s, r)).length;
  const comments = (s.extraComments[`paper:${id}`]?.length || 0) + x.discussion.length;
  const club = CLUBS.find((c) => c.papers.includes(id));
  return (
    <div className="screen-col">
      <Header
        title={s.tt('Paper', 'পেপার')}
        right={<>
          <button className={`icon-btn tap save ${saved ? 'on' : ''}`} onClick={() => s.toggleSave(id)} aria-label={s.t('save')} aria-pressed={saved}><Bookmark size={21} fill={saved ? 'currentColor' : 'none'} /></button>
          <button className="icon-btn tap" onClick={() => s.setSheet({ name: 'share', params: { id } })} aria-label={s.t('share')}><Share2 size={21} /></button>
        </>}
      />
      <div className="scroll">
        <div className="pad pc-head">
          <div className="pc-tags"><TopicTag id={p.topic} /><Level level={x.difficulty} /></div>
          <h1 className="pd-title">{p.title}</h1>
          <div className="pd-src">{p.authors}, {p.source}</div>
          <div className="pc-meta">
            <span><Quote size={14} /> {compact(s.lang, x.citations)} {s.tt('citations', 'সাইটেশন')}</span>
            <span><Clock size={14} /> {digits(s.lang, p.readMin)} {s.t('min')}</span>
          </div>
          <ReadSteps id={id} />
        </div>

        <div className="pad-x">
          <div className="sec-head" style={{ marginTop: 0 }}><h3>{s.tt('On this paper', 'এই পেপারে')}</h3></div>
          <div className="feature-grid three">
            <FeatureTile hue={172} icon={<Images size={20} />} label={s.tt('Figures', 'ফিগার')} hint={figs ? s.tt('Guess, then learn', 'অনুমান, তারপর শিখুন') : s.tt('On arXiv only', 'শুধু arXiv-এ')} badge={figs ? digits(s.lang, figs) : undefined} onClick={() => s.push('pFigures', { id })} />
            <FeatureTile hue={210} icon={<GraduationCap size={20} />} label={s.tt('Learn first', 'আগে শিখুন')} hint={x.prereqs.length ? s.tt('Lessons to prep', 'প্রস্তুতির লেসন') : s.tt('None needed', 'দরকার নেই')} badge={x.prereqs.length ? `${digits(s.lang, ready)}/${digits(s.lang, x.prereqs.length)}` : undefined} disabled={!x.prereqs.length} onClick={() => s.push('prereqs', { id })} />
            <FeatureTile hue={140} icon={<Network size={20} />} label={s.tt('Related', 'সম্পর্কিত')} hint={s.tt('Before and after', 'আগে ও পরে')} badge={related ? digits(s.lang, related) : undefined} onClick={() => s.push('pRelated', { id })} />
            <FeatureTile hue={36} icon={<ClipboardCheck size={20} />} label={s.tt('Reviews', 'রিভিউ')} hint={x.review ? s.tt('Expert views', 'বিশেষজ্ঞ মত') : s.tt('None public', 'পাবলিক নেই')} badge={x.review ? digits(s.lang, x.review.reviews.length) : undefined} disabled={!x.review} onClick={() => s.push('reviews', { id })} />
            <FeatureTile hue={330} icon={<MessageCircle size={20} />} label={s.tt('Discuss', 'আলোচনা')} hint={s.tt('Ask and answer', 'প্রশ্ন ও উত্তর')} badge={digits(s.lang, comments)} onClick={() => s.push('pDiscuss', { id })} />
            <FeatureTile hue={24} icon={<Users size={20} />} label={s.tt('Club', 'ক্লাব')} hint={club ? s.tt('Read together', 'একসাথে পড়ুন') : s.tt('No club yet', 'ক্লাব নেই')} disabled={!club} onClick={() => club && s.push('club', { id: club.id })} />
          </div>
        </div>

        <div className="pad">
          <div className="sec-head" style={{ marginTop: 0 }}><h3>{s.tt('Summary', 'সারাংশ')}</h3></div>
          <CardTab id={id} noTools />
          <GoDeeper id={id} />
        </div>
        <div className="bottom-space" />
      </div>
      <div className="bottom-bar">
        <button className="btn btn-dark btn-lg block tap" onClick={() => { s.toast(s.t('openingLink')); window.open(p.url, '_blank', 'noopener'); }}><ExternalLink size={18} /> {s.t('readOriginal')}</button>
      </div>
    </div>
  );
}

/** Figures / Related / Discuss, each as its own screen with the paper named in the header. */
export function PaperPart({ name, id }: { name: 'pFigures' | 'pRelated' | 'pDiscuss'; id: string }) {
  const s = useStore();
  const p = findPaper(s, id)!;
  const title = { pFigures: s.tt('Figures', 'ফিগার'), pRelated: s.tt('Related papers', 'সম্পর্কিত পেপার'), pDiscuss: s.tt('Discussion', 'আলোচনা') }[name];
  return (
    <div className="screen-col">
      <Header title={<span className="header-stack"><small>{p.title}</small>{title}</span>} />
      <div className="scroll pad">
        {name === 'pFigures' && <FiguresTab id={id} />}
        {name === 'pRelated' && <RelatedTab id={id} />}
        {name === 'pDiscuss' && <DiscussTab id={id} />}
        <div className="bottom-space" />
      </div>
    </div>
  );
}

