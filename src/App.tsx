import React, { useState, useMemo } from 'react';
import { TARGET_MOLECULES } from './data/moleculesLibrary';
import { TargetMoleculeEntry } from './types/chemistry';
import { RetrosynthesisTree } from './components/RetrosynthesisTree';
import { ForwardSynthesisView } from './components/ForwardSynthesisView';
import { CustomBuilder } from './components/CustomBuilder';
import { SynthonGuide } from './components/SynthonGuide';
import { ReactionsReference } from './components/ReactionsReference';
import { MoleculeRenderer } from './components/MoleculeRenderer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallButton } from './components/PWAInstallButton';
import {
  FlaskConical,
  Compass,
  ArrowRightLeft,
  BookOpen,
  Library,
  Search,
  CheckCircle2,
  Atom,
  Scissors,
  Layers,
  Sparkles,
  Info,
  ChevronRight,
  Download,
} from 'lucide-react';

type TabView = 'retrosynthesis' | 'forward' | 'workbench' | 'synthons' | 'reactions';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabView>('retrosynthesis');
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string>(TARGET_MOLECULES[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeRouteId, setActiveRouteId] = useState<string | undefined>(undefined);

  // Current target molecule
  const currentMolecule = useMemo<TargetMoleculeEntry>(() => {
    return TARGET_MOLECULES.find((m) => m.id === selectedMoleculeId) || TARGET_MOLECULES[0];
  }, [selectedMoleculeId]);

  // Filtered molecules for library list
  const filteredMolecules = useMemo(() => {
    if (!searchQuery.trim()) return TARGET_MOLECULES;
    const q = searchQuery.toLowerCase();
    return TARGET_MOLECULES.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.nameVi.toLowerCase().includes(q) ||
        m.formula.toLowerCase().includes(q) ||
        m.categoryLabelVi.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#E0E0E0] flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-[#222226] bg-[#0F0F12]/95 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-black font-bold font-mono shadow-md shadow-indigo-500/20 text-lg">
              <span>⇒</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-serif tracking-tight text-white font-medium flex items-center gap-2">
                  <span>RETRO-SYNTH</span>
                  <span className="text-xs font-mono text-indigo-400 opacity-80 font-normal">v2.0 PWA</span>
                </h1>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 hidden sm:block font-mono mt-0.5">
                Local Retrosynthetic Analysis Engine • Offline Mode
              </p>
            </div>
          </div>

          {/* Action Tools: Offline Indicator & PWA Install Button */}
          <div className="flex items-center gap-3">
            <OfflineIndicator />
            <div className="h-6 w-px bg-[#222226] hidden sm:block"></div>
            <PWAInstallButton />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mx-auto max-w-7xl mt-3.5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('retrosynthesis')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'retrosynthesis'
                ? 'bg-[#1C1C21] border-l-2 border-indigo-500 text-white shadow-sm'
                : 'text-[#E0E0E0]/60 hover:text-white hover:bg-[#16161A]'
            }`}
          >
            <Scissors className="w-3.5 h-3.5 text-indigo-400" />
            <span>Phân tích Ngược (Retrosynthesis)</span>
          </button>

          <button
            onClick={() => setActiveTab('forward')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'forward'
                ? 'bg-[#1C1C21] border-l-2 border-emerald-500 text-white shadow-sm'
                : 'text-[#E0E0E0]/60 hover:text-white hover:bg-[#16161A]'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
            <span>Quy trình Xuôi (Forward Synthesis)</span>
          </button>

          <button
            onClick={() => setActiveTab('workbench')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'workbench'
                ? 'bg-[#1C1C21] border-l-2 border-indigo-400 text-white shadow-sm'
                : 'text-[#E0E0E0]/60 hover:text-white hover:bg-[#16161A]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>Bàn phân tích Tùy biến (Rules Engine)</span>
          </button>

          <button
            onClick={() => setActiveTab('synthons')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'synthons'
                ? 'bg-[#1C1C21] border-l-2 border-amber-500 text-white shadow-sm'
                : 'text-[#E0E0E0]/60 hover:text-white hover:bg-[#16161A]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Lý thuyết Synthon (aⁿ / dⁿ)</span>
          </button>

          <button
            onClick={() => setActiveTab('reactions')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'reactions'
                ? 'bg-[#1C1C21] border-l-2 border-rose-500 text-white shadow-sm'
                : 'text-[#E0E0E0]/60 hover:text-white hover:bg-[#16161A]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-rose-400" />
            <span>Từ điển Phản ứng Tên gọi</span>
          </button>
        </div>
      </header>

      {/* Main App Body */}
      <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 space-y-6">
        {/* Retrosynthesis and Forward tabs share the Molecule Library Drawer */}
        {(activeTab === 'retrosynthesis' || activeTab === 'forward') && (
          <div className="space-y-6">
            {/* Horizontal Molecule Shelf / Carousel */}
            <div className="rounded-2xl border border-[#222226] bg-[#0D0D10] p-5 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#222226] gap-3">
                <div className="flex items-center gap-2">
                  <Atom className="w-4 h-4 text-indigo-400" />
                  <h2 className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-semibold font-mono">
                    Target Molecules Library • Kho phân tử đích
                  </h2>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Tìm Aspirin, Paracetamol, DEET..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg bg-[#16161A] border border-[#222226] pl-8 pr-3 py-1.5 text-xs text-[#E0E0E0] placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Molecule Chips / Cards */}
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {filteredMolecules.map((m) => {
                  const isSelected = m.id === selectedMoleculeId;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedMoleculeId(m.id);
                        setActiveRouteId(undefined);
                      }}
                      className={`flex flex-col items-start rounded-xl border p-3.5 min-w-[160px] sm:min-w-[180px] text-left transition cursor-pointer shrink-0 ${
                        isSelected
                          ? 'border-indigo-500/80 bg-[#16161A] text-white shadow-[0_0_15px_rgba(99,102,241,0.15)] border-l-2 border-l-indigo-500'
                          : 'border-[#222226] bg-[#16161A]/50 text-zinc-400 hover:border-[#333338] hover:text-zinc-200 hover:bg-[#16161A]'
                      }`}
                    >
                      <span className="text-xs font-bold text-white truncate w-full">{m.nameVi}</span>
                      <span className="text-[10px] font-mono text-indigo-300/80 mt-0.5">{m.formula}</span>
                      <div className="mt-2.5 flex items-center justify-between w-full text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-[#0A0A0C] border border-[#222226] text-zinc-400 font-mono">
                          {m.categoryLabelVi}
                        </span>
                        <span className="text-emerald-400 font-mono font-medium">{m.routes.length} lộ trình</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Molecule Metadata Card */}
            <div className="rounded-2xl border border-[#222226] bg-[#16161A] p-5 sm:p-6 shadow-2xl relative overflow-hidden">
              <div className="tech-dot-grid absolute inset-0 opacity-10 pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#222226]">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="font-serif text-2xl text-white italic font-normal tracking-tight">{currentMolecule.nameVi}</h2>
                    <span className="text-xs font-mono text-zinc-400">({currentMolecule.name})</span>
                    <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-mono text-indigo-300">
                      {currentMolecule.categoryLabelVi}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-2 leading-relaxed max-w-3xl">{currentMolecule.descriptionVi}</p>
                </div>

                {/* Chemical badges */}
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <div className="rounded-lg bg-[#0A0A0C] border border-[#222226] px-3.5 py-2">
                    <span className="text-[10px] opacity-50 uppercase font-mono block">Formula</span>
                    <span className="text-indigo-300 font-semibold">{currentMolecule.formula}</span>
                  </div>
                  <div className="rounded-lg bg-[#0A0A0C] border border-[#222226] px-3.5 py-2">
                    <span className="text-[10px] opacity-50 uppercase font-mono block">MW</span>
                    <span className="text-emerald-400 font-semibold">{currentMolecule.molecularWeight} g/mol</span>
                  </div>
                  {currentMolecule.casNumber && (
                    <div className="rounded-lg bg-[#0A0A0C] border border-[#222226] px-3.5 py-2">
                      <span className="text-[10px] opacity-50 uppercase font-mono block">CAS Registry</span>
                      <span className="text-zinc-300">{currentMolecule.casNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Functional Groups & Strategic Disconnection Sites summary */}
              <div className="relative z-10 mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-mono font-semibold mr-1">
                  Nhóm chức & Liên kết chiến lược:
                </span>
                {(currentMolecule.functionalGroupsVi ||
                  currentMolecule.routes[0]?.steps.map((s) => s.typeLabelVi) || [
                    'Khung thơm C₆H₅',
                    'Dị tố heteroatom',
                  ]
                ).map((fg, i) => (
                  <span
                    key={i}
                    className="rounded border border-[#222226] bg-[#0A0A0C] px-2.5 py-1 text-xs text-zinc-300 font-mono"
                  >
                    {fg}
                  </span>
                ))}
              </div>
            </div>

            {/* Active View: Retrosynthesis Tree vs Forward Synthesis Roadmap */}
            {activeTab === 'retrosynthesis' && (
              <RetrosynthesisTree
                entry={currentMolecule}
                activeRouteId={activeRouteId}
                onRouteChange={(routeId) => setActiveRouteId(routeId)}
              />
            )}

            {activeTab === 'forward' && (
              <ForwardSynthesisView entry={currentMolecule} activeRouteId={activeRouteId} />
            )}
          </div>
        )}

        {/* Workbench Tab */}
        {activeTab === 'workbench' && <CustomBuilder />}

        {/* Synthon Theory & Polarity Guide Tab */}
        {activeTab === 'synthons' && <SynthonGuide />}

        {/* Reactions Reference Tab */}
        {activeTab === 'reactions' && <ReactionsReference />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#222226] bg-[#0F0F12] px-4 sm:px-6 py-6 text-center text-xs text-zinc-400 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Phương pháp phân tích tổng hợp ngược E.J. Corey (Nobel Hóa học 1990)
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Vận hành 100% Ngoại tuyến (Progressive Web App - Service Worker)
          </span>
        </div>
        <p className="text-[11px] text-zinc-500 font-mono">
          Tất cả tính toán cấu trúc, synthon và phản ứng đều thực thi trực tiếp trên thiết bị (Local Client Storage).
        </p>
      </footer>
    </div>
  );
}
