import React from 'react';
import type { SceneKind } from './data';

type Props = { kind: SceneKind; dark?: boolean; playing?: boolean; fit?: 'meet' | 'slice'; className?: string };

const Txt = ({ x, y, s = 14, c = 'ink', w = 600, a = 'middle', children }: { x: number; y: number; s?: number; c?: string; w?: number; a?: 'start' | 'middle' | 'end'; children: React.ReactNode }) => (
  <text x={x} y={y} fontSize={s} fontWeight={w} textAnchor={a} className={`f-${c}`}>{children}</text>
);

function Neural({ drop = false }: { drop?: boolean }) {
  const layers = [[110, 160, 210, 260].slice(0, 3).map((y) => y + 25), [95, 150, 205, 260], [150, 220]];
  const xs = [80, 200, 320];
  const dropped = new Set(['1-1', '1-3', '0-2']);
  return (
    <g>
      {layers.slice(0, -1).map((ys, li) =>
        ys.map((y1, i) =>
          layers[li + 1].map((y2, j) => {
            const off = drop && (dropped.has(`${li}-${i}`) || dropped.has(`${li + 1}-${j}`));
            return (
              <line key={`${li}-${i}-${j}`} x1={xs[li]} y1={y1} x2={xs[li + 1]} y2={y2}
                className={off ? 's-muted dashed' : 's-brand flow'} strokeWidth={off ? 1.5 : 2}
                style={{ animationDelay: `${(i + j) * 0.15}s` }} />
            );
          }),
        ),
      )}
      {layers.map((ys, li) =>
        ys.map((y, i) => {
          const off = drop && dropped.has(`${li}-${i}`);
          return (
            <circle key={`${li}-${i}`} cx={xs[li]} cy={y} r={17}
              className={off ? 'fl-off s-muted blink' : li === 2 ? 'fl-accent pulse' : 'fl-node s-brand pulse'} strokeWidth={3}
              style={{ animationDelay: `${li * 0.5 + i * 0.12}s` }} />
          );
        }),
      )}
      <Txt x={80} y={330} s={13} c="muted">Input</Txt>
      <Txt x={200} y={330} s={13} c="muted">Hidden</Txt>
      <Txt x={320} y={330} s={13} c="muted">Output</Txt>
      {drop && <Txt x={200} y={60} s={18} c="accent" w={700}>p = 0.5</Txt>}
      {!drop && <Txt x={200} y={60} s={18} c="ink" w={700}>∂L/∂w</Txt>}
    </g>
  );
}

function Attention() {
  const toks = ['The', 'cat', 'sat', 'on', 'mat'];
  const w = [
    [0.9, 0.2, 0.1, 0.1, 0.2], [0.3, 0.9, 0.5, 0.1, 0.3], [0.1, 0.7, 0.8, 0.3, 0.4],
    [0.1, 0.2, 0.4, 0.8, 0.6], [0.2, 0.5, 0.3, 0.5, 0.9],
  ];
  const s = 46, ox = 110, oy = 110;
  return (
    <g>
      {toks.map((tk, i) => (
        <React.Fragment key={tk}>
          <Txt x={ox + i * s + s / 2} y={oy - 14} s={13} c="ink">{tk}</Txt>
          <Txt x={ox - 12} y={oy + i * s + s / 2 + 5} s={13} c="ink" a="end">{tk}</Txt>
        </React.Fragment>
      ))}
      {w.map((row, r) =>
        row.map((v, c) => (
          <rect key={`${r}-${c}`} x={ox + c * s + 2} y={oy + r * s + 2} width={s - 4} height={s - 4} rx={8}
            className="fl-accent breathe" style={{ opacity: v, animationDelay: `${(r * 5 + c) * 0.08}s` }} />
        )),
      )}
      <Txt x={200} y={370} s={15} c="muted" w={500}>softmax(QKᵀ/√d)·V</Txt>
    </g>
  );
}

