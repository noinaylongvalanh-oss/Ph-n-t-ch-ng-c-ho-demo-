import React from 'react';
import { X, ArrowRight, Beaker, ShieldAlert, Sparkles, Scale, Info, CheckCircle } from 'lucide-react';
import { RetrosyntheticStep } from '../types/chemistry';
import { MoleculeRenderer } from './MoleculeRenderer';

interface DisconnectionDetailModalProps {
  step: RetrosyntheticStep | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DisconnectionDetailModal: React.FC<DisconnectionDetailModalProps> = ({
  step,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !step) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#222226] bg-[#0F0F12] shadow-2xl text-[#E0E0E0] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#222226] bg-[#0F0F12]/95 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1F1215] border border-rose-500/30 text-rose-400 font-mono font-bold text-xs">
              #{step.stepNumber}
            </span>
            <div>
              <h2 className="text-lg font-serif italic font-medium text-white flex items-center gap-2">
                <span>{step.typeLabelVi}</span>
                <span className="text-xs font-mono text-zinc-400 not-italic">({step.typeLabelEn})</span>
              </h2>
              <p className="text-xs font-mono text-zinc-400 mt-0.5">{step.bondCleavedDescriptionVi}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-[#16161A] hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Visual Transformation: Target Molecule ===> Synthons & Precursors */}
          <div className="rounded-xl border border-[#222226] bg-[#16161A] p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#222226] text-[10px] uppercase font-mono font-semibold">
              <span className="text-indigo-400 tracking-wider">Phân tử đích (Target Molecule)</span>
              <span className="text-rose-400 flex items-center gap-1">
                <span>Phân cắt tổng hợp ngược</span>
                <span className="text-base font-bold">⇒</span>
              </span>
              <span className="text-emerald-400 tracking-wider">Synthons & Hóa chất tương đương</span>
            </div>

            <div className="mt-4 flex flex-col md:flex-row items-center justify-around gap-6">
              {/* Target molecule info */}
              <div className="flex flex-col items-center">
                <span className="mb-2 text-xs font-bold text-white font-serif italic">{step.targetName}</span>
                <div className="rounded-xl border border-[#222226] bg-[#0A0A0C] p-4 text-center">
                  <div className="text-sm font-semibold text-indigo-300 py-3 px-6">
                    {step.targetName}
                    <div className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">Liên kết bị phân cắt ✂</div>
                  </div>
                </div>
              </div>

              {/* Retrosynthetic Arrow symbol */}
              <div className="flex flex-col items-center justify-center text-center px-2">
                <div className="font-mono text-2xl md:text-3xl text-rose-400 font-bold tracking-widest select-none">
                  ═══▷
                </div>
                <span className="text-[10px] font-mono text-zinc-400 mt-1 uppercase tracking-wider">
                  {step.disconnectionType.replace('_', ' ')}
                </span>
              </div>

              {/* Generated Synthons */}
              <div className="flex flex-col gap-3">
                {step.synthons.length > 0 ? (
                  step.synthons.map((syn) => (
                    <div
                      key={syn.id}
                      className={`flex items-center gap-3 rounded-lg border p-3 ${
                        syn.polarity === 'electrophilic'
                          ? 'border-indigo-500/30 bg-[#0A0A0C]'
                          : 'border-emerald-500/30 bg-[#0A0A0C]'
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-md font-mono font-bold text-sm ${
                          syn.polarity === 'electrophilic'
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {syn.coreyNotation}
                      </div>
                      <div className="text-xs">
                        <div className="font-semibold text-white font-serif">{syn.name}</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">{syn.descriptionVi}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-[#222226] bg-[#0A0A0C] p-3 text-xs text-zinc-400 italic">
                    Chuyển đổi nhóm chức (FGI) hoặc phản ứng đóng vòng trực tiếp không qua synthon rời.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Synthetic Equivalents Table */}
          {step.synthons.some((s) => s.syntheticEquivalents.length > 0) && (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-indigo-400 font-semibold flex items-center gap-2 mb-3">
                <Beaker className="w-4 h-4 text-emerald-400" />
                Hóa chất tương đương thực tế (Synthetic Equivalents)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {step.synthons.map((syn) => (
                  <div key={syn.id} className="rounded-xl border border-[#222226] bg-[#16161A] p-4">
                    <div className="flex items-center justify-between pb-2 border-b border-[#222226] mb-3">
                      <span className="text-xs font-mono font-bold text-zinc-200">
                        Synthon {syn.coreyNotation}: {syn.formula}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                          syn.polarity === 'electrophilic'
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {syn.polarity === 'electrophilic' ? 'Acceptor (Ái điện tử)' : 'Donor (Ái nhân)'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {syn.syntheticEquivalents.map((eq) => (
                        <div key={eq.id} className="rounded-lg bg-[#0A0A0C] p-2.5 border border-[#222226]">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-emerald-400 font-serif">{eq.nameVi}</span>
                            <span className="text-[11px] font-mono text-zinc-400">{eq.formula}</span>
                          </div>
                          <p className="mt-1 text-[11px] text-zinc-300 leading-relaxed">{eq.notesVi}</p>
                          <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                            <span className="px-1.5 py-0.5 rounded bg-[#16161A] border border-[#222226] text-zinc-300">
                              {eq.approximateCostVi}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Forward Reaction Details */}
          <div className="rounded-xl border border-[#222226] bg-[#16161A] p-5">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-indigo-400 font-semibold flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Điều kiện phản ứng tổng hợp thuận (Forward Synthesis Protocol)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4 font-mono">
              <div className="rounded-lg bg-[#0A0A0C] p-3 border border-[#222226]">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">Thuốc thử chính (Reagents)</span>
                <span className="text-xs font-semibold text-zinc-200">{step.forwardReaction.reagents}</span>
              </div>

              <div className="rounded-lg bg-[#0A0A0C] p-3 border border-[#222226]">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">Xúc tác (Catalyst)</span>
                <span className="text-xs font-semibold text-zinc-200">
                  {step.forwardReaction.catalyst || 'Không cần xúc tác'}
                </span>
              </div>

              <div className="rounded-lg bg-[#0A0A0C] p-3 border border-[#222226]">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">Dung môi (Solvent)</span>
                <span className="text-xs font-semibold text-zinc-200">
                  {step.forwardReaction.solvent || 'Không dung môi'}
                </span>
              </div>

              <div className="rounded-lg bg-[#0A0A0C] p-3 border border-[#222226]">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">Nhiệt độ (Temperature)</span>
                <span className="text-xs font-semibold text-zinc-200">
                  {step.forwardReaction.temperature || 'Nhiệt độ phòng (25 °C)'}
                </span>
              </div>

              <div className="rounded-lg bg-[#0A0A0C] p-3 border border-[#222226]">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">Thời gian (Duration)</span>
                <span className="text-xs font-semibold text-zinc-200">
                  {step.forwardReaction.duration || '1 - 2 giờ'}
                </span>
              </div>

              <div className="rounded-lg bg-[#0A0A0C] p-3 border border-[#222226]">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">Hiệu suất dự kiến (Yield)</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <span>{step.forwardReaction.typicalYield}%</span>
                  <CheckCircle className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Mechanism & Details */}
            <div className="space-y-3 text-xs">
              <div className="rounded-lg bg-[#0A0A0C] p-3.5 border border-[#222226]">
                <span className="font-mono text-[10px] uppercase tracking-wider text-indigo-400 block mb-1 font-semibold">
                  Cơ chế phản ứng (Reaction Mechanism):
                </span>
                <p className="text-zinc-300 leading-relaxed">{step.forwardReaction.mechanismVi}</p>
              </div>

              {step.forwardReaction.byproducts && (
                <div className="rounded-lg bg-[#0A0A0C] p-3.5 border border-[#222226]">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 block mb-1 font-semibold">
                    Sản phẩm phụ tách ra (Byproducts):
                  </span>
                  <p className="text-zinc-300 font-mono text-[11px]">{step.forwardReaction.byproducts}</p>
                </div>
              )}

              {step.forwardReaction.safetyNotesVi && (
                <div className="rounded-lg bg-[#1F1215] p-3.5 border border-rose-500/30 text-rose-200 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider font-semibold block text-rose-300">
                      Lưu ý an toàn thực nghiệm:
                    </span>
                    <p className="text-[11px] mt-0.5 text-zinc-300">{step.forwardReaction.safetyNotesVi}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Green Chemistry & Atom Economy */}
          <div className="flex flex-col sm:flex-row items-center justify-between rounded-xl border border-[#222226] bg-[#16161A] p-4.5 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono font-semibold text-zinc-200 block">
                  Hiệu quả nguyên tử (Atom Economy): {step.atomEconomyPercent}%
                </span>
                <span className="text-[11px] text-zinc-400">
                  {step.forwardReaction.greenChemistryNotesVi ||
                    'Đo lường tỷ lệ khối lượng nguyên tử từ chất tham gia đi vào cấu trúc sản phẩm mong muốn.'}
                </span>
              </div>
            </div>
            <div className="w-full sm:w-32 bg-[#0A0A0C] border border-[#222226] rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-2.5 rounded-full"
                style={{ width: `${Math.min(step.atomEconomyPercent, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#222226] bg-[#0F0F12] px-6 py-3.5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full border border-[#333338] bg-[#16161A] hover:bg-[#202025] px-5 py-1.5 text-xs font-mono text-zinc-200 transition cursor-pointer"
          >
            Đóng bảng chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};
