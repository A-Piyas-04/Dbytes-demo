import React, { useState } from 'react';
import {
  Bell, Bookmark, Camera, ChevronRight, Flag, Globe, KeyRound, Link2, LogOut, Mail, MoreHorizontal, Send, Settings, Shield, Trash2, TrendingUp, UserX, Users, Ban, Trophy, CircleAlert, ImagePlus, Check, Copy, MessageCircle, Layers, FileText,
} from 'lucide-react';
import { CREATORS, QUIZZES, type Post } from '../data';
import { useStore, creatorOf, findCourse } from '../store';
import { compact, digits } from '../i18n';
import { Avatar, Btn, Chip, CreatorRow, Empty, FollowBtn, Header, Name, Progress, Seg, Sheet, Stat, Toggle, KindIcon } from '../ui';
import { PaperCard, Tile, openPost } from './explore';
import { CourseRow, courseProgress } from './learn';
import { Scene, SCENE_BG } from '../scenes';

export function ProfileScreen() {
  return <ProfileView id="me" />;
}

export function CreatorScreen({ id }: { id: string }) {
  return <ProfileView id={id} />;
}

function ProfileView({ id }: { id: string }) {
  const s = useStore();
  const own = id === 'me';
  const c = creatorOf(s, id);
  const [tab, setTab] = useState<'posts' | 'courses' | 'research'>('posts');
  const posts = s.allPosts.filter((p) => p.creatorId === id && (own || s.visible(p)));
  const courses = s.allCourses.filter((x) => x.creatorId === id);
  const papers = s.allPapers.filter((p) => p.creatorId === id);
  const followers = own ? c.followers : c.followers + (s.isFollowing(id) ? 1 : 0);
  const following = own ? s.follows.length : c.following;

  return (
    <div className="screen-col">
      {own ? (
        <header className="header">
          <div className="header-title left">@{c.handle}</div>
          <div className="header-right">
            <button className="icon-btn tap" onClick={() => s.push('settings')} aria-label={s.t('settings')}><Settings size={22} /></button>
          </div>
        </header>
      ) : (
        <Header
          title={`@${c.handle}`}
          right={<button className="icon-btn tap" onClick={() => s.setSheet({ name: 'creatorMore', params: { id } })} aria-label="More"><MoreHorizontal size={22} /></button>}
        />
      )}
      <div className="scroll">
        <div className="profile-head pad">
          <div className="ph-top">
            <Avatar c={c} size={84} ring />
            <div className="ph-stats">
              <Stat n={digits(s.lang, posts.length)} label={s.t('posts')} />
              <Stat n={compact(s.lang, followers)} label={s.t('followers')} onClick={() => s.push('followList', { id, type: 'followers' })} />
              <Stat n={compact(s.lang, following)} label={s.t('following')} onClick={() => s.push('followList', { id, type: 'following' })} />
            </div>
          </div>
          <Name c={c} className="ph-name" />
          <div className="ph-bio">{s.x(c.bio)}</div>
          <div className="ph-actions">
            {own ? (
              <Btn variant="secondary" block onClick={() => s.push('editProfile')}>{s.t('editProfile')}</Btn>
            ) : (
              <>
                <FollowBtn id={id} size="md" />
                {s.demo.dms && <Btn variant="secondary" icon={<MessageCircle size={18} />} onClick={() => s.push('dm', { id })}>{s.t('message')}</Btn>}
              </>
            )}
          </div>
          {own && (
            <div className="ph-shortcuts">
              <button className="shortcut tap" onClick={() => s.push('saved')}><Bookmark size={20} /><span>{s.t('savedItems')}</span></button>
              <button className="shortcut tap" onClick={() => s.push('progress')}><TrendingUp size={20} /><span>{s.t('progress')}</span></button>
              <button className="shortcut tap" onClick={() => s.push('followList', { id: 'me', type: 'following' })}><Users size={20} /><span>{s.t('following')}</span></button>
            </div>
          )}
        </div>
        <div className="sticky-seg">
          <Seg
            variant="tabs"
            options={[{ id: 'posts', label: s.t('posts') }, { id: 'courses', label: s.t('courses') }, { id: 'research', label: s.t('research') }]}
            value={tab}
            onChange={setTab}
          />
        </div>
        {tab === 'posts' && (posts.length ? <div className="grid3 flush">{posts.map((p) => <Tile key={p.id} p={p} />)}</div> : <Empty icon={<ImagePlus size={28} />} title={s.t('posts')} />)}
        {tab === 'courses' && (
          <div className="list pad">
            {courses.length ? courses.map((x) => <CourseRow key={x.id} c={x} />) : (
              <Empty icon={<Layers size={28} />} title={s.t('noCourses')} action={own ? <Btn onClick={() => s.push('createCourse')}>{s.t('createCourse')}</Btn> : undefined} />
            )}
          </div>
        )}
        {tab === 'research' && (
          <div className="list pad">
            {papers.length ? papers.map((p) => <PaperCard key={p.id} p={p} />) : <Empty icon={<FileText size={28} />} title={s.t('noResearch')} />}
          </div>
        )}
        <div className="bottom-space" />
      </div>
    </div>
  );
}

