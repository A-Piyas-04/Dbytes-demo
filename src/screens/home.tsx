import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, Bookmark, Copy, EyeOff, Flag, Heart, Link2, MessageCircle, MoreHorizontal, Pause, Send, Share2, Users, Volume2, VolumeX, ArrowLeft, Mail, Globe, MessageSquare,
} from 'lucide-react';
import { FEED_ORDER, TOPICS, type ImagePost, type NotePost, type Post, type Reel, COMMENT_POOL } from '../data';
import { useStore, findPost, creatorOf, findCourse, findPaper } from '../store';
import { compact, clock } from '../i18n';
import { Scene, SCENE_BG } from '../scenes';
import { Inline } from '../markdown';
import { Avatar, Empty, FollowBtn, Name, Seg, Sheet, TopBar, TopicTag, openCreator, useInView, useActive, Btn } from '../ui';

export function HomeScreen() {
  const s = useStore();
  const [feed, setFeed] = useState<'foryou' | 'following'>('foryou');
  const fresh = s.myPosts.filter((p) => p.id.startsWith('new'));
  const base = FEED_ORDER.map((id) => findPost(s, id)!).filter(Boolean);
  const forYou = [...fresh, ...base].filter(s.visible);
  const following = base.filter((p) => s.follows.includes(p.creatorId)).filter(s.visible);
  const items = feed === 'foryou' ? forYou : following;
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => { scroller.current?.scrollTo({ top: 0 }); }, [feed]);

  return (
    <div className="screen-col">
      <TopBar />
      <div className="feed-toggle">
        <Seg
          options={[{ id: 'foryou', label: s.t('forYou') }, { id: 'following', label: s.t('following') }]}
          value={feed}
          onChange={setFeed}
          variant="tabs"
        />
      </div>
      <div className="feed scroll" ref={scroller}>
        {feed === 'following' && s.follows.length === 0 ? (
          <div className="prompt-card">
            <div className="prompt-avatars">
              {['nusrat', 'farhana', 'sadia'].map((id) => <Avatar key={id} c={creatorOf(s, id)} size={44} ring />)}
            </div>
            <div className="prompt-title">{s.t('noFollows')}</div>
            <Btn icon={<Users size={18} />} onClick={() => { s.setExploreSeg('creators'); s.setTab('explore'); }}>{s.t('exploreCreators')}</Btn>
          </div>
        ) : (
          items.map((p) => <FeedItem key={p.id} p={p} />)
        )}
        {items.length > 0 && <div className="feed-end"><span className="wm-dot" /></div>}
      </div>
    </div>
  );
}

export function FeedItem({ p }: { p: Post }) {
  if (p.kind === 'reel') return <ReelCard r={p} />;
  if (p.kind === 'image') return <ImageCard p={p} />;
  return <NoteCard n={p} />;
}

/* ---------------- Reel ---------------- */

