"use client";

import { useState } from "react";
import { ChainBanner } from "@/components/ChainBanner";
import { GameScreen } from "@/components/GameScreen";
import { SettingsSheet } from "@/components/SettingsSheet";
import { SignInWithEthereum } from "@/components/SignInWithEthereum";
import { WalletBar } from "@/components/WalletBar";

export function BloxorzShell() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsKey, setSettingsKey] = useState(0);

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-[#030712] text-zinc-100">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,211,238,0.18), transparent),
            radial-gradient(ellipse 60% 40% at 100% 20%, rgba(217,70,239,0.12), transparent),
            linear-gradient(180deg, #020617 0%, #0f172a 45%, #020617 100%)
          `,
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-10 pt-6">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-fuchsia-400/80">Base</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300/70">Monolith run</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <WalletBar />
            <button
              type="button"
              onClick={() => {
                setSettingsKey((k) => k + 1);
                setSettingsOpen(true);
              }}
              className="text-xs text-zinc-500 underline decoration-white/10 underline-offset-4"
            >
              Settings
            </button>
          </div>
        </div>

        <SignInWithEthereum />

        <ChainBanner />

        <div className="mt-6 flex-1">
          <GameScreen />
        </div>
      </div>

      <SettingsSheet
        key={settingsKey}
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
