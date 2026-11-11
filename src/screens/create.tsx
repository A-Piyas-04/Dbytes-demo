import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, Bold, Camera, Check, CheckCircle2, ChevronRight, Clapperboard, Code2, FileText, FlaskConical, GripVertical, Heading2, Image as ImageIcon, Images, Layers, List, Plus, Radical, RefreshCw, Sigma, Trash2, Upload, Video, X, Zap, Clock, Hourglass,
} from 'lucide-react';
import { TOPICS, type ContentLang, type Lesson, type LessonType, type SceneKind, type TopicId, REELS, PAPERS, COURSES } from '../data';
import { useStore } from '../store';
import { clock, digits } from '../i18n';
import { Scene, SCENE_BG } from '../scenes';
import { Markdown } from '../markdown';
import { Btn, Chip, Seg, Sheet, Toggle, useReorder, LessonTypeIcon } from '../ui';
import { Field } from './profile';

export function CreateSheet() {
  const s = useStore();
  const opts = [
    { id: 'createReel', icon: <Clapperboard size={24} />, t: s.t('reel'), sub: s.t('reelSub'), hue: 330 },
    { id: 'createPhoto', icon: <Images size={24} />, t: s.t('photo'), sub: s.t('photoSub'), hue: 210 },
    { id: 'createNote', icon: <FileText size={24} />, t: s.t('note'), sub: s.t('noteSub'), hue: 45 },
    { id: 'createCourse', icon: <Layers size={24} />, t: s.t('course'), sub: s.t('courseSub'), hue: 168 },
    { id: 'createResearch', icon: <FlaskConical size={24} />, t: s.t('researchSummary'), sub: s.t('researchSub'), hue: 260 },
  ];
  return (
    <Sheet title={s.t('whatCreate')} onClose={() => s.setSheet(null)}>
      <div className="create-list">
        {opts.map((o) => (
          <button key={o.id} className="create-opt tap" onClick={() => s.push(o.id)}>
            <span className="co-icon" style={{ background: `hsl(${o.hue} 70% 94%)`, color: `hsl(${o.hue} 55% 34%)` }}>{o.icon}</span>
            <span className="co-text"><b>{o.t}</b><span>{o.sub}</span></span>
            <ChevronRight size={18} className="muted" />
          </button>
        ))}
      </div>
    </Sheet>
  );
}

function FlowHeader({ title, step, steps, onBack, dirty }: { title: string; step: number; steps: number; onBack: () => void; dirty?: boolean }) {
  const s = useStore();
  const close = () => {
    if (dirty) s.setDialog({ title: s.t('discardQ'), confirm: s.t('discard'), danger: true, onConfirm: s.back });
    else s.back();
  };
  return (
    <header className="header flow-header">
      <button className="icon-btn tap" onClick={step > 0 ? onBack : close} aria-label={step > 0 ? s.t('back') : s.t('close')}>
        {step > 0 ? <ArrowRight size={22} style={{ transform: 'rotate(180deg)' }} /> : <X size={22} />}
      </button>
      <div className="header-title">{title}</div>
      <div className="header-right">
        {steps > 1 && <span className="steps" aria-label={`${step + 1}/${steps}`}>{Array.from({ length: steps }, (_, i) => <i key={i} className={i <= step ? 'on' : ''} />)}</span>}
      </div>
    </header>
  );
}