export function ReelCard({ r, full }: { r: Reel; full?: boolean }) {
  const s = useStore();
  const c = creatorOf(s, r.creatorId);
  const [ref, inView] = useInView<HTMLDivElement>(0.65);
  const [held, setHeld] = useState(false);
  const [time, setTime] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [burst, setBurst] = useState(0);
  const [flash, setFlash] = useState<'mute' | 'unmute' | null>(null);
  const active = useActive();
  const playing = inView && active && !held && !s.sheet && !s.dialog;
  const tapTimer = useRef<number | null>(null);
  const holdTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTime((t) => (t + 0.1 >= r.duration ? 0 : t + 0.1)), 100);
    return () => clearInterval(id);
  }, [playing, r.duration]);
  useEffect(() => { if (!inView || !active) setTime(0); }, [inView, active]);

  const sub = r.subs[Math.min(r.subs.length - 1, Math.floor((time / r.duration) * r.subs.length))];
  const liked = s.likes.has(r.id);
  const saved = s.saves.has(r.id);

  const onTap = () => {
    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
      tapTimer.current = null;
      if (!liked) s.toggleLike(r.id);
      setBurst((b) => b + 1);
      return;
    }
    tapTimer.current = window.setTimeout(() => {
      tapTimer.current = null;
      s.setMuted(!s.muted);
      setFlash(s.muted ? 'unmute' : 'mute');
      setTimeout(() => setFlash(null), 700);
    }, 240);
  };

  const link = r.link;
  const linkLabel = link?.type === 'course' ? s.x(findCourse(s, link.id)?.title) : link ? findPaper(s, link.id)?.title : '';

  return (
    <article className={`reel ${full ? 'full' : ''}`} ref={ref} style={{ ['--h' as string]: SCENE_BG[r.scene] }}>
      <div
        className="reel-video"
        onClick={onTap}
        onPointerDown={() => { holdTimer.current = window.setTimeout(() => setHeld(true), 350); }}
        onPointerUp={() => { if (holdTimer.current) clearTimeout(holdTimer.current); setHeld(false); }}
        onPointerLeave={() => { if (holdTimer.current) clearTimeout(holdTimer.current); setHeld(false); }}
        role="button"
        aria-label={s.x(r.caption)}
      >
        <Scene kind={r.scene} dark playing={playing} />
        <div className="reel-sub" key={s.x(sub)}>{s.x(sub)}</div>
        {held && <div className="reel-center"><Pause size={44} fill="currentColor" /></div>}
        {flash && <div className="reel-center small">{flash === 'mute' ? <VolumeX size={30} /> : <Volume2 size={30} />}</div>}
        {burst > 0 && <Heart key={burst} className="heart-burst" size={110} fill="currentColor" />}
      </div>

      {full && (
        <button className="reel-back icon-btn tap" onClick={s.back} aria-label={s.t('back')}><ArrowLeft size={24} /></button>
      )}
      <button className="reel-mute icon-btn tap" onClick={() => s.setMuted(!s.muted)} aria-label={s.muted ? s.t('unmute') : s.t('mute')}>
        {s.muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
      <div className="reel-time">{clock(s.lang, time)} / {clock(s.lang, r.duration)}</div>

      <div className="reel-rail">
        <RailBtn on={liked} onClick={() => s.toggleLike(r.id)} icon={<Heart size={28} fill={liked ? 'currentColor' : 'none'} />} label={compact(s.lang, r.likes + (liked ? 1 : 0))} cls="like" aria={s.t('like')} />
        <RailBtn onClick={() => s.setSheet({ name: 'comments', params: { id: r.id } })} icon={<MessageCircle size={28} />} label={compact(s.lang, r.comments + (s.extraComments[r.id]?.length || 0))} aria={s.t('comment')} />
        <RailBtn on={saved} onClick={() => s.toggleSave(r.id)} icon={<Bookmark size={28} fill={saved ? 'currentColor' : 'none'} />} label={s.t('save')} cls="save" aria={s.t('save')} />
        <RailBtn onClick={() => s.setSheet({ name: 'share', params: { id: r.id } })} icon={<Share2 size={26} />} label={s.t('share')} aria={s.t('share')} />
      </div>

      <div className="reel-meta">
        <div className="reel-creator">
          <button className="tap reel-creator-btn" onClick={() => openCreator(s, c.id)}>
            <Avatar c={c} size={38} ring />
            <Name c={c} />
          </button>
          {!s.isFollowing(c.id) && <FollowBtn id={c.id} onDark />}
        </div>
        {link && (
          <button className="learn-pill tap" onClick={() => s.push(link.type === 'course' ? 'course' : 'paper', { id: link.id })}>
            <span className="lp-kind">{link.type === 'course' ? s.t('course') : s.t('paperByte')}</span>
            <span className="lp-title">{linkLabel}</span>
            <span className="lp-cta">{s.t('learnMore')} <ArrowRight size={14} /></span>
          </button>
        )}
        <div className={`reel-caption ${expanded ? 'open' : ''}`} onClick={() => setExpanded(!expanded)}>
          <b>{s.x(r.caption)}</b>
          {expanded ? <span> {s.x(r.more)} </span> : null}
          <span className="more-link">{expanded ? s.t('less') : s.t('more')}</span>
        </div>
        <TopicTag id={r.topic} onDark />
      </div>
      <div className="reel-progress"><span style={{ width: `${(time / r.duration) * 100}%` }} /></div>
    </article>
  );
}

