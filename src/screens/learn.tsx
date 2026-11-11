import React, { useEffect, useState } from 'react';
import {
  ArrowRight, Bookmark, Check, CheckCircle2, ChevronRight, CircleX, Clock, Layers, Lock, Pause, Play, RotateCcw, Star, Target, Users, X, Trophy, Maximize2, Volume2,
} from 'lucide-react';
import { NOTES, QUIZZES, TOPICS, type Course, type Lesson, type TopicId } from '../data';
import { useStore, creatorOf, findCourse, type Store } from '../store';
import { compact, digits, duration, clock } from '../i18n';
import { Scene, SCENE_BG } from '../scenes';
import { Inline, Markdown } from '../markdown';
import { Avatar, Btn, Empty, Header, Level, LessonTypeIcon, Name, Progress, TopBar, TopicChips, TopicTag, openCreator } from '../ui';

export const courseMinutes = (c: Course) => c.lessons.reduce((a, l) => a + l.min, 0);
export const courseProgress = (s: Store, c: Course) => (s.done[c.id]?.length || 0) / Math.max(1, c.lessons.length);
const nextLesson = (s: Store, c: Course) => c.lessons.find((l) => !s.done[c.id]?.includes(l.id)) || c.lessons[0];

export function Cover({ c, h }: { c: Course; h?: number }) {
  return (
    <div className="cover" style={{ ['--h' as string]: SCENE_BG[c.cover], height: h }}>
      <Scene kind={c.cover} playing={false} fit="meet" />
    </div>
  );
}

export function LearnScreen() {
  const s = useStore();
  const [topic, setTopic] = useState<TopicId | null>(null);
  const last = findCourse(s, s.lastCourse) || s.allCourses[0];
  const pct = courseProgress(s, last);
  const courses = s.allCourses.filter((c) => s.langOk(c.lang));
  const rec = courses.filter((c) => (s.done[c.id]?.length || 0) === 0).slice(0, 5);
  const all = courses.filter((c) => !topic || c.topic === topic);

  return (
    <div className="screen-col">
      <TopBar />
      <div className="scroll">
        <div className="quick-grid pad">
          <button className="quick-card continue tap" onClick={() => s.push('lesson', { course: last.id, lesson: nextLesson(s, last).id })}>
            <span className="qc-label"><Play size={14} fill="currentColor" /> {s.t('continueLearning')}</span>
            <span className="qc-title">{s.x(last.title)}</span>
            <span className="qc-foot">
              <Progress value={pct} />
              <span className="qc-pct">{digits(s.lang, Math.round(pct * 100))}% {s.t('complete')}</span>
            </span>
          </button>
          <button className="quick-card practice tap" onClick={() => s.push('practice')}>
            <span className="qc-icon"><Target size={22} /></span>
            <span className="qc-title">{s.t('practice')}</span>
            <span className="qc-sub">{s.t('practiceSub')}</span>
            <span className="qc-go"><ArrowRight size={18} /></span>
          </button>
        </div>

        <div className="sec-head pad-x"><h2>{s.t('recommended')}</h2></div>
        <div className="h-scroll">
          {rec.map((c) => <CourseCard key={c.id} c={c} />)}
        </div>

        <div className="sec-head pad-x"><h2>{s.t('allCourses')}</h2></div>
        <div className="explore-chips"><TopicChips value={topic} onChange={setTopic} /></div>
        <div className="list pad">
          {all.length ? all.map((c) => <CourseRow key={c.id} c={c} />) : <Empty icon={<Layers size={28} />} title={s.t('noCourses')} />}
        </div>
      </div>
    </div>
  );
}

export function CourseCard({ c }: { c: Course }) {
  const s = useStore();
  return (
    <button className="course-card tap" onClick={() => s.push('course', { id: c.id })}>
      <Cover c={c} />
      <span className="cc-body">
        <span className="cc-title">{s.x(c.title)}</span>
        <span className="cc-by">{s.x(creatorOf(s, c.creatorId).name)}</span>
        <span className="cc-meta">
          <span><Layers size={13} /> {digits(s.lang, c.lessons.length)} {s.t('lessons')}</span>
          <span className="cc-tag">#{TOPICS.find((t) => t.id === c.topic)!.tag}</span>
        </span>
      </span>
    </button>
  );
}

