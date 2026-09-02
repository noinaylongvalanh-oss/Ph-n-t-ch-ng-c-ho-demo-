import React, { useState, useMemo } from 'react';
import { MolecularStructure, RetrosyntheticStep } from '../types/chemistry';
import { analyzeDisconnections, DisconnectionCandidate } from '../engine/retrosynthEngine';
import { MoleculeRenderer } from './MoleculeRenderer';
import { DisconnectionDetailModal } from './DisconnectionDetailModal';
import { TARGET_MOLECULES } from '../data/moleculesLibrary';
import { Sparkles, Scissors, CheckCircle2, ChevronRight, Layers, Beaker, HelpCircle, Compass } from 'lucide-react';

interface PresetScaffold {
  id: string;
  name: string;
  structure: MolecularStructure;
}

const PRESET_SCAFFOLDS: PresetScaffold[] = [
  {
    id: 'phenyl_ester',
    name: 'Este thơm (Phenyl Acetate)',
    structure: {
      id: 'phenyl_acetate',
      name: 'Phenyl Acetate',
      formula: 'CH₃COOC₆H₅',
      molecularWeight: 136.15,
      atoms: [
        { id: 'b1', element: 'C', x: 70, y: 70 },
        { id: 'b2', element: 'C', x: 105, y: 50 },
        { id: 'b3', element: 'C', x: 140, y: 70 },
        { id: 'b4', element: 'C', x: 140, y: 110 },
        { id: 'b5', element: 'C', x: 105, y: 130 },
        { id: 'b6', element: 'C', x: 70, y: 110 },
        { id: 'o1', element: 'O', x: 175, y: 50, label: '-O-' },
        { id: 'c_carb', element: 'C', x: 210, y: 70 },
        { id: 'o_carb', element: 'O', x: 210, y: 110, label: '=O' },
        { id: 'c_me', element: 'C', x: 245, y: 50, label: '-CH₃' },
      ],
      bonds: [
        { id: 'bb1', source: 'b1', target: 'b2', type: 'aromatic' },
        { id: 'bb2', source: 'b2', target: 'b3', type: 'aromatic' },
        { id: 'bb3', source: 'b3', target: 'b4', type: 'aromatic' },
        { id: 'bb4', source: 'b4', target: 'b5', type: 'aromatic' },
        { id: 'bb5', source: 'b5', target: 'b6', type: 'aromatic' },
        { id: 'bb6', source: 'b6', target: 'b1', type: 'aromatic' },
        { id: 'bo1', source: 'b3', target: 'o1', type: 'single' },
        { id: 'bo2', source: 'o1', target: 'c_carb', type: 'single', isCleavageSite: true, cleavageLabel: 'C-O Este' },
        { id: 'bo3', source: 'c_carb', target: 'o_carb', type: 'double' },
        { id: 'bo4', source: 'c_carb', target: 'c_me', type: 'single' },
      ],
    },
  },
  {
    id: 'acetanilide',
    name: 'Amit thơm (Acetanilide)',
    structure: {
      id: 'acetanilide',
      name: 'Acetanilide',
      formula: 'CH₃CONHC₆H₅',
      molecularWeight: 135.17,
      atoms: [
        { id: 'a1', element: 'C', x: 70, y: 70 },
        { id: 'a2', element: 'C', x: 105, y: 50 },
        { id: 'a3', element: 'C', x: 140, y: 70 },
        { id: 'a4', element: 'C', x: 140, y: 110 },
        { id: 'a5', element: 'C', x: 105, y: 130 },
        { id: 'a6', element: 'C', x: 70, y: 110 },
        { id: 'n1', element: 'N', x: 175, y: 50, label: '-NH-' },
        { id: 'c_carb', element: 'C', x: 210, y: 70 },
        { id: 'o_carb', element: 'O', x: 210, y: 110, label: '=O' },
        { id: 'c_me', element: 'C', x: 245, y: 50, label: '-CH₃' },
      ],
      bonds: [
        { id: 'ab1', source: 'a1', target: 'a2', type: 'aromatic' },
        { id: 'ab2', source: 'a2', target: 'a3', type: 'aromatic' },
        { id: 'ab3', source: 'a3', target: 'a4', type: 'aromatic' },
        { id: 'ab4', source: 'a4', target: 'a5', type: 'aromatic' },
        { id: 'ab5', source: 'a5', target: 'a6', type: 'aromatic' },
        { id: 'ab6', source: 'a6', target: 'a1', type: 'aromatic' },
        { id: 'an1', source: 'a3', target: 'n1', type: 'single' },
        { id: 'an2', source: 'n1', target: 'c_carb', type: 'single', isCleavageSite: true, cleavageLabel: 'C-N Amit' },
        { id: 'an3', source: 'c_carb', target: 'o_carb', type: 'double' },
        { id: 'an4', source: 'c_carb', target: 'c_me', type: 'single' },
      ],
    },
  },
  {
    id: 'acetophenone',
    name: 'Ceton thơm (Acetophenone / Friedel-Crafts)',
    structure: {
      id: 'acetophenone',
      name: 'Acetophenone',
      formula: 'C₆H₅COCH₃',
      molecularWeight: 120.15,
      atoms: [
        { id: 'f1', element: 'C', x: 70, y: 70 },
        { id: 'f2', element: 'C', x: 105, y: 50 },
        { id: 'f3', element: 'C', x: 140, y: 70 },
        { id: 'f4', element: 'C', x: 140, y: 110 },
        { id: 'f5', element: 'C', x: 105, y: 130 },
        { id: 'f6', element: 'C', x: 70, y: 110 },
        { id: 'fc_c', element: 'C', x: 180, y: 50 },
        { id: 'fc_o', element: 'O', x: 180, y: 95, label: '=O' },
        { id: 'fc_me', element: 'C', x: 215, y: 35, label: '-CH₃' },
      ],
      bonds: [
        { id: 'fb1', source: 'f1', target: 'f2', type: 'aromatic' },
        { id: 'fb2', source: 'f2', target: 'f3', type: 'aromatic' },
        { id: 'fb3', source: 'f3', target: 'f4', type: 'aromatic' },
        { id: 'fb4', source: 'f4', target: 'f5', type: 'aromatic' },
        { id: 'fb5', source: 'f5', target: 'f6', type: 'aromatic' },
        { id: 'fb6', source: 'f6', target: 'f1', type: 'aromatic' },
        { id: 'f_ar_c', source: 'f3', target: 'fc_c', type: 'single', isCleavageSite: true, cleavageLabel: 'C-C F-C' },
        { id: 'f_co', source: 'fc_c', target: 'fc_o', type: 'double' },
        { id: 'f_cme', source: 'fc_c', target: 'fc_me', type: 'single' },
      ],
    },
  },
];

