import React, { useEffect, useLayoutEffect, useState } from 'react';
import { BatteryFull, Compass, GraduationCap, House, Plus, SignalHigh, WifiHigh, RotateCcw, LayoutDashboard, CheckCircle2, Clapperboard, Target, FlaskConical } from 'lucide-react';
import { useStore, isImmersive, type Screen, type Tab } from './store';
import { ActiveCtx, Avatar, LogoMark, Wordmark } from './ui';
import { HomeScreen, CommentsSheet, ShareSheet, MoreSheet, ReportSheet } from './screens/home';
import { ExploreScreen, SearchAllScreen } from './screens/explore';
import { LearnScreen, CourseDetail, LessonViewer, PracticeScreen, PracticeTopic, QuizScreen, QuizResult } from './screens/learn';
import {
  ProfileScreen, CreatorScreen, CreatorMoreSheet, FollowListScreen, SavedScreen, ProgressScreen, EditProfileScreen, SettingsScreen,
  LanguageSettings, AccountSettings, NotifSettings, PrivacySettings, ReportProblem, BlockList, DeleteAccount, DMScreen,
} from './screens/profile';
import { CreateSheet, CreateReel, CreatePhoto, CreateNote, CreateCourse, CreateResearch, PublishedScreen } from './screens/create';
import { ActivityScreen, NoteReader, PaperDetail, PostDetail, ReelPlayer, SignIn } from './screens/misc';
import { Admin } from './admin';
import { ResearchHome, PaperCardScreen, FigureReader, PrereqScreen, ReviewsScreen, PathScreen, ClubsScreen, ClubScreen, NoteSheet } from './screens/research';
import { ToolSetup, JobScreen, OutputScreen, LimitSheet, PausedSheet, PremiumScreen, CheckoutSheet, PaySuccess, SubscriptionScreen } from './screens/tools';
import { PX } from './research/data';
import { SimpleResearchHome, SimplePaper } from './screens/research-v2';
import { FullResearchHome, FullPaper, PaperPart, ResearchSection } from './screens/research-v3';
import type { NavMode } from './store';

function renderScreen(sc: Screen, mode: NavMode) {
  const p = sc.params as any;
  switch (sc.name) {
    case 'activity': return <ActivityScreen />;
    case 'note': return <NoteReader id={p.id} />;
    case 'paper':
      if (!PX[p.id]) return <PaperDetail id={p.id} />;
      if (mode === 'v2') return <SimplePaper id={p.id} />;
      if (mode === 'v3') return <FullPaper id={p.id} />;
      return <PaperCardScreen id={p.id} tab={p.tab} />;
    case 'rPapers': case 'rPaths': case 'rTools': case 'rLibrary': case 'rResults': return <ResearchSection name={sc.name} />;
    case 'pFigures': case 'pRelated': case 'pDiscuss': return <PaperPart name={sc.name} id={p.id} />;
    case 'explore': return <ExploreScreen pushed />;
    case 'researchHub': return <ResearchHome pushed />;
    case 'figures': return <FigureReader key={sc.key} id={p.id} i={p.i} />;
    case 'prereqs': return <PrereqScreen id={p.id} />;
    case 'reviews': return <ReviewsScreen id={p.id} />;
    case 'path': return <PathScreen id={p.id} />;
    case 'clubs': return <ClubsScreen />;
    case 'club': return <ClubScreen id={p.id} />;
    case 'tool': return <ToolSetup key={sc.key} tool={p.tool} paper={p.paper} papers={p.papers} />;
    case 'job': return <JobScreen key={sc.key} tool={p.tool} params={p.params} outId={p.outId} />;
    case 'output': return <OutputScreen id={p.id} />;
    case 'premium': return <PremiumScreen from={p.from} />;
    case 'paySuccess': return <PaySuccess from={p.from} />;
    case 'subscription': return <SubscriptionScreen />;
    case 'post': return <PostDetail id={p.id} />;
    case 'reel': return <ReelPlayer id={p.id} />;
    case 'creator': return <CreatorScreen id={p.id} />;
    case 'searchAll': return <SearchAllScreen q={p.q} type={p.type} topic={p.topic} />;
    case 'course': return <CourseDetail id={p.id} />;
    case 'lesson': return <LessonViewer course={p.course} lesson={p.lesson} />;
    case 'practice': return <PracticeScreen />;
    case 'practiceTopic': return <PracticeTopic topic={p.topic} />;
    case 'quiz': return <QuizScreen key={sc.key} id={p.id} />;
    case 'quizResult': return <QuizResult id={p.id} answers={p.answers} />;
    case 'followList': return <FollowListScreen id={p.id} type={p.type} />;
    case 'saved': return <SavedScreen />;
    case 'progress': return <ProgressScreen />;
    case 'editProfile': return <EditProfileScreen />;
    case 'settings': return <SettingsScreen />;
    case 'setLanguage': return <LanguageSettings />;
    case 'setAccount': return <AccountSettings />;
    case 'setNotif': return <NotifSettings />;
    case 'setPrivacy': return <PrivacySettings />;
    case 'setReport': return <ReportProblem />;
    case 'setBlock': return <BlockList />;
    case 'setDelete': return <DeleteAccount />;
    case 'dm': return <DMScreen id={p.id} />;
    case 'createReel': return <CreateReel />;
    case 'createPhoto': return <CreatePhoto />;
    case 'createNote': return <CreateNote />;
    case 'createCourse': return <CreateCourse />;
    case 'createResearch': return <CreateResearch />;
    case 'published': return <PublishedScreen kind={p.kind} />;
    default: return null;
  }
}

