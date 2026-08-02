const NODES = [
  { label: "MEMBERS", angle: -90 },
  { label: "PROJECTS", angle: -30 },
  { label: "COMPETITIONS", angle: 30 },
  { label: "EVENTS", angle: 90 },
  { label: "RESOURCES", angle: 150 },
  { label: "ANNOUNCEMENTS", angle: 210 },
];

const CENTER = 200;
const RADIUS = 150;

function pointFor(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + RADIUS * Math.cos(rad),
    y: CENTER + RADIUS * Math.sin(rad),
  };
}

// The signature visual: STEMORA as the hub with the six MVP capabilities as
// orbiting, connected nodes. Not decorative — it's the literal thesis of
// "one hub, six capabilities." Keep these labels in sync with PILLARS in
// src/app/(marketing)/page.tsx.
export function NetworkHero() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="h-full w-full [--dur:1.4s]"
      role="img"
      aria-label="STEMORA at the center of six connected product areas: members, projects, competitions, events, resources, and announcements"
    >
      <defs>
        <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={CENTER} cy={CENTER} r={110} fill="url(#hub-glow)" />

      {NODES.map((node, i) => {
        const { x, y } = pointFor(node.angle);
        return (
          <line
            key={node.label}
            x1={CENTER}
            y1={CENTER}
            x2={x}
            y2={y}
            stroke="var(--color-border)"
            strokeWidth="1.5"
            strokeDasharray="240"
            className="origin-center animate-[draw-line_var(--dur)_ease-out_forwards]"
            style={{ animationDelay: `${i * 90}ms` }}
          />
        );
      })}

      {/* hub */}
      <circle cx={CENTER} cy={CENTER} r="7" fill="var(--color-primary)" />
      <circle
        cx={CENTER}
        cy={CENTER}
        r="14"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="1.5"
        opacity="0.4"
        className="animate-[pulse-ring_2.6s_ease-out_infinite]"
      />
      <text
        x={CENTER}
        y={CENTER + 32}
        textAnchor="middle"
        className="fill-foreground font-mono text-[10px] font-medium tracking-wider"
      >
        STEMORA
      </text>

      {NODES.map((node, i) => {
        const { x, y } = pointFor(node.angle);
        const labelY = node.angle === -90 ? y - 14 : node.angle === 90 ? y + 20 : y + (Math.sin((node.angle * Math.PI) / 180) >= 0 ? 20 : -14);
        return (
          <g
            key={node.label}
            className="animate-[fade-in_0.5s_ease-out_forwards] opacity-0"
            style={{ animationDelay: `${i * 90 + 500}ms` }}
          >
            <circle cx={x} cy={y} r="5" fill="var(--color-brand-spark)" />
            <text
              x={x}
              y={labelY}
              textAnchor="middle"
              className="fill-muted-foreground font-mono text-[9px] uppercase tracking-wider"
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