export const CustomBuilder: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('aspirin');
  const [selectedDisconnection, setSelectedDisconnection] = useState<RetrosyntheticStep | null>(null);

  // Combine TARGET_MOLECULES and custom scaffolds
  const activeStructure = useMemo<MolecularStructure>(() => {
    // Check in TARGET_MOLECULES first
    const tm = TARGET_MOLECULES.find((m) => m.id === selectedPresetId);
    if (tm) return tm.structure;

    // Check in PRESET_SCAFFOLDS
    const sc = PRESET_SCAFFOLDS.find((s) => s.id === selectedPresetId);
    if (sc) return sc.structure;

    return TARGET_MOLECULES[0].structure;
  }, [selectedPresetId]);

  // Run offline Retrosynthetic Disconnection Engine
  const disconnections = useMemo<DisconnectionCandidate[]>(() => {
    return analyzeDisconnections(activeStructure);
  }, [activeStructure]);

  return (
    <div className="space-y-6">
      {/* Workbench Header Banner */}
      <div className="rounded-2xl border border-[#222226] bg-[#16161A] p-6 shadow-xl relative overflow-hidden">
        <div className="tech-dot-grid absolute inset-0 opacity-10 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-serif italic text-white font-medium">
              Bàn làm việc Phân tích Tổng hợp ngược Ngoại tuyến (Offline Retrosynth Workbench)
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl mt-1">
              Thuật toán nhận diện nhóm chức & quét liên kết tự động chạy ngay trong trình duyệt. Phân tích đa vị trí phân
              cắt (Disconnection Points), tính toán Synthon Corey, độ ưu tiên chiến lược và điều kiện phản ứng thuận.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Structure Selector */}
      <div className="rounded-xl border border-[#222226] bg-[#16161A] p-4.5">
        <label className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-mono font-semibold block mb-2.5">
          Chọn cấu trúc phân tử để giải mã tổng hợp ngược:
        </label>
        <div className="flex flex-wrap gap-2">
          {TARGET_MOLECULES.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedPresetId(m.id)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-mono transition cursor-pointer ${
                selectedPresetId === m.id
                  ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] font-semibold'
                  : 'border border-[#333338] bg-[#0A0A0C] text-zinc-300 hover:bg-[#202025] hover:text-white'
              }`}
            >
              {m.nameVi}
            </button>
          ))}
          {PRESET_SCAFFOLDS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedPresetId(s.id)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-mono transition cursor-pointer ${
                selectedPresetId === s.id
                  ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] font-semibold'
                  : 'border border-[#333338] bg-[#0A0A0C] text-zinc-300 hover:bg-[#202025] hover:text-white'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: 2D Chemical Visualization & Properties */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-[#222226] bg-[#16161A] p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#222226]">
              <div>
                <h3 className="text-base font-serif italic text-white">{activeStructure.name}</h3>
                <span className="text-xs font-mono text-zinc-400">
                  {activeStructure.formula} • M = {activeStructure.molecularWeight} g/mol
                </span>
              </div>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 text-xs font-mono text-emerald-400">
                {disconnections.length} vị trí phân cắt
              </span>
            </div>

            {/* Molecule SVG canvas */}
            <div className="mt-4 flex justify-center rounded-xl bg-[#0A0A0C] p-4 border border-[#222226]">
              <MoleculeRenderer
                structure={activeStructure}
                width={300}
                height={200}
                theme="dark"
              />
            </div>

            <div className="mt-4 rounded-xl bg-[#0A0A0C] p-3.5 border border-[#222226] text-xs text-zinc-300">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-indigo-400 mb-1 font-semibold">
                <Scissors className="w-3.5 h-3.5" />
                <span>Quy tắc phân cắt E.J. Corey:</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Ưu tiên phân cắt các liên kết dị tố (C-X, C-O, C-N) trước vì đây là những liên kết có sẵn phản ứng thuận
                độ tin cậy cao, sau đó mới phân cắt khung Carbon-Carbon (C-C).
              </p>
            </div>
          </div>
        </div>

        {/* Right column: Disconnection Candidates Ranked by Strategic Score */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-[#222226] bg-[#16161A] p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#222226]">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-indigo-400 font-semibold">
                  Các vị trí phân cắt được phát hiện (Ranked Candidates)
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-500">Offline Rules Engine</span>
            </div>

            <div className="mt-4 space-y-3">
              {disconnections.length > 0 ? (
                disconnections.map((cand, idx) => (
                  <div
                    key={cand.id}
                    className="rounded-xl border border-[#222226] bg-[#0A0A0C] p-4.5 hover:border-indigo-500/50 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1F1215] border border-rose-500/30 text-rose-400 font-mono font-bold text-xs shrink-0 mt-0.5">
                          #{idx + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-serif italic text-white flex items-center gap-2">
                            <span>{cand.titleVi}</span>
                          </h4>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{cand.descriptionVi}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-block rounded-md bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 text-xs font-mono font-bold text-indigo-300">
                          Điểm: {cand.strategicScore}/100
                        </span>
                      </div>
                    </div>

                    {/* Forward Protocol Preview */}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-3 border-t border-[#222226]">
                      <div className="text-zinc-400 font-mono">
                        <span className="text-zinc-500 block text-[10px] uppercase tracking-wider">Phản ứng thuận:</span>
                        <span className="text-zinc-200 font-medium font-serif">{cand.step.forwardReaction.nameVi}</span>
                      </div>
                      <div className="text-zinc-400 font-mono">
                        <span className="text-zinc-500 block text-[10px] uppercase tracking-wider">Hiệu suất dự tính:</span>
                        <span className="text-emerald-400 font-bold">{cand.step.forwardReaction.typicalYield}%</span>
                      </div>
                    </div>

                    <div className="mt-3.5 flex justify-end">
                      <button
                        onClick={() => setSelectedDisconnection(cand.step)}
                        className="flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-600/90 hover:bg-indigo-600 px-4 py-1.5 text-xs font-mono font-medium text-white transition cursor-pointer shadow-[0_0_15px_rgba(79,70,229,0.2)]"
                      >
                        <span>Chi tiết Synthons & Hóa chất</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-[#222226] p-8 text-center text-zinc-500 text-xs font-mono">
                  Không tìm thấy vị trí phân cắt dị nguyên tử đơn giản cho cấu trúc này. Có thể phân tử là hydrocarbon
                  nguyên bản hoặc yêu cầu phản ứng tạo liên kết C-C đặc thù.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Disconnection Detail Modal */}
      <DisconnectionDetailModal
        step={selectedDisconnection}
        isOpen={Boolean(selectedDisconnection)}
        onClose={() => setSelectedDisconnection(null)}
      />
    </div>
  );
};