const ROOTS: Record<Tab, (mode: NavMode) => React.ReactElement> = {
  home: () => <HomeScreen />,
  explore: () => <ExploreScreen />,
  learn: () => <LearnScreen />,
  profile: () => <ProfileScreen />,
  practice: () => <PracticeScreen root />,
  research: (mode) => (mode === 'v2' ? <SimpleResearchHome /> : mode === 'v3' ? <FullResearchHome /> : <ResearchHome />),
};
const ALL_TABS: Tab[] = ['home', 'explore', 'learn', 'profile', 'practice', 'research'];

function TabLayer({ tab }: { tab: Tab }) {
  const s = useStore();
  const isTab = s.tab === tab;
  const stack = s.stacks[tab];
  const leaving = isTab ? s.leaving : null;
  const layers: { sc: Screen | null; key: string | number }[] = [{ sc: null, key: 'root' }, ...stack.map((sc) => ({ sc, key: sc.key }))];
  const topIdx = layers.length - 1;
  return (
    <div className="tab-layer" hidden={!isTab}>
      {layers.map((l, i) => {
        const top = i === topIdx && !leaving;
        const under = i < topIdx - 1;
        return (
          <ActiveCtx.Provider key={l.key} value={isTab && i === topIdx && !leaving}>
            <section className={`screen ${i > 0 ? 'pushed' : ''} ${under ? 'under' : ''}`} aria-hidden={!top && !(i === topIdx)}>
              {l.sc ? renderScreen(l.sc, s.navMode) : ROOTS[tab](s.navMode)}
            </section>
          </ActiveCtx.Provider>
        );
      })}
      {leaving && (
        <ActiveCtx.Provider value={false}>
          <section className="screen pushed leaving" aria-hidden="true">{renderScreen(leaving, s.navMode)}</section>
        </ActiveCtx.Provider>
      )}
    </div>
  );
}

function BottomNav() {
  const s = useStore();
  const v2 = s.tabNav;
  const items: { id: Tab | 'create'; icon: React.ReactNode; label: string }[] = v2 ? [
    { id: 'home', icon: <Clapperboard size={23} />, label: s.tt('Reels', 'রিল') },
    { id: 'learn', icon: <GraduationCap size={25} />, label: s.t('learn') },
    { id: 'practice', icon: <Target size={23} />, label: s.t('practice') },
    { id: 'research', icon: <FlaskConical size={23} />, label: s.t('research') },
    { id: 'profile', icon: <Avatar c={s.me} size={26} />, label: s.t('profile') },
  ] : [
    { id: 'home', icon: <House size={24} />, label: s.t('home') },
    { id: 'explore', icon: <Compass size={24} />, label: s.t('explore') },
    { id: 'create', icon: <Plus size={28} strokeWidth={2.6} />, label: s.t('create') },
    { id: 'learn', icon: <GraduationCap size={25} />, label: s.t('learn') },
    { id: 'profile', icon: <Avatar c={s.me} size={26} />, label: s.t('profile') },
  ];
  return (
    <nav className="bottom-nav" aria-label="Main">
      {items.map((it) =>
        it.id === 'create' ? (
          <button key="create" className="nav-create" onClick={() => s.setSheet({ name: 'create' })} aria-label={it.label}>
            <span className="nav-create-btn">{it.icon}</span>
            <span className="nav-label">{it.label}</span>
          </button>
        ) : (
          <button key={it.id} className={`nav-item ${s.tab === it.id ? 'on' : ''} ${it.id === 'profile' ? 'profile' : ''}`} onClick={() => s.setTab(it.id as Tab)} aria-current={s.tab === it.id ? 'page' : undefined}>
            <span className="nav-icon">{it.icon}</span>
            <span className="nav-label">{it.label}</span>
            <span className="nav-dot" aria-hidden="true" />
          </button>
        ),
      )}
    </nav>
  );
}

