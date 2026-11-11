import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Bookmark, Clock, ExternalLink, Heart, Lightbulb, MessageCircle, Share2, Target, UserPlus, Layers, Mail, Eye, EyeOff, CircleHelp } from 'lucide-react';
import { useStore, creatorOf, findPaper, findPost, type Store } from '../store';
import { compact, digits } from '../i18n';
import { Scene, SCENE_BG } from '../scenes';
import { Markdown } from '../markdown';
import { Avatar, Btn, FollowBtn, Header, Name, TopicTag, openCreator, Wordmark, LangToggle } from '../ui';
import { ActionRow, ImageCard, NoteCard, ReelCard } from './home';
import type { Activity } from '../data';

export function ActivityScreen() {
  const s = useStore();
  useEffect(() => () => s.setActivityRead(true), []);
  const groups: [string, Activity[]][] = [
    [s.t('today'), s.activity.filter((a) => a.unread)],
    [s.t('earlier'), s.activity.filter((a) => !a.unread)],
  ];
  const go = (a: Activity) => {
    const { screen, params } = a.target;
    if (screen === 'post') {
      const p = findPost(s, params!.id as string);
      if (p?.kind === 'note') s.push('note', params);
      else if (p?.kind === 'reel') s.push('reel', params);
      else s.push('post', params);
    } else s.push(screen, params);
  };
  return (
    <div className="screen-col">
      <Header title={s.t('activity')} right={<button className="link-btn tap" onClick={() => s.setActivityRead(true)}>{s.t('unread')}</button>} />
      <div className="scroll">
        {groups.map(([label, list]) => list.length ? (
          <section key={label}>
            <div className="sec-head pad-x"><h3>{label}</h3></div>
            {list.map((a) => <ActivityRow key={a.id} a={a} onClick={() => go(a)} unread={a.unread && !s.activityRead} />)}
          </section>
        ) : null)}
      </div>
    </div>
  );
}

function ActivityRow({ a, onClick, unread }: { a: Activity; onClick: () => void; unread: boolean }) {
  const s = useStore();
  const c = creatorOf(s, a.who);
  const icon = { like: <Heart size={12} fill="currentColor" />, follow: <UserPlus size={12} />, comment: <MessageCircle size={12} fill="currentColor" />, reply: <MessageCircle size={12} />, course: <Layers size={12} /> }[a.kind];
  const verb = { like: s.t('likedYour'), follow: s.t('startedFollowing'), comment: s.t('commented'), reply: s.t('replied'), course: s.t('courseUpdate') }[a.kind];
  return (
    <div className={`act-row ${unread ? 'unread' : ''}`}>
      <button className="act-main tap" onClick={onClick}>
        <span className="act-av">
          <Avatar c={c} size={44} />
          <span className={`act-badge ${a.kind}`}>{icon}</span>
        </span>
        <span className="act-text">
          <span><b>{s.x(c.name)}</b> {verb}{a.text ? ':' : ''} {a.text && <span className="act-quote">{s.x(a.text)}</span>}</span>
          <span className="sub">{s.x(a.time)}</span>
        </span>
      </button>
      {a.kind === 'follow' ? <FollowBtn id={a.who} /> : a.thumb ? (
        <button className="act-thumb tap" onClick={onClick} style={{ ['--h' as string]: SCENE_BG[a.thumb] }} aria-label="Open"><Scene kind={a.thumb} playing={false} /></button>
      ) : null}
    </div>
  );
}

export function NoteReader({ id }: { id: string }) {
  const s = useStore();
  const n = findPost(s, id);
  if (!n || n.kind !== 'note') return null;
  const c = creatorOf(s, n.creatorId);
  const saved = s.saves.has(n.id);
  return (
    <div className="screen-col">
      <Header
        right={<>
          <button className={`icon-btn tap save ${saved ? 'on' : ''}`} onClick={() => s.toggleSave(n.id)} aria-label={s.t('save')} aria-pressed={saved}><Bookmark size={21} fill={saved ? 'currentColor' : 'none'} /></button>
          <button className="icon-btn tap" onClick={() => s.setSheet({ name: 'share', params: { id } })} aria-label={s.t('share')}><Share2 size={21} /></button>
        </>}
      />
      <div className="scroll">
        <article className="reader pad">
          <TopicTag id={n.topic} />
          <h1 className="reader-title">{s.x(n.title)}</h1>
          <div className="reader-by">
            <button className="tap reader-by-main" onClick={() => openCreator(s, c.id)}>
              <Avatar c={c} size={36} />
              <span><Name c={c} /><span className="sub"><Clock size={12} /> {digits(s.lang, n.readMin)} {s.t('minRead')} <span className="dot-sep" /> {s.x(n.time)}</span></span>
            </button>
            <FollowBtn id={c.id} />
          </div>
          <Markdown src={n.body} />
        </article>
        <div className="reader-actions"><ActionRow p={n} /></div>
        <div className="bottom-space" />
      </div>
    </div>
  );
}