export function CourseRow({ c }: { c: Course }) {
  const s = useStore();
  const pct = courseProgress(s, c);
  return (
    <button className="course-row tap" onClick={() => s.push('course', { id: c.id })}>
      <Cover c={c} />
      <span className="cr-body">
        <span className="cr-title">{s.x(c.title)}</span>
        <span className="cr-by">{s.x(creatorOf(s, c.creatorId).name)}</span>
        <span className="cr-meta">
          <span><Layers size={13} /> {digits(s.lang, c.lessons.length)}</span>
          <span><Clock size={13} /> {duration(s.lang, courseMinutes(c))}</span>
          <Level level={c.level} />
        </span>
        {pct > 0 && <Progress value={pct} thin />}
      </span>
    </button>
  );
}

export function CourseDetail({ id }: { id: string }) {
  const s = useStore();
  const c = findCourse(s, id)!;
  const done = s.done[c.id] || [];
  const pct = done.length / c.lessons.length;
  const firstOpen = c.lessons.findIndex((l) => !done.includes(l.id));
  const saved = s.saves.has(c.id);
  const cta = pct === 0 ? s.t('start') : pct === 1 ? s.t('review') : s.t('continue');
  const creator = creatorOf(s, c.creatorId);
  const open = (l: Lesson, i: number) => {
    if (s.demo.lockLessons && firstOpen !== -1 && i > firstOpen) { s.toast(s.t('locked')); return; }
    s.push('lesson', { course: c.id, lesson: l.id });
  };
  return (
    <div className="screen-col">
      <Header
        transparent
        right={<button className={`icon-btn tap save ${saved ? 'on' : ''}`} onClick={() => s.toggleSave(c.id)} aria-label={s.t('save')} aria-pressed={saved}><Bookmark size={21} fill={saved ? 'currentColor' : 'none'} /></button>}
      />
      <div className="scroll">
        <Cover c={c} h={210} />
        <div className="pad course-head">
          <TopicTag id={c.topic} />
          <h1 className="course-title">{s.x(c.title)}</h1>
          <button className="course-creator tap" onClick={() => openCreator(s, c.creatorId)}>
            <Avatar c={creator} size={30} /> <Name c={creator} />
          </button>
          <p className="course-desc">{s.x(c.desc)}</p>
          <div className="course-meta">
            <span><Layers size={15} /> {digits(s.lang, c.lessons.length)} {s.t('lessons')}</span>
            <span><Clock size={15} /> {duration(s.lang, courseMinutes(c))}</span>
            <span><Users size={15} /> {compact(s.lang, c.learners)}</span>
            <span><Star size={15} fill="currentColor" className="star" /> {digits(s.lang, c.rating)}</span>
            <Level level={c.level} />
          </div>
          {pct > 0 && (
            <div className="course-progress">
              <Progress value={pct} />
              <span>{digits(s.lang, done.length)}/{digits(s.lang, c.lessons.length)} {s.t('complete')}</span>
            </div>
          )}
          <Btn block size="lg" icon={<Play size={18} fill="currentColor" />} onClick={() => s.push('lesson', { course: c.id, lesson: nextLesson(s, c).id })}>{cta}</Btn>
        </div>
        <div className="sec-head pad-x"><h2>{s.t('lessonsTitle')}</h2></div>
        <ol className="lesson-list">
          {c.lessons.map((l, i) => {
            const isDone = done.includes(l.id);
            const locked = s.demo.lockLessons && firstOpen !== -1 && i > firstOpen;
            return (
              <li key={l.id}>
                <button className={`lesson-row tap ${isDone ? 'done' : ''} ${locked ? 'locked' : ''} ${i === firstOpen ? 'current' : ''}`} onClick={() => open(l, i)}>
                  <span className="lr-num">{isDone ? <Check size={16} strokeWidth={3} /> : digits(s.lang, i + 1)}</span>
                  <span className="lr-body">
                    <span className="lr-title">{s.x(l.title)}</span>
                    <span className="lr-meta">
                      <LessonTypeIcon type={l.type} size={13} />
                      {l.type === 'video' ? s.t('video') : l.type === 'note' ? s.t('noteType') : s.t('mixedType')}
                      <span className="dot-sep" /> {digits(s.lang, l.min)} {s.t('min')}
                      {l.quiz && <><span className="dot-sep" /> <Target size={13} /> {s.t('quiz')}</>}
                    </span>
                  </span>
                  {locked ? <Lock size={16} className="muted" /> : <ChevronRight size={18} className="muted" />}
                </button>
              </li>
            );
          })}
        </ol>
        <div className="bottom-space" />
      </div>
    </div>
  );
}