function Sheets() {
  const s = useStore();
  if (!s.sheet) return null;
  const id = s.sheet.params?.id;
  switch (s.sheet.name) {
    case 'create': return <CreateSheet />;
    case 'comments': return <CommentsSheet id={id} />;
    case 'share': return <ShareSheet />;
    case 'more': return <MoreSheet id={id} />;
    case 'report': return <ReportSheet />;
    case 'creatorMore': return <CreatorMoreSheet id={id} />;
    case 'note': return <NoteSheet id={id} />;
    case 'limit': return <LimitSheet tool={s.sheet.params!.tool} />;
    case 'paused': return <PausedSheet />;
    case 'checkout': return <CheckoutSheet from={s.sheet.params?.from} />;
    default: return null;
  }
}

function DialogLayer() {
  const s = useStore();
  if (!s.dialog) return null;
  const d = s.dialog;
  return (
    <div className="dialog-layer">
      <div className="scrim" onClick={() => s.setDialog(null)} />
      <div className="dialog" role="alertdialog" aria-modal="true" aria-label={d.title}>
        <h2>{d.title}</h2>
        <div className="dialog-actions">
          <button className="btn btn-secondary btn-md tap" onClick={() => s.setDialog(null)}>{s.t('cancel')}</button>
          <button className={`btn btn-${d.danger ? 'danger' : 'primary'} btn-md tap`} onClick={() => { s.setDialog(null); d.onConfirm(); }}>{d.confirm}</button>
        </div>
      </div>
    </div>
  );
}

function Toast() {
  const s = useStore();
  if (!s.toastMsg) return null;
  return <div className="toast" role="status" key={s.toastMsg.id}><CheckCircle2 size={18} /> {s.toastMsg.msg}</div>;
}

function StatusBar() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 15000); return () => clearInterval(id); }, []);
  return (
    <div className="status-bar" aria-hidden="true">
      <span>{now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false })}</span>
      <span className="punch" />
      <span className="sb-icons"><WifiHigh size={15} /><SignalHigh size={15} /><BatteryFull size={17} /></span>
    </div>
  );
}

function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => { const id = setTimeout(onDone, 1300); return () => clearTimeout(id); }, [onDone]);
  return (
    <div className="splash">
      <div className="splash-logo">
        <LogoMark size={88} className="splash-mark" />
        <Wordmark size={48} />
      </div>
    </div>
  );
}

function PhoneApp() {
  const s = useStore();
  const [splash, setSplash] = useState(() => { const q = new URLSearchParams(location.search); return !q.has('jump') && !q.has('screen'); });
  const cur = s.current;
  const showNav = !isImmersive(cur?.name) && !(s.leaving && isImmersive(s.leaving.name) && !cur);
  const darkTop = cur?.name === 'reel' || (cur?.name === 'createReel');
  const inkTop = cur?.name === 'job';
  return (
    <div className={`app ${darkTop ? 'dark-top' : ''} ${inkTop ? 'ink-top' : ''}`}>
      <StatusBar />
      <div className="app-body">
        {splash ? <Splash onDone={() => setSplash(false)} /> : !s.authed ? <SignIn /> : (
          <>
            <div className="tabs">
              {ALL_TABS.map((t) => <TabLayer key={t} tab={t} />)}
            </div>
            {showNav && <BottomNav />}
            <Sheets />
          </>
        )}
        <DialogLayer />
        <Toast />
      </div>
      <div className="gesture-bar" aria-hidden="true"><span /></div>
    </div>
  );
}

