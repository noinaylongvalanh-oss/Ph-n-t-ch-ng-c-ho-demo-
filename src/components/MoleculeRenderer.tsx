import React from 'react';
import { MolecularStructure, ChemAtom, ChemBond, BondType } from '../types/chemistry';

interface MoleculeRendererProps {
  structure: MolecularStructure;
  width?: number;
  height?: number;
  showAtomLabels?: boolean;
  highlightBondId?: string;
  theme?: 'dark' | 'light';
  className?: string;
  interactive?: boolean;
  onAtomClick?: (atom: ChemAtom) => void;
  onBondClick?: (bond: ChemBond) => void;
  showSynthonBadges?: boolean;
}

const ELEMENT_COLORS: Record<string, { dark: string; light: string; bg: string }> = {
  O: { dark: '#f87171', light: '#dc2626', bg: '#ef4444' }, // Red
  N: { dark: '#60a5fa', light: '#2563eb', bg: '#3b82f6' }, // Blue
  S: { dark: '#facc15', light: '#d97706', bg: '#eab308' }, // Yellow/amber
  Cl: { dark: '#4ade80', light: '#16a34a', bg: '#22c55e' }, // Green
  Br: { dark: '#fb923c', light: '#c2410c', bg: '#ea580c' }, // Orange-brown
  F: { dark: '#22d3ee', light: '#0891b2', bg: '#06b6d4' }, // Cyan
  I: { dark: '#c084fc', light: '#7e22ce', bg: '#9333ea' }, // Purple
  P: { dark: '#fbbf24', light: '#b45309', bg: '#f59e0b' }, // Orange
  H: { dark: '#cbd5e1', light: '#64748b', bg: '#94a3b8' }, // Light gray
  C: { dark: '#f1f5f9', light: '#1e293b', bg: '#475569' }, // Carbon
};

