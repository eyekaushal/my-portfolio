"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Bot, ChartColumn, CircleCheck, CircleX, Code, Database, FileText, Inbox, Info, Shield, Split, User, Zap } from "lucide-react";
import type { Diagram, DiagramIcon } from "@/data/content";

const ICONS: Record<DiagramIcon, typeof Bot> = {
  input: Inbox,
  agent: Bot,
  shield: Shield,
  db: Database,
  code: Code,
  chart: ChartColumn,
  user: User,
  doc: FileText,
  bolt: Zap,
  split: Split,
  check: CircleCheck,
  x: CircleX,
};

export function NodeIcon({ name, size = 16 }: { name: DiagramIcon; size?: number }) {
  const Icon = ICONS[name];
  return <Icon size={size} aria-hidden="true" />;
}

type Box = { x: number; y: number; w: number; h: number; row: number };

function edgePath(a: Box, b: Box) {
  if (a.row === b.row) {
    const leftToRight = a.x < b.x;
    const x1 = leftToRight ? a.x + a.w : a.x;
    const x2 = leftToRight ? b.x : b.x + b.w;
    const y = a.y + a.h / 2;
    return `M ${x1} ${y} L ${x2} ${y}`;
  }
  const down = a.row < b.row;
  const x1 = a.x + a.w / 2;
  const y1 = down ? a.y + a.h : a.y;
  const x2 = b.x + b.w / 2;
  const y2 = down ? b.y : b.y + b.h;
  const my = (y1 + y2) / 2;
  return `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
}

export function ArchitectureDiagram({ diagram, label }: { diagram: Diagram; label: string }) {
  const [modeId, setModeId] = useState(diagram.modes[0].id);
  const mode = diagram.modes.find((m) => m.id === modeId) ?? diagram.modes[0];
  const wrap = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLDivElement>());
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const [size, setSize] = useState({ w: 0, h: 0 });

  const rowOf = useMemo(() => {
    const m: Record<string, number> = {};
    diagram.rows.forEach((row, r) => row.forEach((n) => (m[n.id] = r)));
    return m;
  }, [diagram]);

  const edges = useMemo(() => {
    const seen = new Set<string>();
    const list: [string, string][] = [];
    for (const m of diagram.modes)
      for (let i = 1; i < m.path.length; i++) {
        const k = `${m.path[i - 1]}>${m.path[i]}`;
        if (!seen.has(k)) {
          seen.add(k);
          list.push([m.path[i - 1], m.path[i]]);
        }
      }
    return list;
  }, [diagram]);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => {
      const base = el.getBoundingClientRect();
      const next: Record<string, Box> = {};
      nodeRefs.current.forEach((node, id) => {
        const r = node.getBoundingClientRect();
        next[id] = { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height, row: rowOf[id] };
      });
      setBoxes(next);
      setSize({ w: base.width, h: base.height });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, [rowOf]);

  const activeEdges = new Set(mode.path.slice(1).map((id, i) => `${mode.path[i]}>${id}`));
  const activeNodes = new Set(mode.path);

  return (
    <div className="architecture-exhibit">
      <div className="route-switch" role="group" aria-label={`${label}: ${diagram.title}`}>
        {diagram.modes.map((m) => (
          <button key={m.id} type="button" aria-pressed={m.id === mode.id} onClick={() => setModeId(m.id)}>
            <NodeIcon name={m.icon} size={14} />
            {m.label}
          </button>
        ))}
      </div>
      <div ref={wrap} className="diagram" data-route={mode.id}>
        <svg className="diagram-lines" viewBox={`0 0 ${size.w || 1} ${size.h || 1}`} aria-hidden="true">
          {edges.map(([a, b]) =>
            boxes[a] && boxes[b] ? <path key={`b-${a}-${b}`} className="route-line-base" d={edgePath(boxes[a], boxes[b])} /> : null,
          )}
          {edges.map(([a, b]) =>
            boxes[a] && boxes[b] && activeEdges.has(`${a}>${b}`) ? (
              <path
                key={`a-${mode.id}-${a}-${b}`}
                className="route-line-active"
                d={edgePath(boxes[a], boxes[b])}
                pathLength={1}
                style={{ animationDelay: `${mode.path.indexOf(a) * 70}ms` }}
              />
            ) : null,
          )}
        </svg>
        {diagram.rows.map((row, r) => (
          <div key={r} className="diagram-row">
            {row.map((n) => (
              <div
                key={n.id}
                ref={(el) => {
                  if (el) nodeRefs.current.set(n.id, el);
                  else nodeRefs.current.delete(n.id);
                }}
                className="diagram-node"
                data-active={activeNodes.has(n.id)}
              >
                {n.icon ? <NodeIcon name={n.icon} /> : null}
                <div>
                  <strong>{n.title}</strong>
                  {n.sub ? <span>{n.sub}</span> : null}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="route-explanation" aria-live="polite">
        <Info size={14} aria-hidden="true" />
        <p>{mode.explanation}</p>
      </div>
    </div>
  );
}