function useJumps() {
  const s = useStore();
  const v2 = s.tabNav;
  const rs = (seg: 'discover' | 'tools' | 'library', screens: [string, Record<string, any>?][] = []) => {
    s.setResearchSeg(seg);
    if (v2) s.jump('research', screens);
    else { s.setExploreSeg('research'); s.jump('explore', [['researchHub'], ...screens]); }
  };
  const app: [string, () => void][] = [
    ['Home feed', () => s.jump('home')],
    ['Reel player', () => s.jump('home', [['reel', { id: 'r1' }]])],
    ['Note reader', () => s.jump('home', [['note', { id: 'n2' }]])],
    ['Activity', () => s.jump('home', [['activity']])],
    ['Explore', () => (v2 ? s.jump('home', [['explore']]) : s.jump('explore'))],
    ['Create menu', () => { s.jump('home'); setTimeout(() => s.setSheet({ name: 'create' }), 50); }],
    ['Learn', () => s.jump('learn')],
    ['Course', () => s.jump('learn', [['course', { id: 'c1' }]])],
    ['Practice', () => (v2 ? s.jump('practice') : s.jump('learn', [['practice']]))],
    ['Profile', () => s.jump('profile')],
    ['Creator profile', () => s.jump('home', [['creator', { id: 'farhana' }]])],
    ['Settings', () => s.jump('profile', [['settings']])],
    ['Sign in', () => { s.jump('home'); setTimeout(() => s.setAuthed(false), 30); }],
  ];
  const v2Research: [string, () => void][] = [
    ['Research home', () => s.jump('research')],
    ['Paper', () => s.jump('research', [['paper', { id: 'p5' }]])],
    ['Learn first', () => s.jump('research', [['paper', { id: 'p1' }]])],
    ['Compare papers', () => s.jump('research', [['paper', { id: 'p5' }], ['tool', { tool: 'compare', papers: ['p5', 'p12', 'p13'] }]])],
    ['Limit reached', () => { s.jump('research', [['paper', { id: 'p5' }]]); setTimeout(() => s.setSheet({ name: 'limit', params: { tool: 'compare' } }), 60); }],
    ['Premium plans', () => s.jump('research', [['premium', { from: 'compare' }]])],
  ];
  const v3Research: [string, () => void][] = [
    ['Research home', () => s.jump('research')],
    ['Papers', () => s.jump('research', [['rPapers']])],
    ['Paper', () => s.jump('research', [['paper', { id: 'p5' }]])],
    ['Figures', () => s.jump('research', [['paper', { id: 'p1' }], ['pFigures', { id: 'p1' }]])],
    ['Figure reader', () => s.jump('research', [['paper', { id: 'p1' }], ['figures', { id: 'p1', i: 0 }]])],
    ['Learn before reading', () => s.jump('research', [['paper', { id: 'p1' }], ['prereqs', { id: 'p1' }]])],
    ['Related papers', () => s.jump('research', [['paper', { id: 'p1' }], ['pRelated', { id: 'p1' }]])],
    ['Reviews', () => s.jump('research', [['paper', { id: 'p5' }], ['reviews', { id: 'p5' }]])],
    ['Discussion', () => s.jump('research', [['paper', { id: 'p5' }], ['pDiscuss', { id: 'p5' }]])],
    ['Reading paths', () => s.jump('research', [['rPaths']])],
    ['Reading path', () => s.jump('research', [['rPaths'], ['path', { id: 'path2' }]])],
    ['Paper clubs', () => s.jump('research', [['clubs']])],
    ['Paper club', () => s.jump('research', [['clubs'], ['club', { id: 'club1' }]])],
    ['My library', () => s.jump('research', [['rLibrary']])],
    ['AI tools', () => s.jump('research', [['rTools']])],
    ['Landscape map', () => s.jump('research', [['rTools'], ['tool', { tool: 'landscape' }]])],
    ['Compare papers', () => s.jump('research', [['rTools'], ['tool', { tool: 'compare', papers: ['p5', 'p12', 'p13'] }]])],
    ['Claim check', () => s.jump('research', [['rTools'], ['tool', { tool: 'claim', paper: 'p5' }]])],
    ['Roadmap', () => s.jump('research', [['rTools'], ['tool', { tool: 'roadmap', paper: 'p5' }]])],
    ['Saved results', () => s.jump('research', [['rResults']])],
    ['Premium plans', () => s.jump('research', [['premium', { from: 'compare' }]])],
    ['Subscription', () => s.jump('profile', [['settings'], ['subscription']])],
  ];
  const classicResearch: [string, () => void][] = [
    ['Research home', () => rs('discover')],
    ['Paper Card', () => rs('discover', [['paper', { id: 'p5' }]])],
    ['Figure reader', () => rs('discover', [['paper', { id: 'p1', tab: 'figures' }], ['figures', { id: 'p1', i: 0 }]])],
    ['Learn before reading', () => rs('discover', [['paper', { id: 'p1' }], ['prereqs', { id: 'p1' }]])],
    ['Reading tracker', () => rs('library')],
    ['Related papers', () => rs('discover', [['paper', { id: 'p1', tab: 'related' }]])],
    ['Reading path', () => rs('discover', [['path', { id: 'path2' }]])],
    ['Reviews', () => rs('discover', [['paper', { id: 'p5', tab: 'discuss' }], ['reviews', { id: 'p5' }]])],
    ['Paper club', () => rs('discover', [['clubs'], ['club', { id: 'club1' }]])],
    ['Research tools', () => rs('tools')],
    ['Landscape map', () => rs('tools', [['tool', { tool: 'landscape' }]])],
    ['Compare papers', () => rs('tools', [['tool', { tool: 'compare', papers: ['p5', 'p12', 'p13'] }]])],
    ['Claim check', () => rs('tools', [['tool', { tool: 'claim', paper: 'p5' }]])],
    ['Roadmap', () => rs('tools', [['tool', { tool: 'roadmap', paper: 'p5' }]])],
    ['Limit reached', () => { rs('tools'); setTimeout(() => s.setSheet({ name: 'limit', params: { tool: 'compare' } }), 60); }],
    ['Premium plans', () => rs('tools', [['premium', { from: 'compare' }]])],
    ['Subscription', () => s.jump('profile', [['settings'], ['subscription']])],
  ];
  const research = s.navMode === 'v2' ? v2Research : s.navMode === 'v3' ? v3Research : classicResearch;
  return { app, research };
}

