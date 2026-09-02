import React from 'react';
import { TargetMoleculeEntry, RetrosyntheticRoute } from '../types/chemistry';
import { ArrowRight, CheckCircle2, FlaskConical, Thermometer, Clock, ShieldAlert, Sparkles } from 'lucide-react';
import { MoleculeRenderer } from './MoleculeRenderer';

interface ForwardSynthesisViewProps {
  entry: TargetMoleculeEntry;
  activeRouteId?: string;
}

export const ForwardSynthesisView: React.FC<ForwardSynthesisViewProps> = ({
  entry,
  activeRouteId,
}) => {
  const routes = entry.routes || [];
  const currentRoute = routes.find((r) => r.id === activeRouteId) || routes[0] || null;

  if (!currentRoute) return null;

  // In forward synthesis, steps run in reverse order of retrosynthesis:
  // Retrosynthesis: TM -> Precursor 1 -> SM
  // Forward Synthesis: SM -> Precursor 1 -> TM
  const forwardSteps = [...currentRoute.steps].reverse();

  let cumulativeYield = 100;

  return (
    <div className="space-y-6">
      {/* Route Banner */}
      <div className="rounded-xl border border-emerald-500/30 bg-[#16161A] p-4.5">
        <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] mb-1.5">
          <FlaskConical className="w-4 h-4" />
          <span>Quy trình điều chế thuận trong phòng thí nghiệm (Forward Synthetic Roadmap)</span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Chuyển đổi quy trình phân tích ngược thành các bước tổng hợp xuôi từ hóa chất thương mại ban đầu đến sản phẩm
          đích <strong className="text-white font-serif italic">{entry.nameVi}</strong>.
        </p>
      </div>

      {/* Starting Materials Checklist */}
      <div className="rounded-xl border border-[#222226] bg-[#16161A] p-5">
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-mono font-semibold mb-3.5 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Danh mục hóa chất ban đầu cần chuẩn bị (Starting Materials Inventory)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {currentRoute.startingMaterials.map((sm, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 rounded-lg border border-[#222226] bg-[#0A0A0C] p-3 text-xs font-mono"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
                {i + 1}
              </span>
              <span className="font-medium text-zinc-200">{sm}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step by Step Forward Roadmap */}
      <div className="space-y-6">
        {forwardSteps.map((step, idx) => {
          cumulativeYield = Math.round((cumulativeYield * step.forwardReaction.typicalYield) / 100);

          return (
            <div
              key={step.id}
              className="rounded-2xl border border-[#222226] bg-[#16161A] p-5 sm:p-6 shadow-xl relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#222226] gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs shadow-md shadow-indigo-600/30">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-serif text-white flex items-center gap-2">
                      <span className="italic font-medium">{step.forwardReaction.nameVi}</span>
                      <span className="text-xs font-mono text-zinc-400 font-normal">({step.forwardReaction.nameEn})</span>
                    </h4>
                    <span className="text-xs font-mono text-zinc-400">{step.bondCleavedDescriptionVi}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-emerald-400 font-semibold">
                    Hiệu suất bước: {step.forwardReaction.typicalYield}%
                  </span>
                  <span className="text-zinc-500 hidden sm:inline">
                    Tích lũy: ~{cumulativeYield}%
                  </span>
                </div>
              </div>

              {/* Reaction Conditions Grid */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="rounded-lg bg-[#0A0A0C] p-3 border border-[#222226]">
                  <span className="text-zinc-500 block text-[10px] uppercase font-mono tracking-wider mb-1">Thuốc thử (Reagents):</span>
                  <span className="font-mono font-semibold text-zinc-200">{step.forwardReaction.reagents}</span>
                </div>

                <div className="rounded-lg bg-[#0A0A0C] p-3 border border-[#222226]">
                  <span className="text-zinc-500 block text-[10px] uppercase font-mono tracking-wider mb-1">Xúc tác & Dung môi:</span>
                  <span className="font-mono font-semibold text-zinc-200">
                    {step.forwardReaction.catalyst || 'Không'} • {step.forwardReaction.solvent || 'Không dung môi'}
                  </span>
                </div>

                <div className="rounded-lg bg-[#0A0A0C] p-3 border border-[#222226]">
                  <span className="text-zinc-500 block text-[10px] uppercase font-mono tracking-wider mb-1 flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-amber-400" />
                    Nhiệt độ:
                  </span>
                  <span className="font-mono font-semibold text-zinc-200">{step.forwardReaction.temperature}</span>
                </div>

                <div className="rounded-lg bg-[#0A0A0C] p-3 border border-[#222226]">
                  <span className="text-zinc-500 block text-[10px] uppercase font-mono tracking-wider mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    Thời gian phản ứng:
                  </span>
                  <span className="font-mono font-semibold text-zinc-200">{step.forwardReaction.duration}</span>
                </div>
              </div>

              {/* Mechanism & Details */}
              <div className="mt-4 rounded-xl bg-[#0A0A0C] p-4 border border-[#222226] text-xs">
                <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-mono font-semibold block mb-1.5">
                  Cơ chế & Thao tác kỹ thuật:
                </span>
                <p className="text-zinc-300 leading-relaxed">{step.forwardReaction.mechanismVi}</p>
                {step.forwardReaction.byproducts && (
                  <p className="text-amber-400/90 mt-2 text-[11px] font-mono">
                    Sản phẩm phụ: {step.forwardReaction.byproducts} (tách bằng kết tinh hoặc chưng cất).
                  </p>
                )}
              </div>

              {/* Safety notice if present */}
              {step.forwardReaction.safetyNotesVi && (
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#1F1215] p-2.5 border border-rose-500/30 text-rose-300 text-xs font-mono">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{step.forwardReaction.safetyNotesVi}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Target Molecule Completion Banner */}
      <div className="rounded-2xl border border-emerald-500/30 bg-[#16161A] p-6 text-center shadow-2xl relative overflow-hidden">
        <Sparkles className="w-7 h-7 text-emerald-400 mx-auto mb-2" />
        <h3 className="font-serif text-lg font-normal italic text-white mb-1">Thu nhận sản phẩm tinh khiết: {entry.nameVi}</h3>
        <p className="text-xs text-zinc-300 max-w-xl mx-auto leading-relaxed">
          Hoàn thành chuỗi tổng hợp {forwardSteps.length} bước với hiệu suất tích lũy ước tính ~
          {cumulativeYield}%. Tiến hành phân tích độ tinh khiết bằng TLC, HPLC và xác nhận cấu trúc bằng phổ NMR/IR.
        </p>
      </div>
    </div>
  );
};
