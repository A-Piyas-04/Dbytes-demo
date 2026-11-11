import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ACTIVITY, COURSES, CREATORS, ME, MY_PAPERS_SEED, MY_POSTS_SEED, allBasePosts, PAPERS,
  type Comment, type ContentLang, type Course, type Creator, type Lang, type Paper, type Post, type TopicId,
} from './data';
import { tr, tx, type Key } from './i18n';

export type Tab = 'home' | 'explore' | 'learn' | 'profile';
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
]);
export const isImmersive = (name?: string) => !!name && IMMERSIVE.has(name);

let keySeq = 1;
const mkScreen = (name: string, params: Record<string, any> = {}): Screen => ({ key: keySeq++, name, params });
const emptyStacks = (): Record<Tab, Screen[]> => ({ home: [], explore: [], learn: [], profile: [] });

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
  const allPapers = useMemo(() => [...myPapers, ...PAPERS], [myPapers]);
  const allCourses = useMemo(() => [...myCourses, ...COURSES], [myCourses]);

  const langOk = (l: ContentLang) =>
    !demo.langFilter || contentLang === 'all' || l === 'mixed' || l === contentLang;
  const visible = (p: { id: string; creatorId: string; lang: ContentLang }) =>
    !hiddenPosts.has(p.id) && !blocked.includes(p.creatorId) && langOk(p.lang);

  const resetDemo = () => {
    setFollows([]); setLikes(new Set(['r2', 'n2'])); setSaves(new Set(['i1', 'p1', 'n1', 'c3']));
    setHiddenPosts(new Set()); setBlocked(['spam.bot']); setExtraComments({});
    setMe(ME); setMyPosts(MY_POSTS_SEED); setMyPapers(MY_PAPERS_SEED); setMyCourses([]);
    setDone(seedDone()); setQuizHistory(seedQuiz()); setActivityRead(false); setContentLang('all');
    setExploreSeg('trending'); setExploreTopic(null);
    jump('home');
  };

  return {
    lang, setLang, t, x,
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
