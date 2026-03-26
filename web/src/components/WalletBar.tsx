"use client";

import { useState } from "react";
import { useDisconnect, useConnection } from "wagmi";
import { ConnectWalletSheet } from "@/components/ConnectWalletSheet";

export function WalletBar() {
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useConnection();
  const [connectOpen, setConnectOpen] = useState(false);

  if (isConnected && address) {
    return (
      <div className="flex flex-col items-end gap-1">
        <span className="max-w-[200px] truncate font-mono text-xs text-zinc-300">
          {address.slice(0, 6)}…{address.slice(-4)}
        </span>
        <button
          type="button"
          onClick={() => disconnect()}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-400"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConnectOpen(true)}
        className="rounded-xl bg-gradient-to-r from-fuchsia-600/80 to-cyan-500/80 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-fuchsia-500/20"
      >
        Connect wallet
      </button>
      <ConnectWalletSheet
        open={connectOpen}
        onClose={() => setConnectOpen(false)}
      />
    </>
  );
}
