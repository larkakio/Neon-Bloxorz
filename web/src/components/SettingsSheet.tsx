"use client";

import { getHapticsEnabled, setHapticsEnabled } from "@/lib/haptics";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SettingsSheet({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm">
      <button type="button" className="flex-1 cursor-default" aria-label="Close" onClick={onClose} />
      <div className="rounded-t-3xl border border-white/10 bg-zinc-950/95 p-6 shadow-[0_-20px_80px_rgba(0,0,0,0.8)]">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
        <h2 className="text-lg font-semibold text-white">Settings</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Haptics use the Web Vibration API when the browser supports it.
        </p>
        <label className="mt-6 flex items-center justify-between gap-4">
          <span className="text-sm text-zinc-300">Haptic feedback</span>
          <input
            type="checkbox"
            defaultChecked={getHapticsEnabled()}
            onChange={(e) => setHapticsEnabled(e.target.checked)}
            className="h-5 w-10 accent-cyan-400"
          />
        </label>
      </div>
    </div>
  );
}
