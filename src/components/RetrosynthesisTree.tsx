import React, { useState } from 'react';
import { TargetMoleculeEntry, RetrosyntheticRoute, RetrosyntheticStep } from '../types/chemistry';
import { MoleculeRenderer } from './MoleculeRenderer';
import { DisconnectionDetailModal } from './DisconnectionDetailModal';
import { ArrowDown, Sparkles, Beaker, Check, HelpCircle, Eye, GitBranch, Layers } from 'lucide-react';

interface RetrosynthesisTreeProps {
  entry: TargetMoleculeEntry;
  activeRouteId?: string;
  onRouteChange?: (routeId: string) => void;
  onSelectStep?: (step: RetrosyntheticStep) => void;
}

export const RetrosynthesisTree: React.FC<RetrosynthesisTreeProps> = ({
  entry,
  activeRouteId,
  onRouteChange,
  onSelectStep,
}) => {
  const routes = entry.routes || [];
  const currentRoute = routes.find((r) => r.id === activeRouteId) || routes[0] || null;
  const [selectedStep, setSelectedStep] = useState<RetrosyntheticStep | null>(null);

  if (!currentRoute) {
    return (
      <div className="p-8 text-center text-slate-400">
        Không tìm thấy lộ trình tổng hợp ngược cho phân tử này.
      </div>
    );
  }

  const handleStepClick = (step: RetrosyntheticStep) => {
    setSelectedStep(step);
    onSelectStep?.(step);
  };

  return (
    <div className="space-y-6">
      {/* Route Switcher if molecule has multiple routes */}
      {routes.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#222226] bg-[#0D0D10] p-2.5">
          <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 pl-2 pr-1 font-mono">
            <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
            <span className="uppercase tracking-wider text-[10px]">Lộ trình:</span>
          </span>
          {routes.map((route) => {
            const isActive = route.id === currentRoute.id;
            return (
              <button
                key={route.id}
                onClick={() => onRouteChange?.(route.id)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                    : 'border border-[#333338] bg-[#16161A] text-zinc-300 hover:bg-[#202025] hover:text-white'
                }`}
              >
                <span>{route.nameVi}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-[#0A0A0C] text-zinc-400'
                  }`}
                >
                  {route.totalSteps} bước
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Route Overview Meta Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#222226] bg-[#16161A] p-3.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-mono block mb-1">Số bước phân cắt</span>
          <span className="text-base font-bold text-white font-mono flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-400" />
            {currentRoute.totalSteps} bước
          </span>
        </div>

        <div className="rounded-xl border border-[#222226] bg-[#16161A] p-3.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-mono block mb-1">Hiệu suất ước tính</span>
          <span className="text-base font-bold text-emerald-400 font-mono flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" />
            ~{currentRoute.overallYieldEstimate}%
          </span>
        </div>

        <div className="rounded-xl border border-[#222226] bg-[#16161A] p-3.5 col-span-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-mono block mb-1">Hóa chất ban đầu (Starting Materials)</span>
          <div className="text-xs font-mono font-medium text-zinc-300 truncate">
            {currentRoute.startingMaterials.join(' • ')}
          </div>
        </div>
      </div>

      {/* Retrosynthetic Hierarchy Tree */}
      <div className="relative rounded-2xl border border-dashed border-[#222226] bg-[#0A0A0C] p-4 sm:p-8 overflow-hidden">
        <div className="tech-dot-grid absolute inset-0 opacity-10 pointer-events-none" />
        
        {/* Top Node: Target Molecule (TM) */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3.5 py-1 text-xs font-mono text-indigo-300 shadow-sm mb-3">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span className="uppercase tracking-wider text-[10px]">Phân tử đích (Target Molecule - TM)</span>
          </div>

          <div className="group relative rounded-2xl border border-indigo-500/40 bg-[#16161A] p-5 shadow-2xl transition hover:border-indigo-500 max-w-md w-full text-center">
            <h3 className="font-serif text-xl font-normal text-white italic mb-1">{entry.nameVi}</h3>
            <p className="text-xs font-mono text-zinc-400 mb-3">{entry.formula} • M = {entry.molecularWeight} g/mol</p>
            
            <div className="flex justify-center bg-[#0A0A0C] rounded-xl p-3 border border-[#222226]">
              <MoleculeRenderer
                structure={entry.structure}
                width={260}
                height={160}
                theme="dark"
              />
            </div>
            <div className="mt-3 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              Đường đứt đoạn đỏ biểu thị liên kết chiến lược bị phân cắt
            </div>
          </div>
        </div>

        {/* Retrosynthetic Sequential Steps */}
        <div className="relative z-10 space-y-8 mt-6">
          {currentRoute.steps.map((step) => (
            <div key={step.id} className="relative flex flex-col items-center">
              {/* Retrosynthetic Disconnection Arrow */}
              <div className="my-2 flex flex-col items-center justify-center">
                <button
                  onClick={() => handleStepClick(step)}
                  className="group relative flex items-center gap-3.5 rounded-full border border-indigo-500/40 bg-[#16161A] hover:bg-[#202025] hover:border-indigo-400 px-5 py-2.5 text-indigo-300 transition cursor-pointer shadow-[0_0_20px_rgba(79,70,229,0.15)] active:scale-98"
                  title="Nhấn để xem chi tiết phân cắt và cơ chế phản ứng"
                >
                  <span className="font-mono text-xl font-bold text-indigo-400">═══▷</span>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-serif italic text-white">Bước #{step.stepNumber}: {step.typeLabelVi}</span>
                      <Eye className="w-3.5 h-3.5 text-indigo-400 opacity-70 group-hover:opacity-100" />
                    </div>
                    <span className="text-[10px] font-mono text-indigo-300/80 block uppercase tracking-wider">{step.forwardReaction.nameVi}</span>
                  </div>
                </button>
                <span className="text-[10px] text-zinc-500 mt-1 font-mono uppercase tracking-wider">
                  (Nhấn mũi tên để xem Synthon & Cơ chế chi tiết)
                </span>
              </div>

              {/* Precursors Container */}
              <div className="w-full max-w-2xl mt-4">
                <div className="text-center text-xs font-semibold text-zinc-400 mb-3 flex items-center justify-center gap-2">
                  <Beaker className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono text-[11px] uppercase tracking-wider">Tiền chất trung gian & Hóa chất ban đầu #{step.stepNumber}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {step.precursors.length > 0 ? (
                    step.precursors.map((prec) => (
                      <div
                        key={prec.id}
                        className={`rounded-xl border p-4 transition ${
                          prec.role === 'starting_material'
                            ? 'border-emerald-500/30 bg-[#16161A]'
                            : 'border-[#222226] bg-[#16161A]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-white truncate">{prec.name}</span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-medium ${
                              prec.role === 'starting_material'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-[#0A0A0C] text-zinc-400 border border-[#222226]'
                            }`}
                          >
                            {prec.role === 'starting_material' ? 'Hóa chất ban đầu (SM)' : 'Chất trung gian'}
                          </span>
                        </div>

                        <div className="flex justify-center bg-[#0A0A0C] rounded-lg p-2 border border-[#222226]">
                          <MoleculeRenderer structure={prec} width={200} height={120} theme="dark" />
                        </div>

                        <div className="mt-2 text-center text-[11px] font-mono text-zinc-400">
                          {prec.formula} • M = {prec.molecularWeight}
                        </div>
                      </div>
                    ))
                  ) : (
                    // When detailed precursors are synthetic equivalents
                    <div className="col-span-2 rounded-xl border border-[#222226] bg-[#16161A] p-4">
                      <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider mb-2">
                        Phân mảnh thành các Synthons & Hóa chất tương đương:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {step.synthons.map((syn) => (
                          <div
                            key={syn.id}
                            className="flex items-center gap-2 rounded-lg bg-[#0A0A0C] px-3 py-1.5 border border-[#222226] text-xs"
                          >
                            <span className="font-mono font-bold text-indigo-400">{syn.coreyNotation}</span>
                            <span className="text-zinc-200">{syn.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disconnection Step Modal */}
      <DisconnectionDetailModal
        step={selectedStep}
        isOpen={Boolean(selectedStep)}
        onClose={() => setSelectedStep(null)}
      />
    </div>
  );
};