export function CreatorMoreSheet({ id }: { id: string }) {
  const s = useStore();
  const c = creatorOf(s, id);
  return (
    <Sheet onClose={() => s.setSheet(null)}>
      <button className="sheet-row tap danger" onClick={() => {
        s.setSheet(null);
        s.setDialog({
          title: `${s.t('block')} ${s.x(c.name)}?`, confirm: s.t('block'), danger: true,
          onConfirm: () => { s.setBlocked([...s.blocked, id]); if (s.isFollowing(id)) s.toggleFollow(id); s.back(); s.toast(s.t('blocked')); },
        });
      }}><Ban size={20} /> {s.t('block')}</button>
      <button className="sheet-row tap danger" onClick={() => s.setSheet({ name: 'report', params: { id } })}><Flag size={20} /> {s.t('report')}</button>
      <button className="sheet-row tap" onClick={() => { s.setSheet(null); s.toast(s.t('linkCopied')); }}><Copy size={20} /> {s.t('copyLink')}</button>
    </Sheet>
  );
}

export function FollowListScreen({ id, type }: { id: string; type: 'followers' | 'following' }) {
  const s = useStore();
  const [seg, setSeg] = useState(type);
  const ids = id === 'me'
    ? seg === 'following' ? s.follows : ['farhana', 'mehedi', 'tanvir', 'rafi', 'sadia']
    : seg === 'following' ? CREATORS.filter((c) => c.id !== id).slice(0, 5).map((c) => c.id) : CREATORS.filter((c) => c.id !== id).map((c) => c.id);
  return (
    <div className="screen-col">
      <Header title={`@${creatorOf(s, id).handle}`} />
      <div className="pad-x"><Seg options={[{ id: 'followers', label: s.t('followers') }, { id: 'following', label: s.t('following') }]} value={seg} onChange={setSeg} variant="tabs" /></div>
      <div className="scroll pad">
        {ids.length ? ids.map((cid) => <CreatorRow key={cid} id={cid} sub={`@${creatorOf(s, cid).handle}`} right={<FollowBtn id={cid} />} />) : (
          <Empty icon={<Users size={28} />} title={s.t('noFollows')} action={<Btn onClick={() => { s.setExploreSeg('creators'); s.setTab('explore'); }}>{s.t('exploreCreators')}</Btn>} />
        )}
      </div>
    </div>
  );
}