function RailBtn({ icon, label, onClick, on, cls = '', aria }: { icon: React.ReactNode; label: string; onClick: () => void; on?: boolean; cls?: string; aria: string }) {
  return (
    <button className={`rail-btn tap ${cls} ${on ? 'on' : ''}`} onClick={onClick} aria-label={aria} aria-pressed={on}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

/* ---------------- Post header + actions ---------------- */

function PostHeader({ p }: { p: Post }) {
  const s = useStore();
  const c = creatorOf(s, p.creatorId);
  return (
    <div className="post-head">
      <button className="post-head-main tap" onClick={() => openCreator(s, c.id)}>
        <Avatar c={c} size={38} />
        <span className="post-head-text">
          <Name c={c} />
          <span className="sub">{s.x(p.time)}</span>
        </span>
      </button>
      <TopicTag id={p.topic} />
      <button className="icon-btn tap" onClick={() => s.setSheet({ name: 'more', params: { id: p.id } })} aria-label="More options">
        <MoreHorizontal size={20} />
      </button>
    </div>
  );
}

export function ActionRow({ p }: { p: Post }) {
  const s = useStore();
  const liked = s.likes.has(p.id);
  const saved = s.saves.has(p.id);
  return (
    <div className="action-row">
      <button className={`act tap like ${liked ? 'on' : ''}`} onClick={() => s.toggleLike(p.id)} aria-pressed={liked} aria-label={s.t('like')}>
        <Heart size={22} fill={liked ? 'currentColor' : 'none'} /> <span>{compact(s.lang, p.likes + (liked ? 1 : 0))}</span>
      </button>
      <button className="act tap" onClick={() => s.setSheet({ name: 'comments', params: { id: p.id } })} aria-label={s.t('comment')}>
        <MessageCircle size={22} /> <span>{compact(s.lang, p.comments + (s.extraComments[p.id]?.length || 0))}</span>
      </button>
      <button className="act tap" onClick={() => s.setSheet({ name: 'share', params: { id: p.id } })} aria-label={s.t('share')}>
        <Send size={21} />
      </button>
      <span className="act-spacer" />
      <button className={`act tap save ${saved ? 'on' : ''}`} onClick={() => s.toggleSave(p.id)} aria-pressed={saved} aria-label={s.t('save')}>
        <Bookmark size={22} fill={saved ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}

/* ---------------- Image / carousel ---------------- */

export function ImageCard({ p }: { p: ImagePost }) {
  const s = useStore();
  const [idx, setIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [burst, setBurst] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const last = useRef(0);
  const onScroll = () => {
    const el = track.current!;
    setIdx(Math.round(el.scrollLeft / el.clientWidth));
  };
  const onTap = () => {
    const now = Date.now();
    if (now - last.current < 280) {
      if (!s.likes.has(p.id)) s.toggleLike(p.id);
      setBurst((b) => b + 1);
    }
    last.current = now;
  };
  return (
    <article className="post-card">
      <PostHeader p={p} />
      <div className="media" onClick={onTap}>
        <div className="carousel" ref={track} onScroll={onScroll}>
          {p.slides.map((sl, i) => (
            <div className="slide" key={i} style={{ ['--h' as string]: SCENE_BG[sl.scene] }}>
              <div className="slide-title">{s.x(sl.title)}</div>
              <Scene kind={sl.scene} />
            </div>
          ))}
        </div>
        {p.slides.length > 1 && <div className="slide-count">{idx + 1}/{p.slides.length}</div>}
        {burst > 0 && <Heart key={burst} className="heart-burst" size={96} fill="currentColor" />}
      </div>
      {p.slides.length > 1 && (
        <div className="dots" aria-hidden="true">
          {p.slides.map((_, i) => <span key={i} className={i === idx ? 'on' : ''} />)}
        </div>
      )}
      <ActionRow p={p} />
      <div className={`caption ${expanded ? 'open' : ''}`} onClick={() => setExpanded(!expanded)}>
        <b>{s.x(p.caption)}</b>{expanded && <> {s.x(p.more)}</>}
        {!expanded && <span className="more-link"> {s.t('more')}</span>}
      </div>
    </article>
  );
}

/* ---------------- Note ---------------- */

export function NoteCard({ n }: { n: NotePost }) {
  const s = useStore();
  return (
    <article className="post-card note-card">
      <PostHeader p={n} />
      <button className="note-body tap-soft" onClick={() => s.push('note', { id: n.id })}>
        <h3 className="note-title">{s.x(n.title)}</h3>
        <p className="note-excerpt"><Inline text={n.excerpt} /></p>
        <span className="note-cta">
          {s.t('readFull')} <ArrowRight size={16} />
          <span className="note-min">{n.readMin} {s.t('minRead')}</span>
        </span>
      </button>
      <ActionRow p={n} />
    </article>
  );
}

/* ---------------- Sheets ---------------- */

export function CommentsSheet({ id }: { id: string }) {
  const s = useStore();
  const [text, setText] = useState('');
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const post = findPost(s, id);
  const list = [...(s.extraComments[id] || []), ...COMMENT_POOL];
  const total = (post?.comments || 0) + (s.extraComments[id]?.length || 0);
  const send = () => { if (!text.trim()) return; s.addComment(id, text.trim()); setText(''); };
  return (
    <Sheet title={<>{s.t('comments')} <span className="muted">{compact(s.lang, total)}</span></>} onClose={() => s.setSheet(null)} tall>
      <div className="comments">
        {list.map((c) => {
          const who = creatorOf(s, c.who);
          const on = liked.has(c.id);
          return (
            <div className="comment" key={c.id}>
              <Avatar c={who} size={34} />
              <div className="comment-body">
                <div className="comment-top"><Name c={who} /> <span className="muted">{s.x(c.time)}</span></div>
                <div className="comment-text">{s.x(c.text)}</div>
                <button className="comment-reply tap">{s.t('reply')}</button>
              </div>
              <button className={`comment-like tap ${on ? 'on' : ''}`} aria-label={s.t('like')} onClick={() => setLiked((l) => { const n = new Set(l); on ? n.delete(c.id) : n.add(c.id); return n; })}>
                <Heart size={16} fill={on ? 'currentColor' : 'none'} />
                <span>{compact(s.lang, c.likes + (on ? 1 : 0))}</span>
              </button>
            </div>
          );
        })}
      </div>
      <div className="comment-input">
        <Avatar c={s.me} size={34} />
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder={s.t('addComment')} onKeyDown={(e) => e.key === 'Enter' && send()} enterKeyHint="send" />
        <button className="send-btn tap" onClick={send} disabled={!text.trim()} aria-label={s.t('send')}><Send size={18} /></button>
      </div>
    </Sheet>
  );
}

export function ShareSheet() {
  const s = useStore();
  const done = (msg: string) => { s.setSheet(null); s.toast(msg); };
  const targets = [
    { icon: <MessageSquare size={22} />, label: s.t('messenger'), hue: 220 },
    { icon: <MessageCircle size={22} />, label: s.t('whatsapp'), hue: 145 },
    { icon: <Globe size={22} />, label: s.t('facebook'), hue: 215 },
    { icon: <Mail size={22} />, label: s.t('email'), hue: 25 },
    { icon: <MoreHorizontal size={22} />, label: s.t('moreApps'), hue: 200 },
  ];
  return (
    <Sheet title={s.t('shareTo')} onClose={() => s.setSheet(null)}>
      <div className="share-row">
        {targets.map((tg) => (
          <button key={tg.label} className="share-target tap" onClick={() => done(s.t('sent'))}>
            <span className="share-icon" style={{ background: `hsl(${tg.hue} 60% 94%)`, color: `hsl(${tg.hue} 60% 34%)` }}>{tg.icon}</span>
            <span>{tg.label}</span>
          </button>
        ))}
      </div>
      <button className="sheet-row tap" onClick={() => done(s.t('linkCopied'))}><Link2 size={20} /> {s.t('copyLink')}</button>
    </Sheet>
  );
}

export function MoreSheet({ id }: { id: string }) {
  const s = useStore();
  return (
    <Sheet onClose={() => s.setSheet(null)}>
      <button className="sheet-row tap danger" onClick={() => s.setSheet({ name: 'report', params: { id } })}><Flag size={20} /> {s.t('report')}</button>
      <button className="sheet-row tap" onClick={() => { s.hidePost(id); s.setSheet(null); s.toast(s.t('hidden')); }}><EyeOff size={20} /> {s.t('notInterested')}</button>
      <button className="sheet-row tap" onClick={() => { s.setSheet(null); s.toast(s.t('linkCopied')); }}><Copy size={20} /> {s.t('copyLink')}</button>
    </Sheet>
  );
}

export function ReportSheet() {
  const s = useStore();
  const reasons = [s.t('rSpam'), s.t('rWrong'), s.t('rHate'), s.t('rCopy'), s.t('rOther')];
  return (
    <Sheet title={s.t('reportReason')} onClose={() => s.setSheet(null)}>
      {reasons.map((r) => (
        <button key={r} className="sheet-row tap" onClick={() => { s.setSheet(null); s.toast(s.t('reported')); }}>
          {r}
        </button>
      ))}
    </Sheet>
  );
}

export const topicLabel = (s: ReturnType<typeof useStore>, id: string) => s.x(TOPICS.find((t) => t.id === id)!.label);
