import React, { useState } from 'react';
import { BarChart3, ClipboardList, Flag, LayoutDashboard, Search, Smartphone, Users, Ban, PauseCircle, Check, Trash2, TriangleAlert, X, FileText, Clapperboard, MessageCircle, Images } from 'lucide-react';
import { CREATORS } from './data';
import { useStore } from './store';
import { Avatar } from './ui';

type Section = 'overview' | 'users' | 'reports' | 'log';
type Status = 'active' | 'suspended' | 'banned';

const USERS = [
  ...CREATORS.map((c, i) => ({ id: c.id, c, joined: ['Aug 2', 'Aug 9', 'Aug 15', 'Sep 1', 'Sep 3', 'Sep 20', 'Oct 4', 'Jul 30'][i], posts: [86, 64, 52, 41, 33, 48, 29, 120][i], reports: [0, 0, 1, 0, 2, 0, 0, 0][i], email: `${c.handle.split('.')[0]}@mail.com` })),
  { id: 'spam', c: { id: 'spam', name: 'spam.bot', handle: 'spam.bot', bio: '', followers: 3, following: 900, hue: 0, initials: 'SB' }, joined: 'Nov 10', posts: 210, reports: 14, email: 'x9@temp.io' },
];

const REPORTS0 = [
  { id: 'rp1', type: 'reel', title: 'Get rich with AI in 7 days', who: 'spam.bot', reason: 'Spam', count: 14, icon: <Clapperboard size={16} /> },
  { id: 'rp2', type: 'comment', title: '"This is fake, idiot"', who: 'unknown_42', reason: 'Harassment', count: 3, icon: <MessageCircle size={16} /> },
  { id: 'rp3', type: 'note', title: 'GPT-5 leaked weights', who: 'rafi.builds', reason: 'Wrong information', count: 5, icon: <FileText size={16} /> },
  { id: 'rp4', type: 'image', title: 'CNN cheat sheet', who: 'tanvir.codes', reason: 'Copyright', count: 2, icon: <Images size={16} /> },
  { id: 'rp5', type: 'reel', title: 'Free course link 100% legit', who: 'spam.bot', reason: 'Spam', count: 9, icon: <Clapperboard size={16} /> },
];

const LOG0 = [
  { when: 'Nov 11, 06:40', mod: 'admin@doshomik', action: 'Removed', target: 'Reel: "Crypto x AI"', reason: 'Spam' },
  { when: 'Nov 10, 22:15', mod: 'admin@doshomik', action: 'Warned', target: '@unknown_17', reason: 'Harassment' },
  { when: 'Nov 10, 18:02', mod: 'mod.sadia', action: 'Approved', target: 'Note: "Backprop math"', reason: 'False report' },
  { when: 'Nov 9, 11:30', mod: 'admin@doshomik', action: 'Suspended', target: '@fake.prof', reason: 'Impersonation' },
];

const DAU = [1420, 1510, 1490, 1630, 1700, 1650, 1820, 1900, 1880, 1960, 2050, 1990, 2110, 2140];

