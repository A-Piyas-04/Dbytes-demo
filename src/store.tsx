import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ACTIVITY, COURSES, CREATORS, ME, MY_PAPERS_SEED, MY_POSTS_SEED, allBasePosts, PAPERS,
  type Comment, type ContentLang, type Course, type Creator, type Lang, type Paper, type Post, type TopicId,
} from './data';
import { tr, tx, type Key } from './i18n';
import { NEW_PAPERS, LIMITS, type Plan, type ToolId } from './research/data';

export type NavMode = 'classic' | 'v2' | 'v3';
export interface ReadState { step: 0 | 1 | 2 | 3; note: string; when: string }
export interface Output { id: string; tool: ToolId; when: string; plan: Plan; params: Record<string, any>; cached?: boolean }
const seedUsage = (): Record<Plan, Record<ToolId, number>> => ({
  free: { readmap: 0, landscape: 0, compare: 1, claim: 0, roadmap: 0 },
  premium: { readmap: 1, landscape: 1, compare: 2, claim: 3, roadmap: 0 },
});
const seedReading = (): Record<string, ReadState> => ({
  p5: { step: 2, note: 'Rank 8 on q, v is enough. Try on RoBERTa-base in Colab.', when: 'Nov 18' },
  p1: { step: 1, note: '', when: 'Nov 15' },
  p9: { step: 1, note: '', when: 'Nov 19' },
  p2: { step: 3, note: 'Reproduced the GSM8K prompt trick with a small open model. Gains were tiny, as the paper predicts.', when: 'Nov 9' },
});
const seedOutputs = (): Output[] => [
  { id: 'o1', tool: 'compare', when: 'Nov 8', plan: 'free', params: { papers: ['p5', 'p12', 'p13'] } },
];

export type Tab = 'home' | 'explore' | 'learn' | 'profile' | 'practice' | 'research';
export interface Screen { key: number; name: string; params: Record<string, any> }
export interface Sheet { name: string; params?: Record<string, any> }
export interface Dialog {
  title: string;
  confirm: string;
  danger?: boolean;
  onConfirm: () => void;
}
export interface QuizRecord { setId: string; score: number; total: number; when: string }

export interface DemoFlags {
  preReview: boolean;
  lockLessons: boolean;
  dms: boolean;
  langFilter: boolean;
}

const IMMERSIVE = new Set([
  'reel', 'quiz', 'quizResult', 'lesson', 'dm',
  'createReel', 'createPhoto', 'createNote', 'createCourse', 'createResearch', 'published',
  'figures', 'tool', 'job', 'premium', 'paySuccess',
]);
export const isImmersive = (name?: string) => !!name && IMMERSIVE.has(name);

let keySeq = 1;
const mkScreen = (name: string, params: Record<string, any> = {}): Screen => ({ key: keySeq++, name, params });
const emptyStacks = (): Record<Tab, Screen[]> => ({ home: [], explore: [], learn: [], profile: [], practice: [], research: [] });

const seedDone = (): Record<string, string[]> => ({
  c1: COURSES[0].lessons.slice(0, 6).map((l) => l.id),
  c3: COURSES[2].lessons.slice(0, 2).map((l) => l.id),
  c8: COURSES[7].lessons.map((l) => l.id),
});
const seedQuiz = (): QuizRecord[] => [
  { setId: 'q-nn1', score: 4, total: 4, when: 'Nov 8' },
  { setId: 'q-ml1', score: 3, total: 5, when: 'Nov 6' },
  { setId: 'q-tf1', score: 2, total: 4, when: 'Nov 2' },
];

