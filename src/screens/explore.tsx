import React, { useMemo, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Bookmark, Clock, History, Search, X, Eye } from 'lucide-react';
import { CREATORS, RECENT_SEARCHES, SUGGESTED_TOPICS, TOPICS, type Paper, type Post, type TopicId } from '../data';
import { useStore, creatorOf, type Store } from '../store';
import { compact } from '../i18n';
import { Scene, SCENE_BG } from '../scenes';
import { Chip, CreatorRow, FollowBtn, KindIcon, Seg, TopBar, TopicChips, Empty, Header, Avatar, Name } from '../ui';

const thumbScene = (p: Post) => (p.kind === 'reel' ? p.scene : p.kind === 'image' ? p.slides[0].scene : null);

export const openPost = (s: Store, p: Post) => {
  if (p.kind === 'reel') s.push('reel', { id: p.id });
  else if (p.kind === 'note') s.push('note', { id: p.id });
  else s.push('post', { id: p.id });
};

export function Tile({ p }: { p: Post }) {
  const s = useStore();
  const sc = thumbScene(p);
  const kind = p.kind === 'image' ? (p.slides.length > 1 ? 'carousel' : 'image') : p.kind;
  return (
    <button className={`tile tap ${p.kind}`} onClick={() => openPost(s, p)} style={sc ? { ['--h' as string]: SCENE_BG[sc] } : undefined} aria-label={p.kind === 'note' ? s.x(p.title) : s.x(p.caption)}>
      {sc ? <Scene kind={sc} dark={p.kind === 'reel'} playing={false} /> : (
        <div className="tile-note">
          <span className="tile-note-title">{s.x((p as Extract<Post, { kind: 'note' }>).title)}</span>
        </div>
      )}
      <span className="tile-kind"><KindIcon kind={kind} size={14} /></span>
      <span className="tile-views"><Eye size={12} /> {compact(s.lang, p.views)}</span>
    </button>
  );
}

export function PaperCard({ p }: { p: Paper }) {
  const s = useStore();
  const saved = s.saves.has(p.id);
  return (
    <article className="paper-card">
      <button className="paper-main tap-soft" onClick={() => s.push('paper', { id: p.id })}>
        <span className="paper-tag">{s.t('paperByte')}</span>
        <h3 className="paper-title">{p.title}</h3>
        <span className="paper-src">{p.source}, {p.authors}</span>
        <span className="paper-key">
          <span className="paper-key-label">{s.t('keyIdea')}</span>
          {s.x(p.keyIdea)}
        </span>
      </button>
      <div className="paper-foot">
        <button className="paper-by tap" onClick={() => s.push('creator', { id: p.creatorId })}>
          <Avatar c={creatorOf(s, p.creatorId)} size={22} />
          <span>{s.x(creatorOf(s, p.creatorId).name)}</span>
        </button>
        <span className="paper-min"><Clock size={13} /> {p.readMin} {s.t('min')}</span>
        <button className={`icon-btn sm tap save ${saved ? 'on' : ''}`} onClick={() => s.toggleSave(p.id)} aria-label={s.t('save')} aria-pressed={saved}>
          <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
    </article>
  );
}

function matches(q: string, ...fields: (string | { en: string; bn: string } | undefined)[]) {
  const n = q.toLowerCase();
  return fields.some((f) => {
    if (!f) return false;
    if (typeof f === 'string') return f.toLowerCase().includes(n);
    return f.en.toLowerCase().includes(n) || f.bn.includes(q);
  });
}

export function useSearch(q: string) {
  const s = useStore();
  return useMemo(() => {
    if (!q.trim()) return { creators: [], topics: [], posts: [], papers: [] };
    return {
      creators: CREATORS.filter((c) => matches(q, c.name, c.handle, c.bio)),
      topics: TOPICS.filter((t) => matches(q, t.label, t.tag)),
      posts: s.allPosts.filter(s.visible).filter((p) => matches(q, p.kind === 'note' ? p.title : p.caption, p.kind === 'note' ? p.excerpt : p.more, TOPICS.find((t) => t.id === p.topic)!.label)),
      papers: s.allPapers.filter((p) => matches(q, p.title, p.authors, p.keyIdea, p.source)),
    };
  }, [q, s.allPosts, s.allPapers, s.visible]);
}

