import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16161A] border border-emerald-500/30 text-emerald-400 text-xs font-mono">
        <Check className="w-3.5 h-3.5" />
        <span>Đã cài đặt PWA</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-full border border-[#333338] bg-[#16161A] hover:bg-[#202025] px-4 py-1.5 text-xs font-medium text-[#E0E0E0] shadow-sm transition cursor-pointer active:scale-95"
        title="Cài đặt ứng dụng để sử dụng offline mọi lúc"
      >
        <Download className="w-3.5 h-3.5 text-indigo-400" />
        <span>Cài đặt Offline</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-full border border-[#333338] bg-[#16161A] hover:bg-[#202025] px-3.5 py-1.5 text-xs font-medium text-[#E0E0E0] transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
          <span>Cài trên iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="w-full max-w-sm rounded-2xl border border-[#222226] bg-[#0F0F12] p-5 shadow-2xl text-[#E0E0E0]">
              <div className="flex items-center justify-between pb-3 border-b border-[#222226]">
                <h3 className="text-base font-serif font-medium text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  Cài đặt trên iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-zinc-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-300">
                1. Nhấn nút <strong>Chia sẻ (Share)</strong> trên thanh công cụ Safari.<br />
                2. Cuộn xuống và chọn <strong>Thêm vào MH chính (Add to Home Screen)</strong>.<br />
                3. Nhấn <strong>Thêm (Add)</strong> để chạy ứng dụng offline trực tiếp từ màn hình chính.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 py-2 text-xs font-medium text-white transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#16161A] border border-[#222226] text-zinc-400 text-xs font-mono">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span className="uppercase tracking-widest text-[10px] opacity-70">Offline Ready</span>
    </div>
  );
};