const lessonNote = (s: Store, c: Course, l: Lesson) => {
  if (c.id === 'c1' && l.id === 'c1-2') return NOTES[3].body;
  if (l.scene === 'attention') return NOTES[1].body;
  if (l.scene === 'regression' || l.scene === 'gradient') return NOTES[0].body;
  if (l.scene === 'react') return NOTES[2].body;
  const t = s.x(l.title);
  return `## ${t}
- ${s.lang === 'bn' ? 'মূল ধারণা' : 'Core idea'}
- ${s.lang === 'bn' ? 'উদাহরণ' : 'Worked example'}
- ${s.lang === 'bn' ? 'সাধারণ ভুল' : 'Common mistakes'}

$$y = f(Wx + b)$$

\`\`\`python
import torch
model = torch.nn.Linear(4, 2)
y = model(torch.randn(1, 4))
\`\`\`

## ${s.lang === 'bn' ? 'সারসংক্ষেপ' : 'Recap'}
1. ${s.lang === 'bn' ? 'সংজ্ঞা' : 'Definition'}
2. ${s.lang === 'bn' ? 'অনুশীলন' : 'Practice'}
3. ${s.lang === 'bn' ? 'পরের ধাপ' : 'Next step'}`;
};

function VideoPlayer({ scene, mins }: { scene: string; mins: number }) {
  const s = useStore();
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(0);
  const total = mins * 60;
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((v) => Math.min(total, v + 1.5)), 100);
    return () => clearInterval(id);
  }, [playing, total]);
  return (
    <div className="player" style={{ ['--h' as string]: SCENE_BG[scene as keyof typeof SCENE_BG] ?? 168 }}>
      <Scene kind={(scene as never) || 'neural'} dark playing={playing} />
      <button className="player-toggle tap" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause' : 'Play'}>
        {playing ? <Pause size={26} fill="currentColor" /> : <Play size={26} fill="currentColor" />}
      </button>
      <div className="player-bar">
        <span>{clock(s.lang, t)}</span>
        <input type="range" min={0} max={total} value={t} onChange={(e) => setT(+e.target.value)} aria-label="Seek" />
        <span>{clock(s.lang, total)}</span>
        <Volume2 size={16} />
        <Maximize2 size={16} />
      </div>
    </div>
  );
}