export function Admin() {
  const s = useStore();
  const [sec, setSec] = useState<Section>('overview');
  const [status, setStatus] = useState<Record<string, Status>>({ spam: 'suspended' });
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<string | null>(null);
  const [reports, setReports] = useState(REPORTS0);
  const [log, setLog] = useState(LOG0);

  const act = (id: string, action: 'Approved' | 'Removed' | 'Warned') => {
    const r = reports.find((x) => x.id === id)!;
    setReports(reports.filter((x) => x.id !== id));
    setLog([{ when: 'Nov 11, 07:20', mod: 'admin@doshomik', action, target: `${r.type[0].toUpperCase() + r.type.slice(1)}: ${r.title}`, reason: r.reason }, ...log]);
    s.toast(action);
  };
  const setUser = (id: string, st: Status) => {
    setStatus({ ...status, [id]: st });
    const u = USERS.find((x) => x.id === id)!;
    setLog([{ when: 'Nov 11, 07:20', mod: 'admin@doshomik', action: st === 'active' ? 'Restored' : st === 'banned' ? 'Banned' : 'Suspended', target: `@${u.c.handle}`, reason: '—' }, ...log]);
  };
  const users = USERS.filter((u) => !q || `${typeof u.c.name === 'string' ? u.c.name : u.c.name.en} ${u.c.handle} ${u.email}`.toLowerCase().includes(q.toLowerCase()));
  const selected = USERS.find((u) => u.id === sel);
  const nav: [Section, React.ReactNode, string, number?][] = [
    ['overview', <LayoutDashboard size={18} />, 'Overview'],
    ['users', <Users size={18} />, 'Users'],
    ['reports', <Flag size={18} />, 'Reports', reports.length],
    ['log', <ClipboardList size={18} />, 'Moderation log'],
  ];
  const max = Math.max(...DAU);

  return (
    <div className="admin">
      <aside className="adm-side">
        <div className="adm-brand"><span className="wordmark" style={{ fontSize: 19 }}>doshomik<span className="wm-dot" /><span className="wm-bytes">bytes</span></span><span className="adm-pill">Admin</span></div>
        <nav>
          {nav.map(([id, icon, label, n]) => (
            <button key={id} className={`adm-nav ${sec === id ? 'on' : ''}`} onClick={() => setSec(id)}>
              {icon} <span>{label}</span>{n ? <span className="adm-count">{n}</span> : null}
            </button>
          ))}
        </nav>
        <button className="adm-nav back" onClick={() => s.setAdmin(false)}><Smartphone size={18} /> <span>Mobile app</span></button>
      </aside>
      <main className="adm-main">
        {sec === 'overview' && (
          <>
            <h1>Overview</h1>
            <div className="adm-stats">
              {[['Users', '12,480', '+3.1%'], ['Content', '3,912', '+128'], ['Daily active', '2,140', '+6.4%'], ['Open reports', String(reports.length), '']].map(([l, v, d]) => (
                <div className="adm-stat" key={l}><span>{l}</span><b>{v}</b>{d && <em>{d} this week</em>}</div>
              ))}
            </div>
            <div className="adm-grid">
              <section className="adm-card">
                <h2><BarChart3 size={18} /> Daily active users, 14 days</h2>
                <svg viewBox="0 0 560 200" className="adm-chart" role="img" aria-label="Daily active users chart">
                  {DAU.map((v, i) => {
                    const h = (v / max) * 160;
                    return (
                      <g key={i}>
                        <rect x={i * 40 + 6} y={180 - h} width={28} height={h} rx={6} className={i === DAU.length - 1 ? 'bar-hi' : 'bar'} />
                        {i % 2 === 1 && <text x={i * 40 + 20} y={196} textAnchor="middle" fontSize={10} className="f-muted">{i < 3 ? `Oct ${29 + i}` : `Nov ${i - 2}`}</text>}
                      </g>
                    );
                  })}
                </svg>
              </section>
              <section className="adm-card">
                <h2>Content mix</h2>
                {[['Reels', 1410, 330], ['Images', 980, 210], ['Notes', 860, 45], ['Courses', 214, 168], ['Paper Bytes', 448, 260]].map(([l, n, h]) => (
                  <div className="mix-row" key={l as string}>
                    <span>{l}</span>
                    <div className="mix-bar"><i style={{ width: `${((n as number) / 1410) * 100}%`, background: `hsl(${h} 60% 45%)` }} /></div>
                    <b>{(n as number).toLocaleString()}</b>
                  </div>
                ))}
              </section>
            </div>
          </>
        )}

        {sec === 'users' && (
          <>
            <h1>Users</h1>
            <label className="adm-search"><Search size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, handle, email" /></label>
            <table className="adm-table">
              <thead><tr><th>User</th><th>Email</th><th>Joined</th><th>Posts</th><th>Reports</th><th>Status</th><th /></tr></thead>
              <tbody>
                {users.map((u) => {
                  const st = status[u.id] || 'active';
                  return (
                    <tr key={u.id} className={sel === u.id ? 'sel' : ''} onClick={() => setSel(u.id)}>
                      <td><span className="adm-user"><Avatar c={u.c as never} size={30} /><span><b>{typeof u.c.name === 'string' ? u.c.name : u.c.name.en}</b><small>@{u.c.handle}</small></span></span></td>
                      <td>{u.email}</td><td>{u.joined}</td><td>{u.posts}</td>
                      <td>{u.reports ? <span className="adm-warn">{u.reports}</span> : 0}</td>
                      <td><span className={`adm-status ${st}`}>{st}</span></td>
                      <td className="adm-row-actions" onClick={(e) => e.stopPropagation()}>
                        {st === 'active' ? (
                          <>
                            <button className="adm-btn" onClick={() => setUser(u.id, 'suspended')}><PauseCircle size={15} /> Suspend</button>
                            <button className="adm-btn danger" onClick={() => setUser(u.id, 'banned')}><Ban size={15} /> Ban</button>
                          </>
                        ) : <button className="adm-btn" onClick={() => setUser(u.id, 'active')}><Check size={15} /> Restore</button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {selected && (
              <div className="adm-drawer">
                <button className="adm-close" onClick={() => setSel(null)} aria-label="Close"><X size={18} /></button>
                <Avatar c={selected.c as never} size={64} />
                <h2>{typeof selected.c.name === 'string' ? selected.c.name : selected.c.name.en}</h2>
                <div className="muted">@{selected.c.handle}</div>
                <dl>
                  <dt>Email</dt><dd>{selected.email}</dd>
                  <dt>Joined</dt><dd>{selected.joined}, 2026</dd>
                  <dt>Followers</dt><dd>{selected.c.followers.toLocaleString()}</dd>
                  <dt>Posts</dt><dd>{selected.posts}</dd>
                  <dt>Reports</dt><dd>{selected.reports}</dd>
                  <dt>Status</dt><dd><span className={`adm-status ${status[selected.id] || 'active'}`}>{status[selected.id] || 'active'}</span></dd>
                </dl>
              </div>
            )}
          </>
        )}

        {sec === 'reports' && (
          <>
            <h1>Reported content</h1>
            {!reports.length && <div className="adm-empty"><Check size={28} /> Queue clear</div>}
            <div className="adm-reports">
              {reports.map((r) => (
                <div className="adm-report" key={r.id}>
                  <span className="adm-type">{r.icon} {r.type}</span>
                  <div className="adm-r-body">
                    <b>{r.title}</b>
                    <span className="muted">@{r.who}</span>
                  </div>
                  <span className="adm-reason"><TriangleAlert size={14} /> {r.reason}</span>
                  <span className="adm-rc">{r.count} reports</span>
                  <div className="adm-r-actions">
                    <button className="adm-btn" onClick={() => act(r.id, 'Approved')}><Check size={15} /> Approve</button>
                    <button className="adm-btn" onClick={() => act(r.id, 'Warned')}><TriangleAlert size={15} /> Warn</button>
                    <button className="adm-btn danger" onClick={() => act(r.id, 'Removed')}><Trash2 size={15} /> Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {sec === 'log' && (
          <>
            <h1>Moderation log</h1>
            <table className="adm-table">
              <thead><tr><th>Time</th><th>Moderator</th><th>Action</th><th>Target</th><th>Reason</th></tr></thead>
              <tbody>
                {log.map((l, i) => (
                  <tr key={i}><td>{l.when}</td><td>{l.mod}</td><td><span className={`adm-action ${l.action.toLowerCase()}`}>{l.action}</span></td><td>{l.target}</td><td>{l.reason}</td></tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
    </div>
  );
}