function Gradient() {
  const pts: [number, number][] = [];
  for (let x = 40; x <= 368; x += 8) pts.push([x, 320 - ((x - 230) ** 2) / 150]);
  const path = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y.toFixed(1)}`).join(' ');
  return (
    <g>
      <line x1={30} y1={340} x2={370} y2={340} className="s-muted" strokeWidth={2} />
      <line x1={30} y1={60} x2={30} y2={340} className="s-muted" strokeWidth={2} />
      <path d={path} fill="none" className="s-brand" strokeWidth={4} strokeLinecap="round" />
      <g className="roll">
        <circle cx={0} cy={0} r={14} className="fl-accent" />
      </g>
      <Txt x={36} y={52} s={13} c="muted" a="start">Loss</Txt>
      <Txt x={364} y={362} s={13} c="muted" a="end">w</Txt>
      <Txt x={230} y={362} s={14} c="accent" w={700}>min</Txt>
    </g>
  );
}

function Agent() {
  const nodes = [
    { x: 200, y: 95, l: 'Think' },
    { x: 320, y: 290, l: 'Act' },
    { x: 80, y: 290, l: 'Observe' },
  ];
  return (
    <g>
      <circle cx={200} cy={225} r={125} fill="none" className="s-muted dashed" strokeWidth={2} />
      <g className="orbit" style={{ transformOrigin: '200px 225px' }}>
        <circle cx={200} cy={100} r={9} className="fl-accent" />
      </g>
      {nodes.map((n, i) => (
        <g key={n.l}>
          <circle cx={n.x} cy={n.y} r={44} className="fl-node s-brand pulse" strokeWidth={3} style={{ animationDelay: `${i * 0.9}s` }} />
          <Txt x={n.x} y={n.y + 5} s={15} c="ink" w={700}>{n.l}</Txt>
        </g>
      ))}
      <rect x={150} y={205} width={100} height={40} rx={20} className="fl-brand" />
      <Txt x={200} y={231} s={14} c="onbrand" w={700}>LLM</Txt>
    </g>
  );
}

function Diffusion() {
  const n = 9, s = 30, ox = 65, oy = 70;
  const shape = (r: number, c: number) => {
    const dx = c - 4, dy = r - 4;
    return dx * dx + dy * dy <= 10 ? (dx * dx + dy * dy <= 3 ? 2 : 1) : 0;
  };
  const rnd = (i: number) => ((Math.sin(i * 91.7) + 1) / 2);
  return (
    <g>
      {Array.from({ length: n * n }, (_, i) => {
        const r = Math.floor(i / n), c = i % n, v = shape(r, c);
        return (
          <g key={i}>
            <rect x={ox + c * s} y={oy + r * s} width={s - 3} height={s - 3} rx={4}
              className={v === 2 ? 'fl-accent' : v === 1 ? 'fl-brand' : 'fl-soft'} />
            <rect x={ox + c * s} y={oy + r * s} width={s - 3} height={s - 3} rx={4}
              className="fl-noise denoise" style={{ opacity: 0.4 + rnd(i) * 0.6, animationDelay: `${rnd(i + 3) * 1.6}s` }} />
          </g>
        );
      })}
      <Txt x={200} y={370} s={15} c="muted" w={500}>t = T → 0</Txt>
    </g>
  );
}

function Grid({ ox, oy, n, s, vals, hi }: { ox: number; oy: number; n: number; s: number; vals?: number[]; hi?: (r: number, c: number) => string | undefined }) {
  return (
    <g>
      {Array.from({ length: n * n }, (_, i) => {
        const r = Math.floor(i / n), c = i % n;
        return (
          <g key={i}>
            <rect x={ox + c * s} y={oy + r * s} width={s - 3} height={s - 3} rx={5} className={hi?.(r, c) || 'fl-soft'} />
            {vals && <Txt x={ox + c * s + (s - 3) / 2} y={oy + r * s + s / 2 + 3} s={12} c="ink">{vals[i]}</Txt>}
          </g>
        );
      })}
    </g>
  );
}

function Conv() {
  return (
    <g>
      <Grid ox={30} oy={110} n={6} s={30} vals={[1, 0, 2, 1, 0, 1, 0, 1, 3, 1, 2, 0, 2, 1, 0, 0, 1, 2, 1, 3, 1, 2, 0, 1, 0, 2, 1, 1, 3, 0, 1, 0, 2, 0, 1, 2]} />
      <rect x={28} y={108} width={92} height={92} rx={8} fill="none" className="s-accent slide-k" strokeWidth={4} />
      <Txt x={225} y={210} s={26} c="muted">→</Txt>
      <Grid ox={260} oy={140} n={4} s={30} hi={(r, c) => ((r + c) % 3 === 0 ? 'fl-brand' : 'fl-soft')} />
      <Txt x={120} y={315} s={13} c="muted">Input 6×6</Txt>
      <Txt x={318} y={290} s={13} c="muted">Feature map</Txt>
      <Txt x={200} y={60} s={18} c="ink" w={700}>3×3 kernel</Txt>
    </g>
  );
}

function Pool() {
  const v = [1, 3, 2, 1, 4, 2, 0, 5, 1, 1, 3, 2, 0, 2, 6, 1];
  const q = (r: number, c: number) => ['fl-brand-soft', 'fl-accent-soft', 'fl-sky-soft', 'fl-soft'][(r >> 1) * 2 + (c >> 1)];
  return (
    <g>
      <Grid ox={40} oy={120} n={4} s={38} vals={v} hi={q} />
      <Txt x={225} y={200} s={26} c="muted">→</Txt>
      <Grid ox={262} oy={158} n={2} s={50} vals={[4, 5, 2, 6]} hi={(r, c) => q(r * 2, c * 2)} />
      <Txt x={200} y={60} s={18} c="ink" w={700}>max(2×2)</Txt>
    </g>
  );
}

function Dense() {
  const a = [90, 140, 190, 240, 290], b = [130, 190, 250];
  return (
    <g>
      {a.map((y1) => b.map((y2) => <line key={`${y1}-${y2}`} x1={110} y1={y1} x2={290} y2={y2} className="s-brand flow" strokeWidth={1.6} />))}
      {a.map((y) => <circle key={y} cx={110} cy={y} r={15} className="fl-node s-brand" strokeWidth={3} />)}
      {b.map((y) => <circle key={y} cx={290} cy={y} r={15} className="fl-accent" />)}
      <Txt x={200} y={355} s={16} c="muted" w={500}>y = Wx + b</Txt>
    </g>
  );
}

function Softmax() {
  const d = [['cat', 0.72], ['dog', 0.21], ['bird', 0.07]] as const;
  return (
    <g>
      {d.map(([l, p], i) => (
        <g key={l}>
          <Txt x={70} y={140 + i * 70} s={16} c="ink" a="start" w={600}>{l}</Txt>
          <rect x={130} y={118 + i * 70} width={220} height={32} rx={16} className="fl-soft" />
          <rect x={130} y={118 + i * 70} width={220 * p} height={32} rx={16} className={i ? 'fl-brand grow' : 'fl-accent grow'} />
          <Txt x={355} y={175 + i * 70} s={13} c="muted" a="end">{Math.round(p * 100)}%</Txt>
        </g>
      ))}
      <Txt x={200} y={70} s={18} c="ink" w={700}>Σ = 1</Txt>
    </g>
  );
}

function BiasVar() {
  const spots = [
    [[0, 0], [4, -3], [-3, 4], [2, 3]],
    [[30, -20], [-25, 28], [20, 30], [-30, -15]],
    [[38, -35], [42, -30], [35, -40], [44, -38]],
    [[30, -55], [-10, 30], [52, 5], [10, -10]],
  ];
  const labels = ['Low bias, low var', 'Low bias, high var', 'High bias, low var', 'High bias, high var'];
  return (
    <g>
      {[0, 1, 2, 3].map((i) => {
        const cx = i % 2 ? 290 : 110, cy = i < 2 ? 125 : 290;
        return (
          <g key={i}>
            {[62, 42, 22].map((r, k) => <circle key={r} cx={cx} cy={cy} r={r} className={k === 2 ? 'fl-accent-soft s-muted' : 'fl-none s-muted'} strokeWidth={2} />)}
            {spots[i].map(([dx, dy], k) => <circle key={k} cx={cx + dx} cy={cy + dy} r={6} className="fl-brand" />)}
            <Txt x={cx} y={cy + 84} s={11.5} c="muted" w={500}>{labels[i]}</Txt>
          </g>
        );
      })}
    </g>
  );
}

function Tokens({ mode }: { mode: 'split' | 'ids' | 'embed' }) {
  const t = ['Learn', 'ing', ' AI', ' in', ' বাং', 'লা'];
  const ids = [16183, 278, 15836, 287, 47821, 5310];
  const widths = [74, 46, 46, 40, 52, 42];
  let x = 200 - widths.reduce((a, b) => a + b + 6, -6) / 2;
  return (
    <g>
      {mode === 'split' && <Txt x={200} y={110} s={22} c="ink" w={700}>Learning AI in বাংলা</Txt>}
      {mode === 'split' && <Txt x={200} y={160} s={26} c="muted">↓</Txt>}
      {t.map((tk, i) => {
        const cx = x; x += widths[i] + 6;
        const y = mode === 'split' ? 190 : 120;
        return (
          <g key={i}>
            <rect x={cx} y={y} width={widths[i]} height={40} rx={10} className={['fl-brand-soft', 'fl-accent-soft', 'fl-sky-soft'][i % 3]} />
            <Txt x={cx + widths[i] / 2} y={y + 26} s={15} c="ink">{tk.trim()}</Txt>
            {mode === 'ids' && <Txt x={cx + widths[i] / 2} y={205} s={12} c="muted">↓</Txt>}
            {mode === 'ids' && <Txt x={cx + widths[i] / 2} y={240} s={12} c="brand" w={700}>{ids[i]}</Txt>}
            {mode === 'embed' && [0, 1, 2, 3].map((k) => (
              <rect key={k} x={cx + 6} y={180 + k * 26} width={(widths[i] - 12) * (0.3 + ((i * 7 + k * 3) % 10) / 14)} height={16} rx={4} className={k % 2 ? 'fl-accent' : 'fl-brand'} opacity={0.85} />
            ))}
          </g>
        );
      })}
      {mode === 'ids' && <Txt x={200} y={320} s={14} c="muted" w={500}>vocab ≈ 50K</Txt>}
      {mode === 'embed' && <Txt x={200} y={320} s={14} c="muted" w={500}>d = 768</Txt>}
    </g>
  );
}

function Scaling() {
  const pts = [[60, 90], [110, 125], [160, 162], [210, 196], [260, 232], [310, 268], [350, 296]];
  return (
    <g>
      <line x1={40} y1={330} x2={370} y2={330} className="s-muted" strokeWidth={2} />
      <line x1={40} y1={50} x2={40} y2={330} className="s-muted" strokeWidth={2} />
      {[100, 170, 240, 310].map((x) => <line key={x} x1={x} y1={50} x2={x} y2={330} className="s-soft" strokeWidth={1} />)}
      <path d={`M${pts.map((p) => p.join(',')).join(' L')}`} fill="none" className="s-brand draw" strokeWidth={4} strokeLinecap="round" />
      {pts.map(([x, y]) => <circle key={x} cx={x} cy={y} r={6} className="fl-accent" />)}
      <Txt x={46} y={44} s={13} c="muted" a="start">Loss (log)</Txt>
      <Txt x={366} y={352} s={13} c="muted" a="end">Compute (log)</Txt>
    </g>
  );
}

function Regression() {
  const pts = [[60, 290], [90, 270], [110, 285], [140, 240], [165, 250], [190, 205], [220, 215], [250, 175], [270, 185], [300, 140], [330, 150], [350, 112]];
  return (
    <g>
      <line x1={40} y1={330} x2={370} y2={330} className="s-muted" strokeWidth={2} />
      <line x1={40} y1={60} x2={40} y2={330} className="s-muted" strokeWidth={2} />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} className="fl-brand" opacity={0.85} />)}
      <line x1={50} y1={300} x2={360} y2={110} className="s-accent draw" strokeWidth={4} strokeLinecap="round" />
      <Txt x={200} y={70} s={18} c="ink" w={700}>ŷ = wx + b</Txt>
    </g>
  );
}

function Lora() {
  return (
    <g>
      <rect x={40} y={110} width={150} height={150} rx={12} className="fl-soft s-muted" strokeWidth={2} />
      <Txt x={115} y={190} s={22} c="muted" w={700}>W</Txt>
      <Txt x={115} y={215} s={12} c="muted">frozen</Txt>
      <Txt x={212} y={194} s={26} c="ink">+</Txt>
      <rect x={235} y={110} width={30} height={150} rx={8} className="fl-accent" />
      <Txt x={250} y={290} s={14} c="ink" w={700}>B</Txt>
      <rect x={280} y={110} width={90} height={30} rx={8} className="fl-brand" />
      <Txt x={325} y={164} s={14} c="ink" w={700}>A</Txt>
      <Txt x={200} y={70} s={18} c="ink" w={700}>W + BA, rank r = 8</Txt>
      <Txt x={200} y={340} s={14} c="muted" w={500}>0.01% trainable</Txt>
    </g>
  );
}

function Steps({ items, tone }: { items: string[]; tone: string[] }) {
  return (
    <g>
      {items.map((l, i) => (
        <g key={l} className="rise" style={{ animationDelay: `${i * 0.35}s` }}>
          <rect x={70} y={70 + i * 72} width={260} height={50} rx={14} className={tone[i % tone.length]} />
          <Txt x={200} y={101 + i * 72} s={15} c="ink" w={650}>{l}</Txt>
          {i < items.length - 1 && <Txt x={200} y={136 + i * 72} s={14} c="muted">↓</Txt>}
        </g>
      ))}
    </g>
  );
}

function Loss() {
  return (
    <g>
      <line x1={40} y1={330} x2={370} y2={330} className="s-muted" strokeWidth={2} />
      <line x1={40} y1={60} x2={40} y2={330} className="s-muted" strokeWidth={2} />
      <path d="M50,80 C120,240 200,290 360,305" fill="none" className="s-brand draw" strokeWidth={4} />
      <path d="M50,90 C120,240 200,260 360,230" fill="none" className="s-accent draw" strokeWidth={4} strokeDasharray="10 8" />
      <Txt x={300} y={322} s={13} c="brand" w={700}>train</Txt>
      <Txt x={300} y={218} s={13} c="accent" w={700}>val</Txt>
      <Txt x={366} y={352} s={13} c="muted" a="end">epochs</Txt>
    </g>
  );
}

export function Scene({ kind, dark, playing = true, fit = 'meet', className = '' }: Props) {
  let body: React.ReactNode;
  switch (kind) {
    case 'neural': body = <Neural />; break;
    case 'dropout': body = <Neural drop />; break;
    case 'attention': body = <Attention />; break;
    case 'gradient': body = <Gradient />; break;
    case 'agent': body = <Agent />; break;
    case 'diffusion': body = <Diffusion />; break;
    case 'conv': body = <Conv />; break;
    case 'pool': body = <Pool />; break;
    case 'dense': body = <Dense />; break;
    case 'softmax': body = <Softmax />; break;
    case 'biasvar': body = <BiasVar />; break;
    case 'tokens': body = <Tokens mode="split" />; break;
    case 'tokenids': body = <Tokens mode="ids" />; break;
    case 'embed': body = <Tokens mode="embed" />; break;
    case 'scaling': body = <Scaling />; break;
    case 'regression': body = <Regression />; break;
    case 'lora': body = <Lora />; break;
    case 'cot': body = <Steps items={['Q: 23 apples, use 20, buy 6?', 'Step 1: 23 − 20 = 3', 'Step 2: 3 + 6 = 9', 'Answer: 9']} tone={['fl-soft', 'fl-brand-soft', 'fl-brand-soft', 'fl-accent-soft']} />; break;
    case 'react': body = <Steps items={['Thought: need weather', 'Action: get_weather(Dhaka)', 'Observation: 31°C, humid', 'Answer: hot today']} tone={['fl-sky-soft', 'fl-accent-soft', 'fl-brand-soft', 'fl-soft']} />; break;
    case 'loss': body = <Loss />; break;
  }
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio={`xMidYMid ${fit}`} className={`scene ${dark ? 'dark' : 'light'} ${playing ? '' : 'paused'} ${className}`} aria-hidden="true">
      {body}
    </svg>
  );
}

export const SCENE_BG: Record<SceneKind, number> = {
  neural: 168, dropout: 200, attention: 330, gradient: 260, agent: 24, diffusion: 290, conv: 210, pool: 210, dense: 168,
  softmax: 45, biasvar: 260, tokens: 172, tokenids: 172, embed: 172, scaling: 140, regression: 260, lora: 330, cot: 140, react: 24, loss: 168,
};