export const MoleculeRenderer: React.FC<MoleculeRendererProps> = ({
  structure,
  width = 240,
  height = 180,
  showAtomLabels = true,
  highlightBondId,
  theme = 'dark',
  className = '',
  interactive = false,
  onAtomClick,
  onBondClick,
  showSynthonBadges = true,
}) => {
  const isDark = theme === 'dark';
  const strokeColor = isDark ? '#94a3b8' : '#334155';
  const bgColor = isDark ? 'transparent' : '#f8fafc';

  const atoms = structure.atoms || [];
  const bonds = structure.bonds || [];

  if (atoms.length === 0) {
    return (
      <div
        style={{ width, height }}
        className={`flex items-center justify-center rounded-lg border border-dashed border-slate-800 text-xs text-slate-500 ${className}`}
      >
        <span>Chưa có cấu trúc</span>
      </div>
    );
  }

  // Calculate bounding box for auto-scaling
  const xs = atoms.map((a) => a.x);
  const ys = atoms.map((a) => a.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const padding = 28;
  const rawW = Math.max(maxX - minX, 40);
  const rawH = Math.max(maxY - minY, 40);

  const viewBox = `${minX - padding} ${minY - padding} ${rawW + padding * 2} ${rawH + padding * 2}`;

  const atomMap = new Map<string, ChemAtom>();
  atoms.forEach((a) => atomMap.set(a.id, a));

  const renderBond = (bond: ChemBond) => {
    const a1 = atomMap.get(bond.source);
    const a2 = atomMap.get(bond.target);
    if (!a1 || !a2) return null;

    const isCut = bond.isCleaved || bond.id === highlightBondId;
    const dx = a2.x - a1.x;
    const dy = a2.y - a1.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    // Perpendicular unit vector
    const px = -uy;
    const py = ux;

    // Calculate endpoint shortening so bond doesn't overlap text if atom has label
    const a1HasText = Boolean(a1.label || a1.element !== 'C');
    const a2HasText = Boolean(a2.label || a2.element !== 'C');
    const offset1 = a1HasText ? 12 : 3;
    const offset2 = a2HasText ? 12 : 3;

    const x1 = a1.x + ux * offset1;
    const y1 = a1.y + uy * offset1;
    const x2 = a2.x - ux * offset2;
    const y2 = a2.y - uy * offset2;

    const bondColor = isCut ? '#f43f5e' : strokeColor;
    const bondWidth = isCut ? 3.5 : 2.2;

    const midX = (a1.x + a2.x) / 2;
    const midY = (a1.y + a2.y) / 2;

    return (
      <g
        key={bond.id}
        onClick={() => interactive && onBondClick?.(bond)}
        className={interactive ? 'cursor-pointer group' : ''}
      >
        {/* Invisible wider stroke for easier clicking */}
        {interactive && (
          <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="transparent"
            strokeWidth={14}
            className="hover:stroke-sky-400/20"
          />
        )}

        {/* Bond geometry by type */}
        {bond.type === 'single' && (
          <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={bondColor}
            strokeWidth={bondWidth}
            strokeDasharray={isCut ? '4 3' : undefined}
            strokeLinecap="round"
          />
        )}

        {bond.type === 'double' && (
          <>
            <line
              x1={x1 + px * 2.5}
              y1={y1 + py * 2.5}
              x2={x2 + px * 2.5}
              y2={y2 + py * 2.5}
              stroke={bondColor}
              strokeWidth={bondWidth}
              strokeLinecap="round"
            />
            <line
              x1={x1 - px * 2.5}
              y1={y1 - py * 2.5}
              x2={x2 - px * 2.5}
              y2={y2 - py * 2.5}
              stroke={bondColor}
              strokeWidth={bondWidth}
              strokeLinecap="round"
            />
          </>
        )}

        {bond.type === 'triple' && (
          <>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={bondColor}
              strokeWidth={bondWidth}
              strokeLinecap="round"
            />
            <line
              x1={x1 + px * 4}
              y1={y1 + py * 4}
              x2={x2 + px * 4}
              y2={y2 + py * 4}
              stroke={bondColor}
              strokeWidth={bondWidth}
              strokeLinecap="round"
            />
            <line
              x1={x1 - px * 4}
              y1={y1 - py * 4}
              x2={x2 - px * 4}
              y2={y2 - py * 4}
              stroke={bondColor}
              strokeWidth={bondWidth}
              strokeLinecap="round"
            />
          </>
        )}

        {bond.type === 'aromatic' && (
          <>
            <line
              x1={x1 + px * 2}
              y1={y1 + py * 2}
              x2={x2 + px * 2}
              y2={y2 + py * 2}
              stroke={bondColor}
              strokeWidth={bondWidth}
              strokeLinecap="round"
            />
            <line
              x1={x1 - px * 2}
              y1={y1 - py * 2}
              x2={x2 - px * 2}
              y2={y2 - py * 2}
              stroke={bondColor}
              strokeWidth={1.8}
              strokeDasharray="4 3"
              strokeLinecap="round"
            />
          </>
        )}

        {bond.type === 'wedge' && (
          <polygon
            points={`${x1},${y1} ${x2 + px * 4},${y2 + py * 4} ${x2 - px * 4},${y2 - py * 4}`}
            fill={bondColor}
          />
        )}

        {bond.type === 'dash' && (
          <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={bondColor}
            strokeWidth={bondWidth}
            strokeDasharray="3 3"
            strokeLinecap="round"
          />
        )}

        {/* Retrosynthetic Cleavage Wavy Cut Marker if Cleaved */}
        {isCut && (
          <g transform={`translate(${midX}, ${midY})`}>
            {/* Wavy line perpendicular to the bond */}
            <line
              x1={px * -16}
              y1={py * -16}
              x2={px * 16}
              y2={py * 16}
              stroke="#f43f5e"
              strokeWidth="2.5"
              strokeDasharray="3 2"
            />
            {/* Double hash retro mark // */}
            <circle cx="0" cy="0" r="10" fill="#881337" stroke="#f43f5e" strokeWidth="1.5" />
            <text
              x="0"
              y="3.5"
              fill="#ffffff"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
              className="select-none"
            >
              ✂
            </text>
          </g>
        )}
      </g>
    );
  };

  const renderAtom = (atom: ChemAtom) => {
    const isHetero = atom.element !== 'C' || atom.label;
    const colors = ELEMENT_COLORS[atom.element] || ELEMENT_COLORS.C;
    const atomColor = isDark ? colors.dark : colors.light;

    // Carbon atoms without labels in standard line structures are invisible vertices
    if (!isHetero && !atom.charge && !atom.label) {
      return (
        <g
          key={atom.id}
          onClick={() => interactive && onAtomClick?.(atom)}
          className={interactive ? 'cursor-pointer group' : ''}
        >
          {interactive && (
            <circle
              cx={atom.x}
              cy={atom.y}
              r={10}
              fill="transparent"
              className="hover:fill-sky-400/20"
            />
          )}
        </g>
      );
    }

    const labelText = atom.label || atom.element;

    return (
      <g
        key={atom.id}
        onClick={() => interactive && onAtomClick?.(atom)}
        className={interactive ? 'cursor-pointer' : ''}
      >
        {/* Background circle to mask bond lines underneath */}
        <circle
          cx={atom.x}
          cy={atom.y}
          r={labelText.length > 2 ? 14 : 10}
          fill={isDark ? '#090d16' : '#ffffff'}
          stroke="transparent"
        />

        {/* Atom label text */}
        <text
          x={atom.x}
          y={atom.y + 4.5}
          fill={atomColor}
          fontSize="13"
          fontWeight="700"
          fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto"
          textAnchor="middle"
          className="select-none"
        >
          {labelText}
        </text>

        {/* Formal Charge Badge (+ or -) */}
        {atom.charge !== undefined && atom.charge !== 0 && (
          <g transform={`translate(${atom.x + 9}, ${atom.y - 8})`}>
            <circle
              cx="0"
              cy="0"
              r="6.5"
              fill={atom.charge > 0 ? '#38bdf8' : '#10b981'}
              stroke={isDark ? '#0f172a' : '#ffffff'}
              strokeWidth="1"
            />
            <text
              x="0"
              y="2.5"
              fill="#090d16"
              fontSize="9"
              fontWeight="900"
              textAnchor="middle"
            >
              {atom.charge > 0 ? '+' : '−'}
            </text>
          </g>
        )}
      </g>
    );
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Synthon notation badge if present */}
      {showSynthonBadges && structure.polarity && (
        <div
          className={`absolute top-1.5 right-1.5 z-10 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
            structure.polarity === 'a'
              ? 'bg-sky-950/80 text-sky-400 border border-sky-500/40'
              : structure.polarity === 'd'
              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
              : 'bg-slate-800 text-slate-300'
          }`}
        >
          {structure.polarity === 'a' ? 'Synthon a (Acceptor ⁺)' : 'Synthon d (Donor ⁻)'}
          {structure.synthonOrder ? ` [${structure.polarity}${structure.synthonOrder}]` : ''}
        </div>
      )}

      {/* Main SVG Vector Canvas */}
      <svg
        viewBox={viewBox}
        width={width}
        height={height}
        className="w-full h-full overflow-visible transition-all duration-200"
        style={{ backgroundColor: bgColor }}
      >
        {/* Bonds Layer */}
        <g id="bonds">{bonds.map(renderBond)}</g>

        {/* Atoms Layer */}
        {showAtomLabels && <g id="atoms">{atoms.map(renderAtom)}</g>}
      </svg>
    </div>
  );
};