function Details({ caption, setCaption, topic, setTopic, lang, setLang, showCaption = true, extra }: {
  caption?: string; setCaption?: (v: string) => void; topic: TopicId | null; setTopic: (v: TopicId) => void; lang: ContentLang; setLang: (v: ContentLang) => void; showCaption?: boolean; extra?: React.ReactNode;
}) {
  const s = useStore();
  return (
    <div className="pad">
      {showCaption && setCaption && (
        <Field label={s.t('caption')} count={`${caption!.length}/120`}>
          <textarea rows={2} maxLength={120} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder={s.t('captionPh')} />
        </Field>
      )}
      <Field group label={s.t('topic')} hint={<span className="req">{s.t('required')}</span>}>
        <div className="chip-row wrap">
          {TOPICS.map((t) => <Chip key={t.id} active={topic === t.id} onClick={() => setTopic(t.id)}>#{t.tag}</Chip>)}
        </div>
      </Field>
      <Field group label={s.t('languageTag')}>
        <Seg options={[{ id: 'bn', label: s.t('bangla') }, { id: 'en', label: s.t('english') }, { id: 'mixed', label: s.t('mixed') }]} value={lang} onChange={setLang} />
      </Field>
      {extra}
    </div>
  );
}

const usePublish = () => {
  const s = useStore();
  return (kind: string, id: string) => s.replace('published', { kind, id });
};

export function PublishedScreen({ kind }: { kind: string }) {
  const s = useStore();
  const review = s.demo.preReview;
  return (
    <div className="screen-col published">
      <div className="pub-center">
        <div className={`pub-badge ${review ? 'review' : ''}`}>{review ? <Hourglass size={44} /> : <CheckCircle2 size={48} />}</div>
        <h1>{review ? s.t('submitted') : s.t('published')}</h1>
        <p>{review ? s.t('reviewEta') : s.t('liveNow')}</p>
        <span className="pub-kind">{kind}</span>
      </div>
      <div className="pub-actions">
        <Btn block size="lg" variant="secondary" onClick={() => s.jump('profile')}>{s.t('viewProfile')}</Btn>
        <Btn block size="lg" onClick={s.back}>{s.t('done')}</Btn>
      </div>
    </div>
  );
}

/* ---------------- Reel ---------------- */

const GALLERY_VIDEOS: { scene: SceneKind; d: number }[] = [
  { scene: 'neural', d: 42 }, { scene: 'gradient', d: 58 }, { scene: 'attention', d: 75 }, { scene: 'agent', d: 31 },
  { scene: 'diffusion', d: 49 }, { scene: 'tokens', d: 24 }, { scene: 'loss', d: 66 }, { scene: 'conv', d: 37 }, { scene: 'lora', d: 53 },
];

export function CreateReel() {
  const s = useStore();
  const publish = usePublish();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<'record' | 'upload'>('record');
  const [rec, setRec] = useState(false);
  const [secs, setSecs] = useState(0);
  const [clip, setClip] = useState<{ scene: SceneKind; d: number } | null>(null);
  const [range, setRange] = useState<[number, number]>([0, 0]);
  const [caption, setCaption] = useState('');
  const [topic, setTopic] = useState<TopicId | null>(null);
  const [lang, setLang] = useState<ContentLang>('bn');
  const [link, setLink] = useState<string>('none');

  useEffect(() => {
    if (!rec) return;
    const id = setInterval(() => setSecs((v) => {
      if (v + 1 >= 60) { setRec(false); return 60; }
      return v + 1;
    }), 250);
    return () => clearInterval(id);
  }, [rec]);
  useEffect(() => { if (!rec && secs > 0 && !clip) pick({ scene: 'neural', d: secs }); }, [rec]);

  const pick = (c: { scene: SceneKind; d: number }) => {
    setClip(c);
    setRange([0, Math.min(60, c.d)]);
    setStep(1);
  };
  const len = range[1] - range[0];
  const doPublish = () => {
    const id = `new-r${Date.now()}`;
    const [lt, lid] = link === 'none' ? [] : link.split(':');
    s.addMyPost({
      kind: 'reel', id, creatorId: 'me', topic: topic!, scene: clip!.scene, caption: caption || s.t('newReel'), more: '', subs: [{ en: caption || 'New reel', bn: caption || 'নতুন রিল' }],
      likes: 0, comments: 0, views: 0, duration: Math.max(5, len), lang, time: { en: 'now', bn: 'এখন' },
      link: lt ? { type: lt as 'course' | 'paper', id: lid } : undefined,
    });
    publish(s.t('reel'), id);
  };

  return (
    <div className={`screen-col ${step === 0 ? 'dark-screen' : ''}`}>
      <FlowHeader title={step === 0 ? s.t('newReel') : step === 1 ? s.t('trim') : s.t('details')} step={step} steps={3} onBack={() => { setStep(step - 1); if (step === 1) { setClip(null); setSecs(0); } }} dirty={!!clip} />
      {step === 0 && (
        <div className="reel-source">
          <div className="pad-x"><Seg variant="overlay" options={[{ id: 'record', label: <><Camera size={16} /> {s.t('record')}</> }, { id: 'upload', label: <><Upload size={16} /> {s.t('upload')}</> }]} value={mode} onChange={setMode} /></div>
          {mode === 'record' ? (
            <div className="camera">
              <div className="viewfinder">
                <div className="vf-grid" />
                <span className="vf-corner tl" /><span className="vf-corner tr" /><span className="vf-corner bl" /><span className="vf-corner br" />
                <div className="vf-subject" />
                {rec && <span className="rec-pill"><i /> {s.t('rec')} {clock(s.lang, secs)}</span>}
                <span className="vf-max">{s.t('max60')}</span>
                <div className="rec-progress"><span style={{ width: `${(secs / 60) * 100}%` }} /></div>
              </div>
              <div className="cam-controls">
                <button className="cam-side tap" aria-label={s.t('gallery')} onClick={() => setMode('upload')}><ImageIcon size={22} /></button>
                <button className={`rec-btn ${rec ? 'on' : ''}`} onClick={() => setRec(!rec)} aria-label={s.t('record')}><span /></button>
                <button className="cam-side tap" aria-label={s.t('flip')}><RefreshCw size={22} /></button>
              </div>
            </div>
          ) : (
            <div className="scroll">
              <div className="sec-head pad-x"><h3>{s.t('recentVideos')}</h3></div>
              <div className="grid3 flush">
                {GALLERY_VIDEOS.map((v, i) => (
                  <button key={i} className="tile tap reel" style={{ ['--h' as string]: SCENE_BG[v.scene] }} onClick={() => pick(v)}>
                    <Scene kind={v.scene} dark playing={false} />
                    <span className={`tile-dur ${v.d > 60 ? 'over' : ''}`}>{clock(s.lang, v.d)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {step === 1 && clip && (
        <>
          <div className="scroll">
            <div className="trim-preview" style={{ ['--h' as string]: SCENE_BG[clip.scene] }}>
              <Scene kind={clip.scene} dark />
              <span className="trim-len">{clock(s.lang, len)}</span>
            </div>
            <div className="pad">
              <div className="trim-label"><span>{s.t('trim')}</span><span className={len > 60 ? 'over' : ''}>{clock(s.lang, len)} / {s.t('max60')}</span></div>
              <div className="filmstrip" style={{ ['--h' as string]: SCENE_BG[clip.scene] }}>
                {Array.from({ length: 8 }, (_, i) => <span key={i} className="frame"><Scene kind={clip.scene} dark playing={false} /></span>)}
                <span className="trim-window" style={{ left: `${(range[0] / clip.d) * 100}%`, right: `${100 - (range[1] / clip.d) * 100}%` }} />
                <input type="range" className="trim-in" min={0} max={clip.d} value={range[0]} onChange={(e) => setRange([Math.min(+e.target.value, range[1] - 5), range[1]])} aria-label="Trim start" />
                <input type="range" className="trim-in" min={0} max={clip.d} value={range[1]} onChange={(e) => setRange([range[0], Math.max(+e.target.value, range[0] + 5)])} aria-label="Trim end" />
              </div>
            </div>
          </div>
          <div className="bottom-bar"><Btn block size="lg" disabled={len > 60} onClick={() => setStep(2)}>{s.t('next')} <ArrowRight size={18} /></Btn></div>
        </>
      )}
      {step === 2 && (
        <>
          <div className="scroll">
            <Details caption={caption} setCaption={setCaption} topic={topic} setTopic={setTopic} lang={lang} setLang={setLang}
              extra={
                <Field label={s.t('linkTo')} hint={<span className="opt">{s.t('optional')}</span>}>
                  <select value={link} onChange={(e) => setLink(e.target.value)}>
                    <option value="none">{s.t('none')}</option>
                    {COURSES.slice(0, 4).map((c) => <option key={c.id} value={`course:${c.id}`}>{s.t('course')}: {s.x(c.title)}</option>)}
                    {PAPERS.slice(0, 4).map((p) => <option key={p.id} value={`paper:${p.id}`}>{s.t('paperByte')}: {p.title}</option>)}
                  </select>
                </Field>
              }
            />
          </div>
          <div className="bottom-bar"><Btn block size="lg" disabled={!topic} onClick={doPublish}>{s.demo.preReview ? s.t('submitReview') : s.t('publish')}</Btn></div>
        </>
      )}
    </div>
  );
}

/* ---------------- Photo ---------------- */

const GALLERY_IMAGES: SceneKind[] = ['conv', 'pool', 'dense', 'softmax', 'biasvar', 'tokens', 'tokenids', 'embed', 'scaling', 'regression', 'lora', 'loss'];

export function CreatePhoto() {
  const s = useStore();
  const publish = usePublish();
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<SceneKind[]>([]);
  const [caption, setCaption] = useState('');
  const [topic, setTopic] = useState<TopicId | null>(null);
  const [lang, setLang] = useState<ContentLang>('bn');
  const { handle, rowStyle, dragIdx } = useReorder(sel, setSel, 76);
  const toggle = (k: SceneKind) => setSel((v) => (v.includes(k) ? v.filter((x) => x !== k) : v.length >= 10 ? v : [...v, k]));
  const steps = sel.length > 1 ? 3 : 2;
  const detailsStep = steps - 1;
  const doPublish = () => {
    const id = `new-i${Date.now()}`;
    s.addMyPost({ kind: 'image', id, creatorId: 'me', topic: topic!, caption: caption || s.t('newPost'), more: '', slides: sel.map((sc, i) => ({ scene: sc, title: `${i + 1}` })), likes: 0, comments: 0, views: 0, lang, time: { en: 'now', bn: 'এখন' } });
    publish(s.t('photo'), id);
  };
  return (
    <div className="screen-col">
      <FlowHeader title={step === 0 ? s.t('selectPhotos') : step === detailsStep ? s.t('details') : s.t('reorder')} step={step} steps={steps} onBack={() => setStep(step - 1)} dirty={sel.length > 0} />
      {step === 0 && (
        <>
          <div className="photo-preview" style={{ ['--h' as string]: SCENE_BG[sel[sel.length - 1] || 'conv'] }}>
            {sel.length ? <Scene kind={sel[sel.length - 1]} /> : <span className="pp-empty"><Images size={36} /></span>}
          </div>
          <div className="gallery-bar">
            <span>{s.t('gallery')}</span>
            <span className="muted">{digits(s.lang, sel.length)}/{digits(s.lang, 10)} {s.t('selected')}</span>
          </div>
          <div className="scroll">
            <div className="grid4">
              {GALLERY_IMAGES.map((k) => {
                const n = sel.indexOf(k);
                return (
                  <button key={k} className={`gimg tap ${n >= 0 ? 'on' : ''}`} style={{ ['--h' as string]: SCENE_BG[k] }} onClick={() => toggle(k)} aria-pressed={n >= 0}>
                    <Scene kind={k} playing={false} />
                    <span className="gnum">{n >= 0 ? digits(s.lang, n + 1) : ''}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="bottom-bar"><Btn block size="lg" disabled={!sel.length} onClick={() => setStep(1)}>{s.t('next')} <ArrowRight size={18} /></Btn></div>
        </>
      )}
      {step === 1 && steps === 3 && (
        <>
          <div className="scroll pad">
            <div className="hint-line"><GripVertical size={16} /> {s.t('dragToReorder')}</div>
            <div className="reorder-list">
              {sel.map((k, i) => (
                <div key={k} className={`reorder-row ${dragIdx === i ? 'dragging' : ''}`} style={rowStyle(i)}>
                  <span className="ro-num">{digits(s.lang, i + 1)}</span>
                  <span className="ro-thumb" style={{ ['--h' as string]: SCENE_BG[k] }}><Scene kind={k} playing={false} /></span>
                  <span className="ro-label">{s.t('image')} {digits(s.lang, i + 1)}</span>
                  <button className="icon-btn sm tap" onClick={() => setSel(sel.filter((x) => x !== k))} aria-label={s.t('remove')}><Trash2 size={17} /></button>
                  <span className="drag-handle" {...handle(i)} aria-label={s.t('dragToReorder')}><GripVertical size={20} /></span>
                </div>
              ))}
            </div>
          </div>
          <div className="bottom-bar"><Btn block size="lg" onClick={() => setStep(2)}>{s.t('next')} <ArrowRight size={18} /></Btn></div>
        </>
      )}
      {step === detailsStep && step > 0 && (
        <>
          <div className="scroll">
            <div className="mini-strip pad-x">{sel.map((k) => <span key={k} className="ro-thumb" style={{ ['--h' as string]: SCENE_BG[k] }}><Scene kind={k} playing={false} /></span>)}</div>
            <Details caption={caption} setCaption={setCaption} topic={topic} setTopic={setTopic} lang={lang} setLang={setLang} />
          </div>
          <div className="bottom-bar"><Btn block size="lg" disabled={!topic} onClick={doPublish}>{s.demo.preReview ? s.t('submitReview') : s.t('publish')}</Btn></div>
        </>
      )}
    </div>
  );
}

/* ---------------- Note ---------------- */

export function CreateNote() {
  const s = useStore();
  const publish = usePublish();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('## Idea\n- Point one\n- Point two\n\n$$E = mc^2$$');
  const [view, setView] = useState<'write' | 'preview'>('write');
  const [topic, setTopic] = useState<TopicId | null>(null);
  const [lang, setLang] = useState<ContentLang>('mixed');
  const ta = useRef<HTMLTextAreaElement>(null);
  const insert = (before: string, after = '', ph = '') => {
    const el = ta.current;
    if (!el) return;
    const { selectionStart: a, selectionEnd: b } = el;
    const sel = body.slice(a, b) || ph;
    const next = body.slice(0, a) + before + sel + after + body.slice(b);
    setBody(next);
    requestAnimationFrame(() => { el.focus(); el.selectionStart = a + before.length; el.selectionEnd = a + before.length + sel.length; });
  };
  const tools = [
    { icon: <Heading2 size={18} />, l: s.t('heading'), f: () => insert('\n## ', '', 'Heading') },
    { icon: <Bold size={18} />, l: s.t('bold'), f: () => insert('**', '**', 'bold') },
    { icon: <Code2 size={18} />, l: s.t('code'), f: () => insert('\n```python\n', '\n```\n', 'print("hello")') },
    { icon: <Sigma size={18} />, l: s.t('math'), f: () => insert('$', '$', 'x^2') },
    { icon: <Radical size={18} />, l: s.t('math'), f: () => insert('\n$$', '$$\n', '\\frac{a}{b}') },
    { icon: <List size={18} />, l: s.t('list'), f: () => insert('\n- ', '', 'item') },
    { icon: <ImageIcon size={18} />, l: s.t('image'), f: () => insert('\n![diagram](scene:', ')\n', 'neural') },
  ];
  const doPublish = () => {
    const id = `new-n${Date.now()}`;
    const plain = body.replace(/[#*`]/g, '').replace(/\n+/g, ' ').trim();
    s.addMyPost({ kind: 'note', id, creatorId: 'me', topic: topic!, title: title || s.t('newNote'), excerpt: plain.slice(0, 90), body, readMin: Math.max(1, Math.round(body.length / 900)), likes: 0, comments: 0, views: 0, lang, time: { en: 'now', bn: 'এখন' } });
    publish(s.t('note'), id);
  };
  return (
    <div className="screen-col">
      <FlowHeader title={step === 0 ? s.t('newNote') : s.t('details')} step={step} steps={2} onBack={() => setStep(0)} dirty={!!title} />
      {step === 0 ? (
        <>
          <div className="pad-x note-edit-top">
            <input className="title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={s.t('titlePh')} aria-label={s.t('title')} />
            <Seg options={[{ id: 'write', label: s.t('write') }, { id: 'preview', label: s.t('preview') }]} value={view} onChange={setView} />
          </div>
          {view === 'write' ? (
            <>
              <div className="toolbar" role="toolbar">
                {tools.map((tl, i) => <button key={i} className="tool tap" onClick={tl.f} aria-label={tl.l} title={tl.l}>{tl.icon}</button>)}
              </div>
              <textarea ref={ta} className="editor" value={body} onChange={(e) => setBody(e.target.value)} spellCheck={false} aria-label={s.t('content')} />
            </>
          ) : (
            <div className="scroll pad">
              <h1 className="reader-title">{title || s.t('titlePh')}</h1>
              <Markdown src={body} />
            </div>
          )}
          <div className="bottom-bar"><Btn block size="lg" disabled={!title.trim()} onClick={() => setStep(1)}>{s.t('next')} <ArrowRight size={18} /></Btn></div>
        </>
      ) : (
        <>
          <div className="scroll"><Details topic={topic} setTopic={setTopic} lang={lang} setLang={setLang} showCaption={false} /></div>
          <div className="bottom-bar"><Btn block size="lg" disabled={!topic} onClick={doPublish}>{s.demo.preReview ? s.t('submitReview') : s.t('publish')}</Btn></div>
        </>
      )}
    </div>
  );
}

/* ---------------- Course ---------------- */

const COVERS: SceneKind[] = ['neural', 'attention', 'agent', 'diffusion', 'regression', 'tokens'];

export function CreateCourse() {
  const s = useStore();
  const publish = usePublish();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [cover, setCover] = useState<SceneKind | null>(null);
  const [topic, setTopic] = useState<TopicId | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [adding, setAdding] = useState(false);
  const { handle, rowStyle, dragIdx } = useReorder(lessons, setLessons, 72);
  const ok0 = title.trim() && cover && topic;
  const doPublish = () => {
    const id = `new-c${Date.now()}`;
    s.addMyCourse({ id, title: { en: title, bn: title }, creatorId: 'me', topic: topic!, desc: { en: desc, bn: desc }, level: 'beginner', lessons, learners: 0, rating: 5, cover: cover!, lang: 'mixed' });
    publish(s.t('course'), id);
  };
  return (
    <div className="screen-col">
      <FlowHeader title={step === 0 ? s.t('newCourse') : s.t('courseLessons')} step={step} steps={2} onBack={() => setStep(0)} dirty={!!title} />
      {step === 0 ? (
        <>
          <div className="scroll pad">
            <Field label={s.t('title')}><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Intro to Neural Nets" /></Field>
            <Field label={s.t('description')} count={`${desc.length}/80`}><textarea rows={2} maxLength={80} value={desc} onChange={(e) => setDesc(e.target.value)} /></Field>
            <Field group label={s.t('coverImage')}>
              <div className="cover-pick">
                {COVERS.map((k) => (
                  <button key={k} className={`cover-opt tap ${cover === k ? 'on' : ''}`} style={{ ['--h' as string]: SCENE_BG[k] }} onClick={() => setCover(k)} aria-pressed={cover === k}>
                    <Scene kind={k} playing={false} />
                    {cover === k && <span className="cover-check"><Check size={14} strokeWidth={3} /></span>}
                  </button>
                ))}
                <button className="cover-opt upload tap" onClick={() => setCover('loss')}><Upload size={20} /><span>{s.t('upload')}</span></button>
              </div>
            </Field>
            <Field group label={s.t('topic')}>
              <div className="chip-row wrap">{TOPICS.map((t) => <Chip key={t.id} active={topic === t.id} onClick={() => setTopic(t.id)}>#{t.tag}</Chip>)}</div>
            </Field>
          </div>
          <div className="bottom-bar"><Btn block size="lg" disabled={!ok0} onClick={() => setStep(1)}>{s.t('next')} <ArrowRight size={18} /></Btn></div>
        </>
      ) : (
        <>
          <div className="scroll pad">
            <div className="course-draft-head">
              <span className="ro-thumb lg" style={{ ['--h' as string]: SCENE_BG[cover!] }}><Scene kind={cover!} playing={false} /></span>
              <span><b>{title}</b><span className="muted">{digits(s.lang, lessons.length)} {s.t('lessons')}</span></span>
            </div>
            {lessons.length > 1 && <div className="hint-line"><GripVertical size={16} /> {s.t('dragToReorder')}</div>}
            <div className="reorder-list">
              {lessons.map((l, i) => (
                <div key={l.id} className={`reorder-row ${dragIdx === i ? 'dragging' : ''}`} style={rowStyle(i)}>
                  <span className="ro-num">{digits(s.lang, i + 1)}</span>
                  <span className="ro-type"><LessonTypeIcon type={l.type} size={18} /></span>
                  <span className="ro-label">{s.x(l.title)}{l.quiz && <small><Zap size={12} /> {s.t('quizHint')}</small>}</span>
                  <button className="icon-btn sm tap" onClick={() => setLessons(lessons.filter((x) => x.id !== l.id))} aria-label={s.t('remove')}><Trash2 size={17} /></button>
                  <span className="drag-handle" {...handle(i)} aria-label={s.t('dragToReorder')}><GripVertical size={20} /></span>
                </div>
              ))}
            </div>
            <button className="add-lesson tap" onClick={() => setAdding(true)}><Plus size={20} /> {s.t('addLesson')}</button>
          </div>
          <div className="bottom-bar"><Btn block size="lg" disabled={!lessons.length} onClick={doPublish}>{s.t('publishCourse')}</Btn></div>
        </>
      )}
      {adding && <AddLessonSheet onClose={() => setAdding(false)} onAdd={(l) => { setLessons([...lessons, l]); setAdding(false); }} n={lessons.length + 1} />}
    </div>
  );
}

function AddLessonSheet({ onClose, onAdd, n }: { onClose: () => void; onAdd: (l: Lesson) => void; n: number }) {
  const s = useStore();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<LessonType>('video');
  const [attached, setAttached] = useState(false);
  const [quiz, setQuiz] = useState(false);
  return (
    <Sheet title={`${s.t('lesson')} ${digits(s.lang, n)}`} onClose={onClose}>
      <div className="pad-x">
        <Field label={s.t('lessonTitle')}><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What is a neuron?" autoFocus /></Field>
        <Field group label={s.t('content')}>
          <Seg options={[{ id: 'video', label: <><Video size={15} /> {s.t('video')}</> }, { id: 'note', label: <><FileText size={15} /> {s.t('noteType')}</> }]} value={type as 'video' | 'note'} onChange={(v) => { setType(v); setAttached(false); }} />
        </Field>
        <button className={`attach tap ${attached ? 'on' : ''}`} onClick={() => setAttached(!attached)}>
          {attached ? <><Check size={18} /> {type === 'video' ? 'lesson.mp4, 0:48' : `${s.t('noteType')}, 120 words`}</> : type === 'video' ? <><Upload size={18} /> {s.t('upload')}</> : <><FileText size={18} /> {s.t('write')}</>}
        </button>
        <div className="set-row plain">
          <span className="set-label">{s.t('attachQuiz')}<small>{s.t('optional')}</small></span>
          <Toggle on={quiz} onChange={setQuiz} label={s.t('attachQuiz')} />
        </div>
        <Btn block size="lg" disabled={!title.trim()} onClick={() => onAdd({ id: `l${Date.now()}`, title: { en: title, bn: title }, type, min: type === 'video' ? 8 : 5, quiz: quiz ? 'q-nn1' : undefined })}>{s.t('add')}</Btn>
      </div>
    </Sheet>
  );
}

/* ---------------- Research ---------------- */

export function CreateResearch() {
  const s = useStore();
  const publish = usePublish();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [problem, setProblem] = useState('');
  const [idea, setIdea] = useState('');
  const [take, setTake] = useState('');
  const [topic, setTopic] = useState<TopicId | null>('research');
  const [diagram, setDiagram] = useState<SceneKind | null>(null);
  const ok = title.trim() && url.trim() && problem.trim() && idea.trim() && take.trim();
  const doPublish = () => {
    const id = `new-p${Date.now()}`;
    s.addMyPaper({ id, title, source: url.replace(/^https?:\/\//, '').split('/')[0] || 'arxiv.org', authors: s.x(s.me.name), year: 2026, topic: topic || 'research', creatorId: 'me', problem, keyIdea: idea, takeaway: take, scene: diagram || undefined, url, readMin: 2, saves: 0, lang: 'mixed' });
    publish(s.t('researchSummary'), id);
  };
  const Req = <span className="req">{s.t('required')}</span>;
  return (
    <div className="screen-col">
      <FlowHeader title={s.t('newResearch')} step={0} steps={1} onBack={s.back} dirty={!!title} />
      <div className="scroll pad">
        <Field label={s.t('paperTitle')} hint={Req}><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Attention Is All You Need" /></Field>
        <Field label={s.t('sourceLink')} hint={Req}><input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://arxiv.org/abs/..." autoCapitalize="none" inputMode="url" /></Field>
        <div className="pb-fields">
          <Field label={`1  ${s.t('problem')}`} hint={Req} count={`${problem.length}/140`}><textarea rows={2} maxLength={140} value={problem} onChange={(e) => setProblem(e.target.value)} /></Field>
          <Field label={`2  ${s.t('keyIdea')}`} hint={Req} count={`${idea.length}/140`}><textarea rows={2} maxLength={140} value={idea} onChange={(e) => setIdea(e.target.value)} /></Field>
          <Field label={`3  ${s.t('takeaway')}`} hint={Req} count={`${take.length}/140`}><textarea rows={2} maxLength={140} value={take} onChange={(e) => setTake(e.target.value)} /></Field>
        </div>
        <Field group label={s.t('diagramUpload')} hint={<span className="opt">{s.t('optional')}</span>}>
          {diagram ? (
            <div className="diagram-prev" style={{ ['--h' as string]: SCENE_BG[diagram] }}>
              <Scene kind={diagram} />
              <button className="icon-btn sm tap chip-x" onClick={() => setDiagram(null)} aria-label={s.t('remove')}><X size={16} /></button>
            </div>
          ) : (
            <button className="attach tap" onClick={() => setDiagram('attention')}><Upload size={18} /> {s.t('uploadDiagram')}</button>
          )}
        </Field>
        <Field group label={s.t('topic')}>
          <div className="chip-row wrap">{TOPICS.map((t) => <Chip key={t.id} active={topic === t.id} onClick={() => setTopic(t.id)}>#{t.tag}</Chip>)}</div>
        </Field>
      </div>
      <div className="bottom-bar"><Btn block size="lg" disabled={!ok} onClick={doPublish}>{s.demo.preReview ? s.t('submitReview') : s.t('publish')}</Btn></div>
    </div>
  );
}