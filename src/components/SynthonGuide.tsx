import React, { useState } from 'react';
import { SYNTHON_RULES } from '../data/synthonPolarityData';
import { SynthonRuleRef } from '../types/chemistry';
import { BookOpen, Sparkles, Zap, ArrowRight, CheckCircle, Search, Filter } from 'lucide-react';

export const SynthonGuide: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'donor' | 'acceptor' | 'umpolung'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRules = SYNTHON_RULES.filter((rule) => {
    if (filterType === 'donor' && rule.type !== 'donor') return false;
    if (filterType === 'acceptor' && rule.type !== 'acceptor') return false;
    if (filterType === 'umpolung' && !rule.isUmpolung) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        rule.order.toLowerCase().includes(q) ||
        rule.typeVi.toLowerCase().includes(q) ||
        rule.idealizedSynthon.toLowerCase().includes(q) ||
        rule.commonEquivalents.some((eq) => eq.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Intro Banner: Corey's Logic */}
      <div className="rounded-2xl border border-[#222226] bg-[#16161A] p-6 shadow-xl relative overflow-hidden">
        <div className="tech-dot-grid absolute inset-0 opacity-10 pointer-events-none" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-serif italic text-white font-medium">
              Lý thuyết Synthon Corey & Ma trận Cực tính Seebach (aⁿ / dⁿ)
            </h2>
            <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
              Phương pháp Tổng hợp Hóa học Ngược (Retrosynthetic Analysis) được Giáo sư E.J. Corey phát triển (Giải
              Nobel Hóa học 1990). Phân tử đích được phân cắt trừu tượng thành các <strong className="text-white">Synthon</strong> (mảnh mang
              điện tích giả định), sau đó được thay thế bằng các <strong className="text-white">Hóa chất tương đương thực tế (Synthetic
              Equivalents)</strong>.
            </p>
          </div>
        </div>

        {/* 3 Core Principles Mini-Cards */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <div className="rounded-xl bg-[#0A0A0C] p-4 border border-[#222226] text-xs">
            <span className="font-mono text-xs font-semibold text-rose-400 block mb-1 uppercase tracking-wider">
              1. Phân cắt (Disconnection ✂)
            </span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Một thao tác phân tích trí tuệ ngược lại với phản ứng tổng hợp hóa học, bẻ gãy một liên kết chiến lược để tạo thành hai synthon.
            </p>
          </div>

          <div className="rounded-xl bg-[#0A0A0C] p-4 border border-[#222226] text-xs">
            <span className="font-mono text-xs font-semibold text-indigo-400 block mb-1 uppercase tracking-wider">
              2. Synthon vs Hóa chất
            </span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Synthon là phân mảnh cấu trúc lý thuyết mang điện tích; Hóa chất tương đương là chất hóa học thực sự có bán trên thị trường.
            </p>
          </div>

          <div className="rounded-xl bg-[#0A0A0C] p-4 border border-[#222226] text-xs">
            <span className="font-mono text-xs font-semibold text-emerald-400 block mb-1 uppercase tracking-wider">
              3. Chuyển đổi nhóm chức (FGI)
            </span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Thay đổi nhóm chức này sang nhóm chức khác (ví dụ: khử Nitro thành Amin, oxy hóa Ancol thành Axit) trước khi tiến hành phân cắt liên kết.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-[#222226] bg-[#16161A] p-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 font-mono">
          <button
            onClick={() => setFilterType('all')}
            className={`rounded-lg px-3.5 py-1.5 text-xs transition cursor-pointer ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] font-semibold'
                : 'border border-[#333338] bg-[#0A0A0C] text-zinc-300 hover:bg-[#202025]'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilterType('acceptor')}
            className={`rounded-lg px-3.5 py-1.5 text-xs transition cursor-pointer ${
              filterType === 'acceptor'
                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] font-semibold'
                : 'border border-[#333338] bg-[#0A0A0C] text-zinc-300 hover:bg-[#202025]'
            }`}
          >
            Ái điện tử (Acceptor aⁿ ⁺)
          </button>
          <button
            onClick={() => setFilterType('donor')}
            className={`rounded-lg px-3.5 py-1.5 text-xs transition cursor-pointer ${
              filterType === 'donor'
                ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] font-semibold'
                : 'border border-[#333338] bg-[#0A0A0C] text-zinc-300 hover:bg-[#202025]'
            }`}
          >
            Ái nhân (Donor dⁿ ⁻)
          </button>
          <button
            onClick={() => setFilterType('umpolung')}
            className={`rounded-lg px-3.5 py-1.5 text-xs transition cursor-pointer ${
              filterType === 'umpolung'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] font-semibold'
                : 'border border-[#333338] bg-[#0A0A0C] text-zinc-300 hover:bg-[#202025]'
            }`}
          >
            Đảo cực tính (Umpolung ⚡)
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Tìm ký hiệu a¹, d², dithiane..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-[#0A0A0C] border border-[#222226] pl-8 pr-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Synthon Rules Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border p-5.5 transition ${
              rule.isUmpolung
                ? 'border-purple-500/30 bg-[#16161A] hover:border-purple-500/50'
                : rule.type === 'acceptor'
                ? 'border-[#222226] bg-[#16161A] hover:border-indigo-500/40'
                : 'border-[#222226] bg-[#16161A] hover:border-emerald-500/40'
            }`}
          >
            {/* Rule Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#222226]">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl font-mono font-bold text-base ${
                    rule.isUmpolung
                      ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                      : rule.type === 'acceptor'
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {rule.order}
                </span>
                <div>
                  <h3 className="text-sm font-serif italic text-white font-medium">{rule.typeVi}</h3>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Điện tích tự nhiên: {rule.naturalCharge}
                  </span>
                </div>
              </div>

              {rule.isUmpolung && (
                <span className="rounded-full bg-purple-500/10 border border-purple-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider">
                  Umpolung ⚡
                </span>
              )}
            </div>

            {/* Idealized Synthon */}
            <div className="mt-3.5 rounded-lg bg-[#0A0A0C] p-3 border border-[#222226]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 block mb-1 font-semibold">
                Synthon lý thuyết (Idealized Synthon):
              </span>
              <span className="font-mono text-sm font-bold text-indigo-300">{rule.idealizedSynthon}</span>
            </div>

            {/* Synthetic Equivalents */}
            <div className="mt-3.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-2">
                Hóa chất tương đương thông dụng:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {rule.commonEquivalents.map((eq, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-[#0A0A0C] px-2.5 py-1 text-xs font-mono text-emerald-400 border border-[#222226]"
                  >
                    {eq}
                  </span>
                ))}
              </div>
            </div>

            {/* Reactions summary */}
            <p className="mt-3.5 text-xs text-zinc-300 leading-relaxed pt-2.5 border-t border-[#222226]">
              {rule.typicalReactionsVi}
            </p>

            {rule.umpolungMethodVi && (
              <div className="mt-3.5 rounded-lg bg-[#1D1426] p-3 border border-purple-500/30 text-xs text-purple-200">
                <span className="font-mono text-[10px] uppercase tracking-wider font-semibold block text-purple-300 mb-0.5">
                  Phương pháp đảo cực tính:
                </span>
                {rule.umpolungMethodVi}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