const slug = (l: string) => l.toLowerCase().replace(/[^a-z0-9]+/g, '-');

/** ?jump=paper-card&plan=premium&nav=classic&lang=bn&paused=1 opens a specific screen. */
function useDeepLink() {
  const s = useStore();
  const jumps = useJumps();
  const latest = React.useRef(jumps);
  latest.current = jumps;
  const done = React.useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const q = new URLSearchParams(location.search);
    if (q.get('plan') === 'premium') s.setPlan('premium');
    const nav = q.get('nav');
    if (nav === 'classic' || nav === 'v2' || nav === 'v3') s.setNavMode(nav);
    if (q.get('lang') === 'bn' || q.get('lang') === 'en') s.setLang(q.get('lang') as 'en' | 'bn');
    if (q.get('paused') === '1') s.setAiPaused(true);
    const j = q.get('jump');
    if (j) setTimeout(() => [...latest.current.app, ...latest.current.research].find(([l]) => slug(l) === j)?.[1](), 80);
    const sc = q.get('screen');
    if (sc) {
      const params: Record<string, any> = {};
      q.forEach((v, k) => { if (!['screen', 'plan', 'nav', 'lang', 'paused', 'jump'].includes(k)) { try { params[k] = JSON.parse(v); } catch { params[k] = v; } } });
      setTimeout(() => s.jump(nav === 'classic' ? 'explore' : 'research', [[sc, params]]), 80);
    }
  }, []);
}

