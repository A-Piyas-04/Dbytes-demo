import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Scene } from './scenes';
import type { SceneKind } from './data';

function Math({ tex, block }: { tex: string; block?: boolean }) {
  const html = React.useMemo(() => {
    try {
      return katex.renderToString(tex, { displayMode: !!block, throwOnError: false });
    } catch {
      return tex;
    }
  }, [tex, block]);
  return <span className={block ? 'md-math-block' : 'md-math'} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Inline({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\$[^$]+\$)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) parts.push(<strong key={i++}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith('`')) parts.push(<code key={i++} className="md-code">{tok.slice(1, -1)}</code>);
    else parts.push(<Math key={i++} tex={tok.slice(1, -1)} />);
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

const KW = /\b(import|from|for|in|range|def|return|if|else|as|while|class|True|False|None|lambda)\b/;
function highlight(line: string, lang: string) {
  if (lang === 'json') {
    return line.split(/("[^"]*")/g).map((p, i) =>
      p.startsWith('"') ? <span key={i} className={i % 4 === 1 ? 'hl-key' : 'hl-str'}>{p}</span> : p,
    );
  }
  const out: React.ReactNode[] = [];
  const re = /(#.*$|"[^"]*"|'[^']*'|\b\d+(\.\d+)?\b|\b[A-Za-z_]+\b)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const tk = m[0];
    let cls = '';
    if (tk.startsWith('#')) cls = 'hl-com';
    else if (tk.startsWith('"') || tk.startsWith("'")) cls = 'hl-str';
    else if (/^\d/.test(tk)) cls = 'hl-num';
    else if (KW.test(tk) && tk.match(KW)![0] === tk) cls = 'hl-kw';
    out.push(cls ? <span key={i++} className={cls}>{tk}</span> : tk);
    last = m.index + tk.length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export function CodeBlock({ code, lang }: { code: string; lang: string }) {
  return (
    <div className="md-pre">
      <div className="md-pre-head">{lang || 'code'}</div>
      <pre>
        {code.split('\n').map((l, i) => (
          <div key={i} className="md-line">{highlight(l, lang)}{'\n'}</div>
        ))}
      </pre>
    </div>
  );
}

export function Markdown({ src }: { src: string }) {
  const lines = src.split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let k = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) body.push(lines[i++]);
      i++;
      blocks.push(<CodeBlock key={k++} code={body.join('\n')} lang={lang} />);
      continue;
    }
    if (line.startsWith('$$')) {
      let tex = line.slice(2);
      if (tex.endsWith('$$')) tex = tex.slice(0, -2);
      else {
        i++;
        while (i < lines.length && !lines[i].includes('$$')) tex += '\n' + lines[i++];
        tex += '\n' + (lines[i] || '').replace('$$', '');
      }
      i++;
      blocks.push(<Math key={k++} tex={tex} block />);
      continue;
    }
    const img = line.match(/^!\[(.*)\]\((.+)\)$/);
    if (img) {
      const src2 = img[2];
      blocks.push(
        <figure key={k++} className="md-fig">
          {src2.startsWith('scene:') ? <Scene kind={src2.slice(6) as SceneKind} /> : <img src={src2} alt={img[1]} />}
        </figure>,
      );
      i++;
      continue;
    }
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      const Tag = (`h${h[1].length + 1}`) as 'h2' | 'h3' | 'h4';
      blocks.push(<Tag key={k++} className="md-h"><Inline text={h[2]} /></Tag>);
      i++;
      continue;
    }
    if (/^(-|\d+\.)\s/.test(line)) {
      const ordered = /^\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && /^(-|\d+\.)\s/.test(lines[i])) items.push(lines[i++].replace(/^(-|\d+\.)\s/, ''));
      const L = ordered ? 'ol' : 'ul';
      blocks.push(React.createElement(L, { key: k++, className: 'md-list' }, items.map((it, j) => <li key={j}><Inline text={it} /></li>)));
      continue;
    }
    if (line.trim()) blocks.push(<p key={k++} className="md-p"><Inline text={line} /></p>);
    i++;
  }
  return <div className="md">{blocks}</div>;
}
