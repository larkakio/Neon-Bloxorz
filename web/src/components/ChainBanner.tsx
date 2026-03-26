"use client";

import { useConnection, useSwitchChain } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";

const SUPPORTED = new Set<number>([base.id, baseSepolia.id]);

/** Default: Base mainnet. Set NEXT_PUBLIC_CHAIN_ID=84532 to target Sepolia. */
function targetChain() {
  const raw = process.env.NEXT_PUBLIC_CHAIN_ID;
  if (raw === "84532") return baseSepolia;
  return base;
}

export function ChainBanner() {
  const { chainId, isConnected } = useConnection();
  const { switchChainAsync, isPending } = useSwitchChain();

  if (!isConnected || chainId === undefined) return null;
  if (SUPPORTED.has(chainId)) return null;

  const target = targetChain();

  return (
    <div className="mb-4 rounded-2xl border border-amber-500/40 bg-amber-950/40 px-4 py-3 text-sm text-amber-100/95">
      <p className="font-medium">Wrong network</p>
      <p className="mt-1 text-xs text-amber-200/70">
        Switch to {target.name} to play and use check-in.
      </p>
      <button
        type="button"
        disabled={isPending}
        onClick={() => void switchChainAsync({ chainId: target.id })}
        className="mt-3 w-full rounded-xl bg-amber-500/90 py-2.5 text-sm font-semibold text-amber-950 disabled:opacity-50"
      >
        {isPending ? "Switching…" : `Switch to ${target.name}`}
      </button>
    </div>
  );
}
