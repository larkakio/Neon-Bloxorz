"use client";

import { useEffect, useMemo } from "react";
import type { Connector } from "wagmi";
import { useConnect } from "wagmi";

type Props = {
  open: boolean;
  onClose: () => void;
};

function sortConnectors(list: readonly Connector[]): Connector[] {
  const copy = [...list];
  copy.sort((a, b) => {
    const aBase = a.name === "Base Account" ? 0 : 1;
    const bBase = b.name === "Base Account" ? 0 : 1;
    if (aBase !== bBase) return aBase - bBase;
    return a.name.localeCompare(b.name);
  });
  return copy;
}

export function ConnectWalletSheet({ open, onClose }: Props) {
  const { connectAsync, connectors, isPending, error, variables, reset } =
    useConnect();

  const sorted = useMemo(() => sortConnectors(connectors), [connectors]);

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/60 backdrop-blur-sm">
      <button
        type="button"
        className="flex-1 cursor-default"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="max-h-[min(85dvh,520px)] overflow-hidden rounded-t-3xl border border-white/10 bg-zinc-950/98 shadow-[0_-20px_80px_rgba(0,0,0,0.85)]">
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-white/20" />
        <div className="border-b border-white/5 px-5 pb-3 pt-2">
          <h2 className="text-lg font-semibold text-white">Connect a wallet</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Choose how you want to connect. Your keys stay in your wallet.
          </p>
        </div>
        <ul className="max-h-[min(60dvh,420px)] overflow-y-auto overscroll-contain px-3 py-2">
          {sorted.map((c) => {
            const pendingUid = (variables as { connector?: Connector } | undefined)
              ?.connector?.uid;
            const active = isPending && pendingUid === c.uid;
            return (
              <li key={c.uid} className="mb-1.5">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    void (async () => {
                      try {
                        await connectAsync({ connector: c });
                        onClose();
                      } catch {
                        /* mutation exposes error */
                      }
                    })();
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3.5 text-left text-sm font-medium text-zinc-100 transition hover:border-cyan-500/30 hover:bg-zinc-900 disabled:opacity-60"
                >
                  <span>{c.name}</span>
                  {active ? (
                    <span className="text-xs text-cyan-400/90">Connecting…</span>
                  ) : (
                    <span className="text-zinc-600">→</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        {error ? (
          <p className="border-t border-white/5 px-5 py-3 text-xs text-rose-400/95">
            {error.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