export function ExploreScreen() {
  const s = useStore();
  const [q, setQ] = useState('');
  const [focus, setFocus] = useState(false);
  const [recent, setRecent] = useState<string[]>(RECENT_SEARCHES);
  const input = useRef<HTMLInputElement>(null);
  const res = useSearch(q);
  const topic = s.exploreTopic;
  const seg = s.exploreSeg;

  const trending = s.allPosts
    .filter((p) => !p.id.startsWith('m') && !p.id.startsWith('new'))
    .filter(s.visible)
    .filter((p) => !topic || p.topic === topic)
    .sort((a, b) => b.views - a.views);
  const papers = s.allPapers.filter((p) => p.creatorId !== 'me' && s.langOk(p.lang)).filter((p) => !topic || p.topic === topic);
  const creators = CREATORS.filter((c) => !topic || creatorTopics[c.id]?.includes(topic));

  const commit = (term: string) => {
    setQ(term);
    setRecent((r) => [term, ...r.filter((x) => x !== term)].slice(0, 6));
  };
  const close = () => { setQ(''); setFocus(false); input.current?.blur(); };

  return (
    <div className="screen-col">
      <TopBar />
      <div className="search-wrap">
        <label className={`search ${focus ? 'focus' : ''}`}>
          <Search size={19} aria-hidden="true" />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocus(true)}
            onKeyDown={(e) => e.key === 'Enter' && q.trim() && commit(q.trim())}
            placeholder={s.t('searchPh')}
            enterKeyHint="search"
            aria-label={s.t('searchPh')}
          />
          {q && <button className="icon-btn sm tap" onClick={() => setQ('')} aria-label={s.t('clear')}><X size={16} /></button>}
        </label>
        {focus && <button className="link-btn tap" onClick={close}>{s.t('cancel')}</button>}
      </div>

      {focus ? (
        <div className="scroll pad">
          {!q.trim() ? (
            <>
              <div className="sec-head"><h3>{s.t('recent')}</h3>{recent.length > 0 && <button className="link-btn tap" onClick={() => setRecent([])}>{s.t('clear')}</button>}</div>
              <div className="chip-row wrap">
                {recent.map((r) => (
                  <Chip key={r} onClick={() => setQ(r)}><History size={14} /> {r}</Chip>
                ))}
              </div>
              <div className="sec-head"><h3>{s.t('suggested')}</h3></div>
              <div className="chip-row wrap">
                {SUGGESTED_TOPICS.map((id) => {
                  const tp = TOPICS.find((t) => t.id === id)!;
                  return <Chip key={id} onClick={() => { s.setExploreTopic(id); close(); }}>#{tp.tag}</Chip>;
                })}
              </div>
            </>
          ) : (
            <SearchResults q={q} res={res} onPick={commit} />
          )}
        </div>
      ) : (
        <div className="scroll">
          <div className="explore-chips"><TopicChips value={topic} onChange={s.setExploreTopic} /></div>
          <div className="pad-x">
            <Seg
              options={[{ id: 'trending', label: s.t('trending') }, { id: 'research', label: s.t('research') }, { id: 'creators', label: s.t('creators') }]}
              value={seg}
              onChange={s.setExploreSeg}
            />
          </div>
          {seg === 'trending' && (
            trending.length ? <div className="grid3">{trending.map((p) => <Tile key={p.id} p={p} />)}</div> : <Empty icon={<Search size={28} />} title={s.t('noResults')} />
          )}
          {seg === 'research' && (
            <div className="list pad">{papers.length ? papers.map((p) => <PaperCard key={p.id} p={p} />) : <Empty icon={<Search size={28} />} title={s.t('noResults')} />}</div>
          )}
          {seg === 'creators' && (
            <div className="list pad">
              {creators.map((c) => (
                <div className="creator-card" key={c.id}>
                  <CreatorRow id={c.id} sub={<>{s.x(c.bio)} <span className="dot-sep" /> {compact(s.lang, c.followers + (s.isFollowing(c.id) ? 1 : 0))} {s.t('followers')}</>} right={<FollowBtn id={c.id} />} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const creatorTopics: Record<string, TopicId[]> = {
  nusrat: ['nn', 'ml', 'dl'], farhana: ['tf', 'llm', 'research'], sadia: ['ml'], tanvir: ['dl', 'nn'],
  rafi: ['agents', 'llm'], arif: ['research', 'llm'], mehedi: ['genai'], doshomik: ['llm', 'ml', 'tf', 'genai', 'agents', 'research', 'dl', 'nn'],
};

function SearchResults({ q, res, onPick }: { q: string; res: ReturnType<typeof useSearch>; onPick: (q: string) => void }) {
  const s = useStore();
  const none = !res.creators.length && !res.topics.length && !res.posts.length && !res.papers.length;
  if (none) return <Empty icon={<Search size={28} />} title={`${s.t('noResults')}: “${q}”`} />;
  const Group = ({ title, n, type, children }: { title: string; n: number; type: string; children: React.ReactNode }) =>
    n ? (
      <section className="res-group">
        <div className="sec-head">
          <h3>{title}</h3>
          {n > 3 && <button className="link-btn tap" onClick={() => { onPick(q); s.push('searchAll', { q, type }); }}>{s.t('seeAll')} <ArrowRight size={14} /></button>}
        </div>
        {children}
      </section>
    ) : null;
  return (
    <div className="results">
      <Group title={s.t('creators')} n={res.creators.length} type="creators">
        {res.creators.slice(0, 3).map((c) => <CreatorRow key={c.id} id={c.id} sub={`@${c.handle}`} right={<FollowBtn id={c.id} />} onClick={() => { onPick(q); s.push('creator', { id: c.id }); }} />)}
      </Group>
      <Group title={s.t('topics')} n={res.topics.length} type="topics">
        <div className="chip-row wrap">
          {res.topics.slice(0, 3).map((t) => <Chip key={t.id} onClick={() => { onPick(q); s.setExploreTopic(t.id); s.push('searchAll', { q: '', type: 'topic', topic: t.id }); }}>#{t.tag}</Chip>)}
        </div>
      </Group>
      <Group title={s.t('reelsPosts')} n={res.posts.length} type="posts">
        {res.posts.slice(0, 3).map((p) => <ResultRow key={p.id} p={p} onPick={() => onPick(q)} />)}
      </Group>
      <Group title={s.t('papers')} n={res.papers.length} type="papers">
        {res.papers.slice(0, 3).map((p) => (
          <button key={p.id} className="res-row tap" onClick={() => { onPick(q); s.push('paper', { id: p.id }); }}>
            <span className="res-icon paper"><KindIcon kind="paper" /></span>
            <span className="res-text"><b>{p.title}</b><span className="sub">{p.source}</span></span>
            <ArrowUpRight size={16} className="muted" />
          </button>
        ))}
      </Group>
    </div>
  );
}

function ResultRow({ p, onPick }: { p: Post; onPick?: () => void }) {
  const s = useStore();
  const sc = thumbScene(p);
  const kind = p.kind === 'image' ? (p.slides.length > 1 ? 'carousel' : 'image') : p.kind;
  return (
    <button className="res-row tap" onClick={() => { onPick?.(); openPost(s, p); }}>
      <span className="res-thumb" style={sc ? { ['--h' as string]: SCENE_BG[sc] } : undefined}>
        {sc ? <Scene kind={sc} dark={p.kind === 'reel'} playing={false} /> : <KindIcon kind="note" />}
      </span>
      <span className="res-text">
        <b>{p.kind === 'note' ? s.x(p.title) : s.x(p.caption)}</b>
        <span className="sub"><KindIcon kind={kind} size={12} /> {s.x(creatorOf(s, p.creatorId).name)}</span>
      </span>
    </button>
  );
}

export function SearchAllScreen({ q, type, topic }: { q: string; type: string; topic?: TopicId }) {
  const s = useStore();
  const res = useSearch(q);
  const tp = topic ? TOPICS.find((t) => t.id === topic) : null;
  const title = tp ? `#${tp.tag}` : `“${q}”`;
  const posts = tp ? s.allPosts.filter(s.visible).filter((p) => p.topic === topic) : res.posts;
  return (
    <div className="screen-col">
      <Header title={title} />
      <div className="scroll pad">
        {type === 'creators' && res.creators.map((c) => <CreatorRow key={c.id} id={c.id} sub={`@${c.handle}`} right={<FollowBtn id={c.id} />} />)}
        {(type === 'posts' || type === 'topic') && <div className="grid3 flush">{posts.map((p) => <Tile key={p.id} p={p} />)}</div>}
        {type === 'papers' && <div className="list">{res.papers.map((p) => <PaperCard key={p.id} p={p} />)}</div>}
        {type === 'topics' && <div className="chip-row wrap">{res.topics.map((t) => <Chip key={t.id} onClick={() => s.push('searchAll', { q: '', type: 'topic', topic: t.id })}>#{t.tag}</Chip>)}</div>}
      </div>
    </div>
  );
}

export function CreatorMini({ id }: { id: string }) {
  const s = useStore();
  const c = creatorOf(s, id);
  return <span className="creator-mini"><Avatar c={c} size={20} /> <Name c={c} /></span>;
}
