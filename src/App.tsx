import React, { useEffect, useLayoutEffect, useState } from 'react';
import { BatteryFull, Compass, GraduationCap, House, Plus, SignalHigh, WifiHigh, RotateCcw, LayoutDashboard, CheckCircle2 } from 'lucide-react';
import { useStore, isImmersive, type Screen, type Tab } from './store';
import { ActiveCtx, Avatar, Wordmark } from './ui';
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

function renderScreen(sc: Screen) {
  const p = sc.params as any;
  switch (sc.name) {
    case 'activity': return <ActivityScreen />;
    case 'note': return <NoteReader id={p.id} />;
    case 'paper': return <PaperDetail id={p.id} />;
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

const ROOTS: Record<Tab, () => React.ReactElement> = {
  home: () => <HomeScreen />,
  explore: () => <ExploreScreen />,
  learn: () => <LearnScreen />,
  profile: () => <ProfileScreen />,
};

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
              {l.sc ? renderScreen(l.sc) : ROOTS[tab]()}
            </section>
          </ActiveCtx.Provider>
        );
      })}
      {leaving && (
        <ActiveCtx.Provider value={false}>
          <section className="screen pushed leaving" aria-hidden="true">{renderScreen(leaving)}</section>
        </ActiveCtx.Provider>
      )}
    </div>
  );
}

function BottomNav() {
  const s = useStore();
  const items: { id: Tab | 'create'; icon: React.ReactNode; label: string }[] = [
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
      <Wordmark size={34} />
    </div>
  );
}

function PhoneApp() {
  const s = useStore();
  const [splash, setSplash] = useState(true);
  const cur = s.current;
  const showNav = !isImmersive(cur?.name) && !(s.leaving && isImmersive(s.leaving.name) && !cur);
  const darkTop = cur?.name === 'reel' || (cur?.name === 'createReel');
  return (
    <div className={`app ${darkTop ? 'dark-top' : ''}`}>
      <StatusBar />
      <div className="app-body">
        {splash ? <Splash onDone={() => setSplash(false)} /> : !s.authed ? <SignIn /> : (
          <>
            <div className="tabs">
              {(['home', 'explore', 'learn', 'profile'] as Tab[]).map((t) => <TabLayer key={t} tab={t} />)}
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

function DemoPanel() {
  const s = useStore();
  const d = s.demo;
  const set = (k: keyof typeof d, v: boolean) => s.setDemo({ ...d, [k]: v });
  const jumps: [string, () => void][] = [
    ['Home feed', () => s.jump('home')],
    ['Reel player', () => s.jump('explore', [['reel', { id: 'r1' }]])],
    ['Note reader', () => s.jump('home', [['note', { id: 'n2' }]])],
    ['Activity', () => s.jump('home', [['activity']])],
    ['Explore', () => s.jump('explore')],
    ['Research', () => { s.setExploreSeg('research'); s.jump('explore'); }],
    ['Paper Byte', () => s.jump('explore', [['paper', { id: 'p1' }]])],
    ['Creators', () => { s.setExploreSeg('creators'); s.jump('explore'); }],
    ['Create menu', () => { s.jump('home'); setTimeout(() => s.setSheet({ name: 'create' }), 50); }],
    ['Learn', () => s.jump('learn')],
    ['Course', () => s.jump('learn', [['course', { id: 'c1' }]])],
    ['Practice quiz', () => s.jump('learn', [['practice'], ['quiz', { id: 'q-tf1' }]])],
    ['Profile', () => s.jump('profile')],
    ['Creator profile', () => s.jump('explore', [['creator', { id: 'farhana' }]])],
    ['Settings', () => s.jump('profile', [['settings']])],
    ['Sign in', () => { s.jump('home'); setTimeout(() => s.setAuthed(false), 30); }],
  ];
  const Q = ({ title, k, a, b }: { title: string; k: keyof typeof d; a: [string, boolean]; b: [string, boolean] }) => (
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
        <span className="wordmark" style={{ fontSize: 22 }}>doshomik<span className="wm-dot" /><span className="wm-bytes">bytes</span></span>
        <span className="dp-sub">Clickable demo, Android</span>
      </div>
      <section>
        <h3>Jump to</h3>
        <div className="dp-jumps">{jumps.map(([l, f]) => <button key={l} onClick={f}>{l}</button>)}</div>
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
