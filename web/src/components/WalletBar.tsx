"use client";

import { useConnect, useDisconnect, useConnection } from "wagmi";

export function WalletBar() {
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useConnection();

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
    <div className="flex flex-wrap justify-end gap-2">
      {connectors.map((c) => (
        <button
          key={c.uid}
          type="button"
          disabled={isPending}
          onClick={() => connect({ connector: c })}
          className="rounded-xl bg-gradient-to-r from-fuchsia-600/80 to-cyan-500/80 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-fuchsia-500/20"
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