function DemoPanel() {
  const s = useStore();
  const d = s.demo;
  const set = (k: keyof typeof d, v: boolean) => s.setDemo({ ...d, [k]: v });
  const { app, research } = useJumps();
  const Q2 = <T extends string | boolean>({ title, value, options, onChange, tone }: { title: string; value: T; options: [string, T][]; onChange: (v: T) => void; tone?: string }) => (
    <div className="dq">
      <span className="dq-title">{title}</span>
      <div className={`dq-seg ${tone || ''}`}>
        {options.map(([l, v]) => <button key={l} className={value === v ? 'on' : ''} onClick={() => onChange(v)}>{l}</button>)}
      </div>
    </div>
  );
  const Q =({ title, k, a, b }: { title: string; k: keyof typeof d; a: [string, boolean]; b: [string, boolean] }) => (
    <div className="dq">
      <span className="dq-title">{title}</span>
      <div className="dq-seg">
        {[a, b].map(([l, v]) => <button key={l} className={d[k] === v ? 'on' : ''} onClick={() => set(k, v)}>{l}</button>)}
      </div>
    </div>
  );
  return (
    <aside className="demo-panel">
      <div className="dp-head">
        <Wordmark size={34} lang="en" />
        <span className="dp-sub">Clickable demo, Android. All data is simulated.</span>
      </div>
      <section className="dp-sim">
        <h3>Simulate a user</h3>
        <Q2 title="Plan" value={s.plan} tone="plan" options={[['Free user', 'free'], ['Premium user', 'premium']]} onChange={(v) => { s.setPlan(v); s.toast(v === 'premium' ? 'Now simulating a Premium user' : 'Now simulating a Free user'); }} />
        <Q2 title="Platform AI budget" value={s.aiPaused} options={[['Within budget', false], ['Budget reached', true]]} onChange={s.setAiPaused} />
        <Q2 title="Version" value={s.navMode} options={[['Explore', 'classic'], ['V2 Simple', 'v2'], ['V3 Full', 'v3']]} onChange={(v) => { s.setNavMode(v); s.jump(v === 'classic' ? 'home' : 'research'); }} />
        <button className="dp-btn ghost sm" onClick={() => { s.resetUsage(); s.toast('Monthly allowances reset'); }}><RotateCcw size={15} /> Reset monthly allowances</button>
      </section>
      <section>
        <h3>Research ({s.navMode === 'classic' ? 'current' : s.navMode.toUpperCase()})</h3>
        <div className="dp-jumps">{research.map(([l, f]) => <button key={l} onClick={f}>{l}</button>)}</div>
      </section>
      <section>
        <h3>App</h3>
        <div className="dp-jumps">{app.map(([l, f]) => <button key={l} onClick={f}>{l}</button>)}</div>
      </section>
      <section>
        <h3>Open questions</h3>
        <Q title="Moderation" k="preReview" a={['Pre-review', true]} b={['Publish instantly', false]} />
        <Q title="Course lessons" k="lockLessons" a={['Free browse', false]} b={['Locked in order', true]} />
        <Q title="Direct messages" k="dms" a={['Off', false]} b={['On', true]} />
        <Q title="Content language setting" k="langFilter" a={['Filters content', true]} b={['UI only', false]} />
      </section>
      <section className="dp-foot">
        <div className="dq-seg lang">
          <button className={s.lang === 'en' ? 'on' : ''} onClick={() => s.setLang('en')}>English</button>
          <button className={s.lang === 'bn' ? 'on' : ''} onClick={() => s.setLang('bn')}>বাংলা</button>
        </div>
        <button className="dp-btn" onClick={() => s.setAdmin(true)}><LayoutDashboard size={17} /> Admin dashboard</button>
        <button className="dp-btn ghost" onClick={s.resetDemo}><RotateCcw size={17} /> Reset demo</button>
      </section>
    </aside>
  );
}

function useFrameScale() {
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const f = () => setScale(Math.min(1, (window.innerHeight - 40) / 880));
    f();
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return scale;
}

export default function App() {
  const s = useStore();
  const scale = useFrameScale();
  useDeepLink();
  useEffect(() => { document.documentElement.lang = s.lang === 'bn' ? 'bn' : 'en'; }, [s.lang]);
  if (import.meta.env.DEV) (window as unknown as { __db: typeof s }).__db = s;
  if (s.admin) return <Admin />;
  return (
    <div className="stage">
      <div className="device-wrap" style={{ ['--scale' as string]: scale }}>
        <div className="device">
          <PhoneApp />
        </div>
      </div>
      <DemoPanel />
    </div>
  );
}
