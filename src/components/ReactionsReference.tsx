import React, { useState } from 'react';
import { ORGANIC_REACTIONS } from '../data/reactionsDictionary';
import { OrganicReactionRef } from '../types/chemistry';
import { Search, Beaker, Lightbulb, Award, BookOpen, Layers } from 'lucide-react';

export const ReactionsReference: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'C-C Bond', 'C=C Bond', 'C-O', 'C-N', 'Ring Formation'];

  const filteredReactions = ORGANIC_REACTIONS.filter((rxn) => {
    if (selectedCategory !== 'all') {
      if (!rxn.type.toLowerCase().includes(selectedCategory.toLowerCase())) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        rxn.name.toLowerCase().includes(q) ||
        rxn.nameVi.toLowerCase().includes(q) ||
        rxn.reagents.toLowerCase().includes(q) ||
        rxn.retroPattern.toLowerCase().includes(q) ||
        rxn.disconnectionTipVi.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-[#222226] bg-[#16161A] p-6 shadow-xl relative overflow-hidden">
        <div className="tech-dot-grid absolute inset-0 opacity-10 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-serif italic text-white font-medium">
              Từ điển Phản ứng Tên gọi & Phân cắt Hữu cơ (Offline Reaction Reference)
            </h2>
            <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
              Bộ tra cứu ngoại tuyến toàn diện về các phản ứng tạo liên kết Carbon-Carbon, Dị nguyên tử và Chuyển đổi
              nhóm chức (FGI) then chốt trong tổng hợp hóa học ngược.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-[#222226] bg-[#16161A] p-3 font-mono">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3.5 py-1.5 text-xs transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] font-semibold'
                  : 'border border-[#333338] bg-[#0A0A0C] text-zinc-300 hover:bg-[#202025] hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Tìm Wittig, Aldol, Grignard, AlCl₃..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-[#0A0A0C] border border-[#222226] pl-8 pr-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Reaction Cards */}
      <div className="space-y-4">
        {filteredReactions.map((rxn) => (
          <div
            key={rxn.id}
            className="rounded-2xl border border-[#222226] bg-[#16161A] p-5.5 shadow-xl hover:border-indigo-500/40 transition"
          >
            {/* Reaction Title & Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#222226] gap-2">
              <div>
                <h3 className="text-base font-serif italic text-white flex items-center gap-2">
                  <span>{rxn.nameVi}</span>
                  <span className="text-xs font-mono text-zinc-400 not-italic">({rxn.name})</span>
                </h3>
                <span className="text-xs font-mono text-indigo-400">{rxn.type}</span>
              </div>

              {rxn.historicalYear && (
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{rxn.discoverer} ({rxn.historicalYear})</span>
                </div>
              )}
            </div>

            {/* Retrosynthetic Pattern Highlight */}
            <div className="mt-4 rounded-xl bg-[#0A0A0C] p-3.5 border border-[#222226]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 block mb-1 font-semibold">
                Khuôn mẫu phân cắt tổng hợp ngược (Retrosynthetic Disconnection Pattern):
              </span>
              <div className="font-mono text-xs font-bold text-zinc-100">{rxn.retroPattern}</div>
            </div>

            {/* Forward Equation */}
            <div className="mt-3 rounded-xl bg-[#0A0A0C] p-3 border border-[#222226]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-1 font-semibold">
                Phương trình tổng hợp xuôi (Forward Equation):
              </span>
              <div className="font-mono text-xs text-emerald-400">{rxn.forwardEquation}</div>
            </div>

            {/* Reagents & Conditions */}
            <div className="mt-3.5 text-xs font-mono">
              <span className="text-zinc-500 block text-[10px] uppercase tracking-wider mb-1">Thuốc thử & Điều kiện:</span>
              <span className="text-zinc-200">{rxn.reagents}</span>
            </div>

            {/* Retrosynthetic Strategy Tip */}
            <div className="mt-3.5 flex items-start gap-2.5 rounded-xl bg-[#141A29] p-3.5 border border-indigo-500/30 text-xs">
              <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider font-semibold text-indigo-300 block mb-0.5">
                  Mẹo nhận diện phân cắt (Disconnection Rule):
                </span>
                <p className="text-zinc-300 text-[11px] leading-relaxed">{rxn.disconnectionTipVi}</p>
              </div>
            </div>

            {/* Mechanism text */}
            <div className="mt-3.5 text-[11px] text-zinc-400 leading-relaxed pt-2.5 border-t border-[#222226]">
              <span className="font-semibold text-zinc-300 font-mono text-[10px] uppercase tracking-wider">Cơ chế tóm tắt: </span>
              {rxn.mechanismSummaryVi}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