export function LessonViewer({ course, lesson }: { course: string; lesson: string }) {
  const s = useStore();
  const c = findCourse(s, course)!;
  const idx = c.lessons.findIndex((l) => l.id === lesson);
  const l = c.lessons[idx];
  const isDone = s.done[c.id]?.includes(l.id);
  const next = c.lessons[idx + 1];
  useEffect(() => { s.setLastCourse(c.id); }, [c.id]);
  const complete = () => {
    s.markDone(c.id, l.id);
    s.toast(idx === c.lessons.length - 1 ? s.t('courseDone') : s.t('lessonDone'));
  };
  return (
    <div className="screen-col lesson-screen">
      <Header title={<span className="header-stack"><small>{s.t('lesson')} {digits(s.lang, idx + 1)}/{digits(s.lang, c.lessons.length)}</small>{s.x(c.title)}</span>} />
      <div className="scroll" key={l.id}>
        {l.type !== 'note' && <VideoPlayer scene={l.scene || c.cover} mins={l.min} />}
        <div className="pad">
          <div className="lesson-kicker"><LessonTypeIcon type={l.type} size={14} /> {l.type === 'video' ? s.t('video') : l.type === 'note' ? s.t('noteType') : s.t('mixedType')} <span className="dot-sep" /> {digits(s.lang, l.min)} {s.t('min')}</div>
          <h1 className="lesson-title">{s.x(l.title)}</h1>
          {l.type !== 'video' && <Markdown src={lessonNote(s, c, l)} />}
        </div>
        <div className="bottom-space" />
      </div>
      <div className="bottom-bar">
        {!isDone ? (
          <Btn block size="lg" icon={<CheckCircle2 size={20} />} onClick={complete}>{s.t('markComplete')}</Btn>
        ) : (
          <div className="done-actions">
            <span className="done-chip"><CheckCircle2 size={18} /> {s.t('completed')}</span>
            {l.quiz && <Btn variant="accent" icon={<Target size={18} />} onClick={() => s.push('quiz', { id: l.quiz })}>{s.t('practiceLesson')}</Btn>}
            {next && <Btn variant={l.quiz ? 'secondary' : 'primary'} onClick={() => s.replace('lesson', { course: c.id, lesson: next.id })}>{s.t('nextLesson')} <ArrowRight size={16} /></Btn>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Practice ---------------- */

const TOPIC_HUE: Record<TopicId, number> = { ml: 260, dl: 210, nn: 168, tf: 330, genai: 290, llm: 172, agents: 24, research: 140 };

export function PracticeScreen() {
  const s = useStore();
  return (
    <div className="screen-col">
      <Header title={s.t('practice')} />
      <div className="scroll pad">
        <div className="topic-grid">
          {TOPICS.map((tp) => {
            const sets = QUIZZES.filter((q) => q.topic === tp.id);
            const qs = sets.reduce((a, q) => a + q.questions.length, 0);
            return (
              <button key={tp.id} className="topic-card tap" style={{ ['--h' as string]: TOPIC_HUE[tp.id] }} onClick={() => s.push('practiceTopic', { topic: tp.id })}>
                <span className="tc-title">{s.x(tp.label)}</span>
                <span className="tc-meta">{digits(s.lang, sets.length)} {sets.length === 1 ? s.t('quiz1') : s.t('quizN')}</span>
                <span className="tc-meta">{digits(s.lang, qs)} {s.t('questions')}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function PracticeTopic({ topic }: { topic: TopicId }) {
  const s = useStore();
  const tp = TOPICS.find((t) => t.id === topic)!;
  const sets = QUIZZES.filter((q) => q.topic === topic);
  return (
    <div className="screen-col">
      <Header title={s.x(tp.label)} />
      <div className="scroll pad">
        <div className="sec-head"><h3>{s.t('quizSets')}</h3></div>
        <div className="list">
          {sets.map((q) => {
            const best = s.quizHistory.filter((h) => h.setId === q.id).sort((a, b) => b.score / b.total - a.score / a.total)[0];
            return (
              <button key={q.id} className="quiz-row tap" onClick={() => s.push('quiz', { id: q.id })}>
                <span className="qr-icon"><Target size={20} /></span>
                <span className="qr-body">
                  <span className="qr-title">{s.x(q.title)}</span>
                  <span className="qr-meta">{digits(s.lang, q.questions.length)} {s.t('questions')} <span className="dot-sep" /> <Level level={q.level} /></span>
                </span>
                {best && <span className="qr-best"><Trophy size={14} /> {digits(s.lang, best.score)}/{digits(s.lang, best.total)}</span>}
                <ChevronRight size={18} className="muted" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function QuizScreen({ id }: { id: string }) {
  const s = useStore();
  const set = QUIZZES.find((q) => q.id === id)!;
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const q = set.questions[i];
  const isLast = i === set.questions.length - 1;
  const pick = (k: number) => { if (picked === null) { setPicked(k); setAnswers((a) => [...a, k]); } };
  const next = () => {
    if (isLast) {
      const all = [...answers];
      const score = all.filter((a, k) => a === set.questions[k].answer).length;
      s.addQuiz({ setId: set.id, score, total: set.questions.length, when: 'Nov 11' });
      s.replace('quizResult', { id: set.id, answers: all });
    } else { setI(i + 1); setPicked(null); }
  };
  return (
    <div className="screen-col quiz-screen">
      <header className="header">
        <button className="icon-btn tap" onClick={s.back} aria-label={s.t('close')}><X size={22} /></button>
        <div className="quiz-progress"><Progress value={(i + (picked !== null ? 1 : 0)) / set.questions.length} /></div>
        <span className="quiz-count">{digits(s.lang, i + 1)}/{digits(s.lang, set.questions.length)}</span>
      </header>
      <div className="scroll pad" key={i}>
        <div className="quiz-set">{s.x(set.title)}</div>
        <h2 className="quiz-q"><Inline text={s.x(q.q)} /></h2>
        <div className="options">
          {q.options.map((o, k) => {
            const state = picked === null ? '' : k === q.answer ? 'right' : k === picked ? 'wrong' : 'dim';
            return (
              <button key={k} className={`option tap ${state}`} onClick={() => pick(k)} disabled={picked !== null}>
                <span className="opt-key">{String.fromCharCode(65 + k)}</span>
                <span className="opt-text"><Inline text={s.x(o)} /></span>
                {state === 'right' && <CheckCircle2 size={20} />}
                {state === 'wrong' && <CircleX size={20} />}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className={`feedback ${picked === q.answer ? 'right' : 'wrong'}`} role="status">
            <b>{picked === q.answer ? s.t('correct') : s.t('incorrect')}</b>
            <span><Inline text={s.x(q.why)} /></span>
          </div>
        )}
      </div>
      <div className="bottom-bar">
        <Btn block size="lg" disabled={picked === null} onClick={next}>{isLast ? s.t('finish') : s.t('next')} <ArrowRight size={18} /></Btn>
      </div>
    </div>
  );
}

export function QuizResult({ id, answers }: { id: string; answers: number[] }) {
  const s = useStore();
  const set = QUIZZES.find((q) => q.id === id)!;
  const score = answers.filter((a, k) => a === set.questions[k].answer).length;
  const total = set.questions.length;
  const [review, setReview] = useState(false);
  const wrong = set.questions.map((q, k) => ({ q, k, a: answers[k] })).filter((r) => r.a !== r.q.answer);
  const pct = score / total;
  const R = 54, C = 2 * Math.PI * R;
  return (
    <div className="screen-col">
      <header className="header">
        <button className="icon-btn tap" onClick={s.back} aria-label={s.t('close')}><X size={22} /></button>
        <div className="header-title">{s.t('results')}</div>
        <div className="header-right" />
      </header>
      <div className="scroll pad result">
        <div className="ring">
          <svg viewBox="0 0 128 128" aria-hidden="true">
            <circle cx={64} cy={64} r={R} className="ring-bg" />
            <circle cx={64} cy={64} r={R} className="ring-fg" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} />
          </svg>
          <div className="ring-num"><b>{digits(s.lang, score)}/{digits(s.lang, total)}</b><span>{s.t('correctCount')}</span></div>
        </div>
        <h2 className="result-title">{pct === 1 ? s.t('allCorrect') : pct >= 0.6 ? s.t('greatJob') : s.t('keepGoing')}</h2>
        <div className="result-set">{s.x(set.title)}</div>
        <div className="result-actions">
          {wrong.length > 0 && <Btn variant="secondary" block onClick={() => setReview(!review)}>{s.t('reviewWrong')} ({digits(s.lang, wrong.length)})</Btn>}
          <Btn variant="secondary" block icon={<RotateCcw size={18} />} onClick={() => s.replace('quiz', { id })}>{s.t('retry')}</Btn>
          <Btn block onClick={s.back}>{s.t('done')}</Btn>
        </div>
        {review && (
          <div className="review-list">
            {wrong.map(({ q, k, a }) => (
              <div className="review-item" key={k}>
                <div className="ri-q"><Inline text={s.x(q.q)} /></div>
                <div className="ri-a wrong"><CircleX size={16} /> <span><Inline text={s.x(q.options[a])} /></span></div>
                <div className="ri-a right"><CheckCircle2 size={16} /> <span><Inline text={s.x(q.options[q.answer])} /></span></div>
                <div className="ri-why"><Inline text={s.x(q.why)} /></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