export function SavedScreen() {
  const s = useStore();
  const [f, setF] = useState<'all' | 'reel' | 'image' | 'note' | 'paper' | 'course'>('all');
  const ids = Array.from(s.saves);
  const items = ids.map((id) => {
    const p = s.allPosts.find((x) => x.id === id);
    if (p) return { type: p.kind as string, id, p };
    const pa = s.allPapers.find((x) => x.id === id);
    if (pa) return { type: 'paper', id, pa };
    const c = findCourse(s, id);
    if (c) return { type: 'course', id, c };
    return null;
  }).filter(Boolean) as { type: string; id: string; p?: Post; pa?: ReturnType<typeof s.allPapers.find>; c?: ReturnType<typeof findCourse> }[];
  const shown = items.filter((i) => f === 'all' || i.type === f);
  const filters = [
    ['all', s.t('all_types')], ['reel', s.t('reels')], ['image', s.t('images')], ['note', s.t('notesT')], ['paper', s.t('papersT')], ['course', s.t('coursesT')],
  ] as const;
  return (
    <div className="screen-col">
      <Header title={s.t('savedItems')} />
      <div className="chip-row pad-x">{filters.map(([id, l]) => <Chip key={id} active={f === id} onClick={() => setF(id)}>{l}</Chip>)}</div>
      <div className="scroll pad">
        {!shown.length && <Empty icon={<Bookmark size={28} />} title={s.t('noSaved')} />}
        <div className="list">
          {shown.map((i) => {
            if (i.p) {
              const p = i.p;
              const sc = p.kind === 'reel' ? p.scene : p.kind === 'image' ? p.slides[0].scene : null;
              return (
                <button key={i.id} className="res-row tap" onClick={() => openPost(s, p)}>
                  <span className="res-thumb" style={sc ? { ['--h' as string]: SCENE_BG[sc] } : undefined}>{sc ? <Scene kind={sc} dark={p.kind === 'reel'} playing={false} /> : <KindIcon kind="note" />}</span>
                  <span className="res-text"><b>{p.kind === 'note' ? s.x(p.title) : s.x(p.caption)}</b><span className="sub"><KindIcon kind={p.kind === 'image' && p.slides.length > 1 ? 'carousel' : p.kind} size={12} /> {s.x(creatorOf(s, p.creatorId).name)}</span></span>
                  <Bookmark size={18} className="saved-mark" fill="currentColor" />
                </button>
              );
            }
            if (i.pa) return <PaperCard key={i.id} p={i.pa} />;
            if (i.c) return <CourseRow key={i.id} c={i.c} />;
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

export function ProgressScreen() {
  const s = useStore();
  const started = s.allCourses.filter((c) => (s.done[c.id]?.length || 0) > 0);
  const [seg, setSeg] = useState<'courses' | 'quiz'>('courses');
  return (
    <div className="screen-col">
      <Header title={s.t('learningProgress')} />
      <div className="pad-x"><Seg options={[{ id: 'courses', label: s.t('courses') }, { id: 'quiz', label: s.t('quizHistory') }]} value={seg} onChange={setSeg} /></div>
      <div className="scroll pad">
        {seg === 'courses' ? (
          <div className="list">
            {started.map((c) => {
              const p = courseProgress(s, c);
              return (
                <button key={c.id} className="progress-row tap" onClick={() => s.push('course', { id: c.id })}>
                  <span className="pr-top">
                    <b>{s.x(c.title)}</b>
                    <span className={`status ${p === 1 ? 'done' : ''}`}>{p === 1 ? <><Check size={13} /> {s.t('completed')}</> : s.t('inProgress')}</span>
                  </span>
                  <Progress value={p} />
                  <span className="pr-meta">{digits(s.lang, s.done[c.id].length)}/{digits(s.lang, c.lessons.length)} {s.t('lessons')} <span className="dot-sep" /> {digits(s.lang, Math.round(p * 100))}%</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="list">
            {s.quizHistory.map((h, i) => {
              const q = QUIZZES.find((x) => x.id === h.setId)!;
              const pct = h.score / h.total;
              return (
                <button key={i} className="quiz-row tap" onClick={() => s.push('quiz', { id: q.id })}>
                  <span className={`qr-score ${pct >= 0.75 ? 'hi' : pct >= 0.5 ? 'mid' : 'lo'}`}>{digits(s.lang, Math.round(pct * 100))}%</span>
                  <span className="qr-body"><span className="qr-title">{s.x(q.title)}</span><span className="qr-meta">{digits(s.lang, h.score)}/{digits(s.lang, h.total)} {s.t('correctCount')} <span className="dot-sep" /> {h.when}</span></span>
                  <Trophy size={18} className={pct === 1 ? 'gold' : 'muted'} />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function EditProfileScreen() {
  const s = useStore();
  const [name, setName] = useState(s.x(s.me.name));
  const [handle, setHandle] = useState(s.me.handle);
  const [bio, setBio] = useState(s.x(s.me.bio));
  const [hue, setHue] = useState(s.me.hue);
  const save = () => {
    s.setMe({ ...s.me, name: { en: name, bn: name }, handle, bio: { en: bio, bn: bio }, hue, initials: name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() });
    s.toast(s.t('profileSaved'));
    s.back();
  };
  return (
    <div className="screen-col">
      <Header title={s.t('editProfile')} right={<button className="link-btn strong tap" onClick={save}>{s.t('save')}</button>} />
      <div className="scroll pad">
        <div className="edit-avatar">
          <Avatar c={{ ...s.me, hue }} size={96} ring />
          <button className="link-btn tap" onClick={() => setHue((h) => (h + 47) % 360)}><Camera size={16} /> {s.t('changePhoto')}</button>
        </div>
        <Field label={s.t('name')}><input value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label={s.t('username')}><div className="input-prefix"><span>@</span><input value={handle} onChange={(e) => setHandle(e.target.value.replace(/\s/g, ''))} autoCapitalize="none" autoCorrect="off" /></div></Field>
        <Field label={s.t('bio')} count={`${bio.length}/80`}><textarea value={bio} maxLength={80} rows={2} onChange={(e) => setBio(e.target.value)} /></Field>
        <Btn block size="lg" onClick={save}>{s.t('saveChanges')}</Btn>
      </div>
    </div>
  );
}

export function Field({ label, children, count, hint, group }: { label: string; children: React.ReactNode; count?: string; hint?: React.ReactNode; group?: boolean }) {
  const head = <span className="field-label">{label}{hint && <span className="field-hint">{hint}</span>}{count && <span className="field-count">{count}</span>}</span>;
  if (group) return <div className="field" role="group" aria-label={label}>{head}{children}</div>;
  return <label className="field">{head}{children}</label>;
}

/* ---------------- Settings ---------------- */

function Row({ icon, label, value, onClick, danger }: { icon: React.ReactNode; label: string; value?: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button className={`set-row tap ${danger ? 'danger' : ''}`} onClick={onClick}>
      <span className="set-icon">{icon}</span>
      <span className="set-label">{label}</span>
      {value && <span className="set-value">{value}</span>}
      {!danger && <ChevronRight size={18} className="muted" />}
    </button>
  );
}

export function SettingsScreen() {
  const s = useStore();
  const cl = s.contentLang === 'all' ? s.t('all') : s.contentLang === 'bn' ? s.t('bangla') : s.t('english');
  return (
    <div className="screen-col">
      <Header title={s.t('settings')} />
      <div className="scroll pad">
        <div className="set-group">
          <Row icon={<Globe size={19} />} label={s.t('language')} value={cl} onClick={() => s.push('setLanguage')} />
          <Row icon={<Mail size={19} />} label={s.t('account')} onClick={() => s.push('setAccount')} />
          <Row icon={<Bell size={19} />} label={s.t('notifications')} onClick={() => s.push('setNotif')} />
          <Row icon={<Shield size={19} />} label={s.t('privacy')} onClick={() => s.push('setPrivacy')} />
        </div>
        <div className="set-group">
          <Row icon={<CircleAlert size={19} />} label={s.t('reportProblem')} onClick={() => s.push('setReport')} />
          <Row icon={<UserX size={19} />} label={s.t('blockList')} value={digits(s.lang, s.blocked.length)} onClick={() => s.push('setBlock')} />
        </div>
        <div className="set-group">
          <Row icon={<Trash2 size={19} />} label={s.t('deleteAccount')} danger onClick={() => s.push('setDelete')} />
          <Row icon={<LogOut size={19} />} label={s.t('logout')} danger onClick={() => s.setDialog({ title: s.t('logoutQ'), confirm: s.t('logout'), danger: true, onConfirm: () => s.setAuthed(false) })} />
        </div>
        <div className="version">Doshomik Bytes v0.1 demo</div>
      </div>
    </div>
  );
}

function Radio<T extends string>({ value, options, onChange }: { value: T; options: { id: T; label: string; sub?: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="set-group">
      {options.map((o) => (
        <button key={o.id} className="set-row tap" role="radio" aria-checked={value === o.id} onClick={() => onChange(o.id)}>
          <span className="set-label">{o.label}{o.sub && <small>{o.sub}</small>}</span>
          <span className={`radio ${value === o.id ? 'on' : ''}`} />
        </button>
      ))}
    </div>
  );
}

export function LanguageSettings() {
  const s = useStore();
  return (
    <div className="screen-col">
      <Header title={s.t('language')} />
      <div className="scroll pad">
        <div className="set-caption">{s.t('appLanguage')}</div>
        <Radio value={s.lang} onChange={s.setLang} options={[{ id: 'bn', label: 'বাংলা' }, { id: 'en', label: 'English' }]} />
        <div className="set-caption">{s.t('contentLanguage')}</div>
        <Radio
          value={s.contentLang}
          onChange={(v) => s.setContentLang(v as never)}
          options={[{ id: 'all', label: s.t('all') }, { id: 'bn', label: s.t('bangla'), sub: `+ ${s.t('mixed')}` }, { id: 'en', label: s.t('english'), sub: `+ ${s.t('mixed')}` }]}
        />
      </div>
    </div>
  );
}

export function AccountSettings() {
  const s = useStore();
  const [google, setGoogle] = useState(true);
  return (
    <div className="screen-col">
      <Header title={s.t('account')} />
      <div className="scroll pad">
        <div className="set-group">
          <Row icon={<Mail size={19} />} label={s.t('email')} value="rakib@mail.com" onClick={() => s.toast(s.t('email'))} />
          <Row icon={<KeyRound size={19} />} label={s.t('changePassword')} onClick={() => s.toast(s.t('sent'))} />
        </div>
        <div className="set-caption">{s.t('linkedAccounts')}</div>
        <div className="set-group">
          <div className="set-row">
            <span className="set-icon google">G</span>
            <span className="set-label">Google<small>{google ? s.t('connected') : ''}</small></span>
            <Btn size="sm" variant={google ? 'secondary' : 'primary'} onClick={() => setGoogle(!google)}>{google ? s.t('remove') : s.t('connect')}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotifSettings() {
  const s = useStore();
  const n = s.notif;
  const rows: [keyof typeof n, string][] = [['likes', s.t('likesN')], ['comments', s.t('commentsN')], ['follows', s.t('followsN')], ['course', s.t('courseUpdates')]];
  return (
    <div className="screen-col">
      <Header title={s.t('notifications')} />
      <div className="scroll pad">
        <div className="set-group">
          {rows.map(([k, l]) => (
            <div className="set-row" key={k}>
              <span className="set-label">{l}</span>
              <Toggle on={n[k]} label={l} onChange={(v) => s.setNotif({ ...n, [k]: v })} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PrivacySettings() {
  const s = useStore();
  const opts = [{ id: 'everyone', label: s.t('everyone') }, { id: 'followers', label: s.t('followersOnly') }, { id: 'none', label: s.t('noOne') }];
  return (
    <div className="screen-col">
      <Header title={s.t('privacy')} />
      <div className="scroll pad">
        <div className="set-caption">{s.t('whoComment')}</div>
        <Radio value={s.privacy.comment} options={opts} onChange={(v) => s.setPrivacy({ ...s.privacy, comment: v })} />
        {s.demo.dms && (
          <>
            <div className="set-caption">{s.t('whoMessage')}</div>
            <Radio value={s.privacy.message} options={opts} onChange={(v) => s.setPrivacy({ ...s.privacy, message: v })} />
          </>
        )}
      </div>
    </div>
  );
}

export function ReportProblem() {
  const s = useStore();
  const [cat, setCat] = useState('bug');
  const [text, setText] = useState('');
  const [shot, setShot] = useState(false);
  return (
    <div className="screen-col">
      <Header title={s.t('reportProblem')} />
      <div className="scroll pad">
        <Field group label={s.t('category')}>
          <div className="chip-row wrap">
            {(['bug', 'contentIssue', 'accountIssue', 'other'] as const).map((k) => <Chip key={k} active={cat === k} onClick={() => setCat(k)}>{s.t(k)}</Chip>)}
          </div>
        </Field>
        <Field label={s.t('details')} count={`${text.length}/300`}>
          <textarea rows={5} maxLength={300} value={text} placeholder={s.t('detailsPh')} onChange={(e) => setText(e.target.value)} />
        </Field>
        <button className={`attach tap ${shot ? 'on' : ''}`} onClick={() => setShot(!shot)}>
          {shot ? <Check size={18} /> : <ImagePlus size={18} />} {s.t('attachScreenshot')}
        </button>
        <Btn block size="lg" icon={<Send size={18} />} disabled={!text.trim()} onClick={() => { s.toast(s.t('sent')); s.back(); }}>{s.t('send')}</Btn>
      </div>
    </div>
  );
}

export function BlockList() {
  const s = useStore();
  return (
    <div className="screen-col">
      <Header title={s.t('blockList')} />
      <div className="scroll pad">
        {!s.blocked.length && <Empty icon={<UserX size={28} />} title={s.t('noBlocked')} />}
        {s.blocked.map((id) => {
          const known = CREATORS.find((c) => c.id === id);
          return (
            <div className="creator-row" key={id}>
              <div className="creator-row-main">
                {known ? <Avatar c={known} size={44} /> : <span className="avatar ghost" style={{ width: 44, height: 44 }}><UserX size={18} /></span>}
                <span className="creator-row-text">
                  <span className="name">{known ? s.x(known.name) : 'spam.bot'}</span>
                  <span className="sub">@{known ? known.handle : 'spam.bot'}</span>
                </span>
              </div>
              <Btn size="sm" variant="secondary" onClick={() => s.setBlocked(s.blocked.filter((b) => b !== id))}>{s.t('unblock')}</Btn>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DeleteAccount() {
  const s = useStore();
  const [txt, setTxt] = useState('');
  return (
    <div className="screen-col">
      <Header title={s.t('deleteAccount')} />
      <div className="scroll pad">
        <div className="danger-card">
          <Trash2 size={28} />
          <h2>{s.t('deleteTitle')}</h2>
          <div className="danger-sub">{s.t('deleteRemoved')}</div>
          <ul>
            <li>{s.t('deletePoints1')}</li>
            <li>{s.t('deletePoints2')}</li>
            <li>{s.t('deletePoints3')}</li>
          </ul>
        </div>
        <Field label={s.t('typeDelete')}>
          <input value={txt} onChange={(e) => setTxt(e.target.value)} autoCapitalize="characters" autoCorrect="off" placeholder="DELETE" />
        </Field>
        <Btn block size="lg" variant="danger" disabled={txt !== 'DELETE'} onClick={() => s.setDialog({ title: s.t('deleteTitle'), confirm: s.t('deleteForever'), danger: true, onConfirm: () => s.setAuthed(false) })}>
          {s.t('deleteForever')}
        </Btn>
      </div>
    </div>
  );
}

export function DMScreen({ id }: { id: string }) {
  const s = useStore();
  const c = creatorOf(s, id);
  const [msgs, setMsgs] = useState<{ me: boolean; t: string }[]>([]);
  const [text, setText] = useState('');
  const send = () => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { me: true, t: text.trim() }]);
    setText('');
    setTimeout(() => setMsgs((m) => [...m, { me: false, t: s.lang === 'bn' ? 'ধন্যবাদ!' : 'Thanks!' }]), 900);
  };
  return (
    <div className="screen-col">
      <Header title={<span className="header-creator"><Avatar c={c} size={28} /> <Name c={c} /></span>} />
      <div className="scroll pad dm">
        {!msgs.length && <Empty icon={<Avatar c={c} size={72} />} title={s.t('sayHi')} />}
        {msgs.map((m, i) => <div key={i} className={`bubble ${m.me ? 'me' : ''}`}>{m.t}</div>)}
      </div>
      <div className="comment-input">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder={s.t('typeMsg')} onKeyDown={(e) => e.key === 'Enter' && send()} enterKeyHint="send" />
        <button className="send-btn tap" onClick={send} disabled={!text.trim()} aria-label={s.t('send')}><Send size={18} /></button>
      </div>
    </div>
  );
}