function useStoreValue() {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('db.lang') as Lang) || 'en');
  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem('db.lang', l); };
  const t = useCallback((k: Key) => tr(lang, k), [lang]);
  /** Inline bilingual string: tt('English', 'বাংলা'). */
  const tt = useCallback((en: string, bn: string) => (lang === 'bn' ? bn : en), [lang]);
  const x = useCallback((v: Parameters<typeof tx>[1]) => tx(lang, v), [lang]);

  const [authed, setAuthed] = useState(true);
  const [admin, setAdmin] = useState(false);

  // navigation
  const [tab, setTabState] = useState<Tab>('home');
  const [stacks, setStacks] = useState<Record<Tab, Screen[]>>(emptyStacks);
  const [leaving, setLeaving] = useState<Screen | null>(null);
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [toastMsg, setToastMsg] = useState<{ id: number; msg: string } | null>(null);
  const hist = useRef(0);
  const tabRef = useRef(tab);
  tabRef.current = tab;
  const sheetRef = useRef(sheet);
  sheetRef.current = sheet;

  const toast = useCallback((msg: string) => setToastMsg({ id: Date.now(), msg }), []);
  useEffect(() => {
    if (!toastMsg) return;
    const id = setTimeout(() => setToastMsg(null), 2200);
    return () => clearTimeout(id);
  }, [toastMsg]);

  const push = useCallback((name: string, params: Record<string, any> = {}) => {
    setSheet(null);
    setStacks((s) => ({ ...s, [tabRef.current]: [...s[tabRef.current], mkScreen(name, params)] }));
    try { history.pushState({ db: true }, ''); hist.current++; } catch { /* noop */ }
  }, []);

  const replace = useCallback((name: string, params: Record<string, any> = {}) => {
    setStacks((s) => {
      const st = s[tabRef.current];
      return { ...s, [tabRef.current]: [...st.slice(0, -1), mkScreen(name, params)] };
    });
  }, []);

  const stacksRef = useRef(stacks);
  stacksRef.current = stacks;
  const doPop = useCallback((count = 1) => {
    const t = tabRef.current;
    const st = stacksRef.current[t];
    if (!st.length) return;
    const top = st[st.length - 1];
    setLeaving(top);
    setTimeout(() => setLeaving((l) => (l?.key === top.key ? null : l)), 220);
    setStacks((s) => ({ ...s, [t]: s[t].slice(0, Math.max(0, s[t].length - count)) }));
  }, []);

  const back = useCallback(() => {
    if (sheet) { setSheet(null); return; }
    if (hist.current > 0) { history.back(); return; }
    doPop();
  }, [sheet, doPop]);

  const popTo = useCallback((count: number) => doPop(count), [doPop]);

  useEffect(() => {
    const onPop = () => {
      hist.current = Math.max(0, hist.current - 1);
      if (sheetRef.current) setSheet(null);
      doPop();
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [doPop]);

  const setTab = useCallback((t: Tab) => {
    setSheet(null);
    if (t === tabRef.current) {
      setStacks((s) => ({ ...s, [t]: [] }));
    }
    setTabState(t);
  }, []);

  const jump = useCallback((t: Tab, screens: [string, Record<string, any>?][] = []) => {
    setSheet(null);
    setDialog(null);
    setAuthed(true);
    setAdmin(false);
    setTabState(t);
    setStacks((s) => ({ ...s, [t]: screens.map(([n, p]) => mkScreen(n, p || {})) }));
  }, []);

  const current: Screen | undefined = stacks[tab][stacks[tab].length - 1];

  // social
  const [follows, setFollows] = useState<string[]>([]);
  const [likes, setLikes] = useState<Set<string>>(() => new Set(['r2', 'n2']));
  const [saves, setSaves] = useState<Set<string>>(() => new Set(['i1', 'p1', 'n1', 'c3']));
  const [hiddenPosts, setHiddenPosts] = useState<Set<string>>(() => new Set());
  const [blocked, setBlocked] = useState<string[]>(['spam.bot']);
  const [extraComments, setExtraComments] = useState<Record<string, Comment[]>>({});
  const [muted, setMuted] = useState(true);
  const [activityRead, setActivityRead] = useState(false);

  const isFollowing = (id: string) => follows.includes(id);
  const toggleFollow = (id: string) => setFollows((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  const toggleSet = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (id: string) =>
    setter((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleLike = toggleSet(setLikes);
  const toggleSaveRaw = toggleSet(setSaves);
  const toggleSave = (id: string) => { toast(saves.has(id) ? tr(lang, 'removedSaved') : tr(lang, 'saved')); toggleSaveRaw(id); };
  const hidePost = (id: string) => setHiddenPosts((s) => new Set(s).add(id));
  const addComment = (postId: string, text: string) =>
    setExtraComments((c) => ({ ...c, [postId]: [{ id: `u${Date.now()}`, who: 'me', text, time: { en: 'now', bn: 'এখন' }, likes: 0 }, ...(c[postId] || [])] }));

  // profile + content
  const [me, setMe] = useState<Creator>(ME);
  const [myPosts, setMyPosts] = useState<Post[]>(MY_POSTS_SEED);
  const [myPapers, setMyPapers] = useState<Paper[]>(MY_PAPERS_SEED);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const addMyPost = (p: Post) => setMyPosts((s) => [p, ...s]);
  const addMyPaper = (p: Paper) => setMyPapers((s) => [p, ...s]);
  const addMyCourse = (c: Course) => setMyCourses((s) => [c, ...s]);

  // learning
  const [done, setDone] = useState<Record<string, string[]>>(seedDone);
  const [quizHistory, setQuizHistory] = useState<QuizRecord[]>(seedQuiz);
  const [lastCourse, setLastCourse] = useState('c1');
  const markDone = (courseId: string, lessonId: string) => {
    setDone((d) => ({ ...d, [courseId]: Array.from(new Set([...(d[courseId] || []), lessonId])) }));
    setLastCourse(courseId);
  };
  const addQuiz = (r: QuizRecord) => setQuizHistory((q) => [r, ...q]);

  // settings
  const [contentLang, setContentLang] = useState<'all' | ContentLang>('all');
  const [notif, setNotif] = useState({ likes: true, comments: true, follows: true, course: true });
  const [privacy, setPrivacy] = useState({ comment: 'everyone', message: 'followers' });
  const [demo, setDemo] = useState<DemoFlags>({ preReview: true, lockLessons: false, dms: false, langFilter: true });

  // explore cross-tab
  const [exploreSeg, setExploreSeg] = useState<'trending' | 'research' | 'creators'>('trending');
  const [exploreTopic, setExploreTopic] = useState<TopicId | null>(null);

  const allPosts = useMemo(() => [...myPosts, ...allBasePosts], [myPosts]);
  const allPapers = useMemo(() => [...myPapers, ...PAPERS, ...NEW_PAPERS], [myPapers]);
  const allCourses = useMemo(() => [...myCourses, ...COURSES], [myCourses]);

  const langOk = (l: ContentLang) =>
    !demo.langFilter || contentLang === 'all' || l === 'mixed' || l === contentLang;
  const visible = (p: { id: string; creatorId: string; lang: ContentLang }) =>
    !hiddenPosts.has(p.id) && !blocked.includes(p.creatorId) && langOk(p.lang);

  // research v2 + plans
  const [navMode, setNavMode] = useState<NavMode>('v2');
  const tabNav = navMode !== 'classic';
  const [howSeen, setHowSeen] = useState(false);
  const [plan, setPlanState] = useState<Plan>('free');
  const [usage, setUsage] = useState(seedUsage);
  const [aiPaused, setAiPaused] = useState(false);
  const [reading, setReadingState] = useState<Record<string, ReadState>>(seedReading);
  const [known, setKnown] = useState<Set<string>>(() => new Set());
  const [outputs, setOutputs] = useState<Output[]>(seedOutputs);
  const [clubs, setClubs] = useState<Set<string>>(() => new Set(['club2']));
  const [figAnswers, setFigAnswers] = useState<Record<string, number>>({});
  const [payMethod, setPayMethod] = useState<'bkash' | 'nagad' | 'card'>('bkash');
  const setPlan = (p: Plan) => setPlanState(p);
  const left = (tool: ToolId) => Math.max(0, LIMITS[plan][tool] - usage[plan][tool]);
  const spend = (tool: ToolId) => setUsage((u) => ({ ...u, [plan]: { ...u[plan], [tool]: u[plan][tool] + 1 } }));
  const resetUsage = () => setUsage({ free: { readmap: 0, landscape: 0, compare: 0, claim: 0, roadmap: 0 }, premium: { readmap: 0, landscape: 0, compare: 0, claim: 0, roadmap: 0 } });
  const addOutput = (o: Output) => setOutputs((x) => [o, ...x]);
  const setReading = (id: string, patch: Partial<ReadState>) =>
    setReadingState((r) => ({ ...r, [id]: { ...(r[id] || { step: 0, note: '' }), ...patch, when: 'Nov 20' } }));
  const [researchSeg, setResearchSeg] = useState<'discover' | 'tools' | 'library'>('discover');
  const markKnown = (id: string) => setKnown((k) => new Set(k).add(id));
  const toggleKnown = (id: string) => setKnown((k) => { const n = new Set(k); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleClub = (id: string) => setClubs((k) => { const n = new Set(k); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const answerFig = (k: string, v: number) => setFigAnswers((a) => ({ ...a, [k]: v }));
  /** Open Explore (classic: switch tab; v2: push it on the current stack). */
  const goExplore = (seg?: 'trending' | 'research' | 'creators', topic?: TopicId | null) => {
    if (seg) setExploreSeg(seg);
    if (topic !== undefined) setExploreTopic(topic);
    if (navMode === 'classic') setTab('explore');
    else push('explore');
  };
  const openPractice = () => (tabNav ? setTab('practice') : push('practice'));

  const resetDemo = () => {
    setUsage(seedUsage()); setReadingState(seedReading()); setKnown(new Set()); setOutputs(seedOutputs()); setClubs(new Set(['club2'])); setFigAnswers({}); setAiPaused(false); setResearchSeg('discover'); setHowSeen(false);
    setFollows([]); setLikes(new Set(['r2', 'n2'])); setSaves(new Set(['i1', 'p1', 'n1', 'c3']));
    setHiddenPosts(new Set()); setBlocked(['spam.bot']); setExtraComments({});
    setMe(ME); setMyPosts(MY_POSTS_SEED); setMyPapers(MY_PAPERS_SEED); setMyCourses([]);
    setDone(seedDone()); setQuizHistory(seedQuiz()); setActivityRead(false); setContentLang('all');
    setExploreSeg('trending'); setExploreTopic(null);
    jump('home');
  };

  return {
    lang, setLang, t, x, tt,
    navMode, setNavMode, tabNav, howSeen, setHowSeen, plan, setPlan, usage, left, spend, resetUsage, aiPaused, setAiPaused,
    reading, setReading, known, toggleKnown, markKnown, researchSeg, setResearchSeg, outputs, addOutput, clubs, toggleClub, figAnswers, answerFig, payMethod, setPayMethod,
    goExplore, openPractice,
    authed, setAuthed, admin, setAdmin,
    tab, setTab, stacks, current, leaving, push, replace, back, popTo, jump,
    sheet, setSheet, dialog, setDialog, toastMsg, toast,
    follows, isFollowing, toggleFollow, likes, toggleLike, saves, toggleSave, hidePost,
    blocked, setBlocked, extraComments, addComment, muted, setMuted,
    activityRead, setActivityRead, activity: ACTIVITY,
    me, setMe, myPosts, myPapers, myCourses, addMyPost, addMyPaper, addMyCourse,
    allPosts, allPapers, allCourses,
    done, markDone, quizHistory, addQuiz, lastCourse, setLastCourse,
    contentLang, setContentLang, notif, setNotif, privacy, setPrivacy, demo, setDemo,
    exploreSeg, setExploreSeg, exploreTopic, setExploreTopic,
    visible, langOk, resetDemo,
  };
}

export type Store = ReturnType<typeof useStoreValue>;
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const value = useStoreValue();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx)!;

export const findPost = (s: Store, id: string) => s.allPosts.find((p) => p.id === id);
export const findPaper = (s: Store, id: string) => s.allPapers.find((p) => p.id === id);
export const findCourse = (s: Store, id: string) => s.allCourses.find((c) => c.id === id);
export const creatorOf = (s: Store, id: string): Creator =>
  id === 'me' ? s.me : CREATORS.find((c) => c.id === id) || CREATORS[0];
