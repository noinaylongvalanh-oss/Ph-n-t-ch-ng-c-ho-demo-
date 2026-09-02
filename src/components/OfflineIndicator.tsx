import React from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  return (
    <div className="flex items-center gap-2">
      {isOnline ? (
        <span
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#16161A] border border-[#222226] text-[#E0E0E0] text-xs font-medium"
          title="Đang kết nối internet (Dữ liệu offline & PWA vẫn hoạt động song song)"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
          <span className="uppercase tracking-widest text-[10px] opacity-70 font-mono">Local Engine: Active</span>
        </span>
      ) : (
        <span
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#16161A] border border-amber-500/40 text-amber-300 text-xs font-medium shadow-[0_0_12px_rgba(245,158,11,0.15)]"
          title="Không có mạng - Hệ thống đang chạy 100% bằng bộ động cơ phân tích ngoại tuyến"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="uppercase tracking-widest text-[10px] font-mono">Offline KB Mode</span>
        </span>
      )}
    </div>
  );
};