export function PaperDetail({ id }: { id: string }) {
  const s = useStore();
  const p = findPaper(s, id)!;
  const c = creatorOf(s, p.creatorId);
  const saved = s.saves.has(p.id);
  const sections = [
    { k: 'problem', icon: <CircleHelp size={18} />, l: s.t('problem'), v: s.x(p.problem) },
    { k: 'idea', icon: <Lightbulb size={18} />, l: s.t('keyIdea'), v: s.x(p.keyIdea) },
    { k: 'take', icon: <Target size={18} />, l: s.t('takeaway'), v: s.x(p.takeaway) },
  ];
  return (
    <div className="screen-col">
      <Header
        title={s.t('paperByte')}
        right={<>
          <button className={`icon-btn tap save ${saved ? 'on' : ''}`} onClick={() => s.toggleSave(p.id)} aria-label={s.t('save')} aria-pressed={saved}><Bookmark size={21} fill={saved ? 'currentColor' : 'none'} /></button>
          <button className="icon-btn tap" onClick={() => s.setSheet({ name: 'share', params: { id } })} aria-label={s.t('share')}><Share2 size={21} /></button>
        </>}
      />
      <div className="scroll">
        <div className="pad paper-detail">
          <TopicTag id={p.topic} />
          <h1 className="pd-title">{p.title}</h1>
          <div className="pd-src">{p.authors}, {p.source}</div>
          <button className="pd-by tap" onClick={() => openCreator(s, c.id)}>
            <Avatar c={c} size={26} /> <span className="muted">{s.t('summarizedBy')}</span> <Name c={c} />
          </button>
          <ol className="pb-sections">
            {sections.map((sec) => (
              <li key={sec.k} className={`pb-sec ${sec.k}`}>
                <span className="pb-label">{sec.icon} {sec.l}</span>
                <p>{sec.v}</p>
              </li>
            ))}
          </ol>
          {p.scene && (
            <figure className="pd-figure" style={{ ['--h' as string]: SCENE_BG[p.scene] }}>
              <Scene kind={p.scene} />
              <figcaption>{s.t('diagram')}</figcaption>
            </figure>
          )}
        </div>
        <div className="bottom-space" />
      </div>
      <div className="bottom-bar">
        <Btn block size="lg" variant="dark" icon={<ExternalLink size={18} />} onClick={() => { s.toast(s.t('openingLink')); window.open(p.url, '_blank', 'noopener'); }}>{s.t('readOriginal')}</Btn>
      </div>
    </div>
  );
}

export function PostDetail({ id }: { id: string }) {
  const s = useStore();
  const p = findPost(s, id);
  if (!p) return null;
  return (
    <div className="screen-col">
      <Header title={s.t('posts')} />
      <div className="scroll">
        {p.kind === 'image' ? <ImageCard p={p} /> : p.kind === 'note' ? <NoteCard n={p} /> : null}
      </div>
    </div>
  );
}

export function ReelPlayer({ id }: { id: string }) {
  const s = useStore();
  const reels = s.allPosts.filter((p) => p.kind === 'reel' && s.visible(p));
  const start = Math.max(0, reels.findIndex((r) => r.id === id));
  const ordered = [...reels.slice(start), ...reels.slice(0, start)];
  return (
    <div className="screen-col reel-player">
      <div className="feed scroll snap">
        {ordered.map((r) => r.kind === 'reel' && <ReelCard key={r.id} r={r} full />)}
      </div>
    </div>
  );
}

export function SignIn() {
  const s = useStore();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'choose' | 'email'>('choose');
  return (
    <div className="signin">
      <div className="si-top"><LangToggle /></div>
      <div className="si-hero">
        <div className="si-scene"><Scene kind="neural" dark /></div>
        <Wordmark size={34} />
        <p className="si-tag">{s.t('tagline')}</p>
      </div>
      <div className="si-actions">
        {mode === 'choose' ? (
          <>
            <Btn block size="lg" variant="secondary" icon={<span className="g-logo">G</span>} onClick={() => s.jump('home')}>{s.t('google')}</Btn>
            <Btn block size="lg" icon={<Mail size={18} />} onClick={() => setMode('email')}>{s.t('withEmail')}</Btn>
            <div className="si-foot">{s.t('newHere')} <button className="link-btn strong tap" onClick={() => setMode('email')}>{s.t('createAccount')}</button></div>
          </>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); s.jump('home'); }}>
            <label className="field"><span className="field-label">{s.t('email')}</span><input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@mail.com" /></label>
            <label className="field">
              <span className="field-label">{s.t('password')}</span>
              <div className="input-prefix">
                <input type={show ? 'text' : 'password'} autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} />
                <button type="button" className="icon-btn sm tap" onClick={() => setShow(!show)} aria-label="Show password">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </label>
            <Btn block size="lg" type="submit" disabled={!email || !pw}>{s.t('signIn')}</Btn>
            <button type="button" className="link-btn tap center" onClick={() => setMode('choose')}>{s.t('back')}</button>
          </form>
        )}
      </div>
    </div>
  );
}