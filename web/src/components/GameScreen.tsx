"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createInitialState, getOccupiedCells, tryMove } from "@/game/engine";
import { levels } from "@/game/levels";
import type { BlockState, Direction, Level, Tile } from "@/game/types";
import { hapticError, hapticLight, hapticWin } from "@/lib/haptics";
import { useCheckIn } from "@/hooks/useCheckIn";
import { formatEther } from "viem";
import { useConnection } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";

function cellClass(t: Tile, occupied: boolean, goalPulse: boolean): string {
  if (occupied) {
    return "bg-gradient-to-br from-slate-200/90 via-cyan-200/40 to-fuchsia-400/50 shadow-[inset_0_0_24px_rgba(34,211,238,0.35)] border border-white/30";
  }
  switch (t) {
    case "void":
      return "bg-[radial-gradient(ellipse_at_center,_rgba(15,23,42,0.95)_0%,_rgba(2,6,23,1)_100%)] border border-white/[0.06]";
    case "goal":
      return goalPulse
        ? "bg-gradient-to-br from-fuchsia-500/30 to-cyan-400/25 shadow-[0_0_28px_rgba(217,70,239,0.45)] border border-fuchsia-400/50"
        : "bg-gradient-to-br from-fuchsia-900/40 to-cyan-900/30 border border-fuchsia-500/30";
    default:
      return "bg-gradient-to-br from-slate-800/90 to-slate-900/95 border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]";
  }
}

function LevelSession({ level }: { level: Level }) {
  const [state, setState] = useState<BlockState>(() => createInitialState(level));
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const occupied = useMemo(() => {
    const set = new Set<string>();
    for (const [x, y] of getOccupiedCells(state)) {
      set.add(`${x},${y}`);
    }
    return set;
  }, [state]);

  const applyDir = useCallback(
    (dir: Direction) => {
      if (status !== "playing") return;
      const res = tryMove(level, state, dir);
      if (res.kind === "blocked") {
        hapticError();
        return;
      }
      if (res.kind === "void") {
        hapticError();
        setStatus("lost");
        return;
      }
      if (res.kind === "win") {
        hapticWin();
        setStatus("won");
        return;
      }
      hapticLight();
      setMoves((m) => m + 1);
      setState(res.state);
    },
    [level, state, status],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };
      const d = map[e.key];
      if (d) {
        e.preventDefault();
        applyDir(d);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [applyDir]);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    if (t) touchRef.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (absX < 24 && absY < 24) return;
    if (absX > absY) {
      applyDir(dx > 0 ? "right" : "left");
    } else {
      applyDir(dy > 0 ? "down" : "up");
    }
  };

  return (
    <>
      <header className="flex shrink-0 items-center justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-400/70">Bloxorz</p>
          <h1 className="font-display text-lg font-semibold tracking-tight text-white">{level.name}</h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500">Moves</p>
          <p className="font-mono text-xl text-cyan-200">{moves}</p>
        </div>
      </header>

      <div
        className="relative mx-auto aspect-square w-full max-w-[min(100%,420px)] perspective-[900px]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="grid h-full w-full gap-1 p-2 [transform:rotateX(12deg)] rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
          style={{
            gridTemplateColumns: `repeat(${level.width}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${level.height}, minmax(0, 1fr))`,
          }}
        >
          {level.tiles.map((row, y) =>
            row.map((tile, x) => {
              const occ = occupied.has(`${x},${y}`);
              return (
                <div
                  key={`${x}-${y}`}
                  className={`relative min-h-[8px] rounded-md transition-colors duration-150 ${cellClass(
                    tile,
                    occ,
                    tile === "goal",
                  )}`}
                />
              );
            }),
          )}
        </div>
        {status === "won" ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-black/55 backdrop-blur-[2px]">
            <p className="font-display text-2xl font-bold tracking-tight text-cyan-200 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
              Cleared
            </p>
          </div>
        ) : null}
        {status === "lost" ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60 backdrop-blur-[2px]">
            <p className="text-xl font-semibold text-rose-300">Void</p>
          </div>
        ) : null}
      </div>

      <div className="mx-auto grid max-w-[220px] grid-cols-3 place-items-center gap-2">
        <span />
        <DirButton label="↑" onClick={() => applyDir("up")} />
        <span />
        <DirButton label="←" onClick={() => applyDir("left")} />
        <div className="h-12 w-12 rounded-full border border-white/10 bg-white/5" />
        <DirButton label="→" onClick={() => applyDir("right")} />
        <span />
        <DirButton label="↓" onClick={() => applyDir("down")} />
        <span />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg border border-white/15 px-3 py-2 text-xs text-zinc-300"
          onClick={() => {
            setState(createInitialState(level));
            setMoves(0);
            setStatus("playing");
          }}
        >
          Reset
        </button>
      </div>
    </>
  );
}

function isBaseChain(chainId: number | undefined) {
  return chainId === base.id || chainId === baseSepolia.id;
}

export function GameScreen() {
  const [levelIdx, setLevelIdx] = useState(0);
  const level = levels[levelIdx]!;
  const checkIn = useCheckIn();
  const { chainId } = useConnection();
  const chainOk = isBaseChain(chainId);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <LevelSession key={level.id} level={level} />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg border border-white/15 px-3 py-2 text-xs text-zinc-300 disabled:opacity-40"
          disabled={levelIdx >= levels.length - 1}
          onClick={() => {
            setLevelIdx((i) => Math.min(i + 1, levels.length - 1));
          }}
        >
          Next level
        </button>
        <button
          type="button"
          className="rounded-lg border border-white/15 px-3 py-2 text-xs text-zinc-300 disabled:opacity-40"
          disabled={levelIdx <= 0}
          onClick={() => setLevelIdx((i) => Math.max(0, i - 1))}
        >
          Prev level
        </button>
      </div>

      <section className="rounded-2xl border border-cyan-500/20 bg-black/30 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-cyan-400/80">Daily check-in</p>
        <p className="mt-1 text-sm text-zinc-400">
          Fee: {formatEther(checkIn.feeWei)} ETH ({checkIn.feeWei.toString()} wei)
        </p>
        {!checkIn.contractConfigured ? (
          <p className="mt-2 text-xs text-amber-400/90">
            Set <code className="rounded bg-white/5 px-1">NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS</code> after deploy.
          </p>
        ) : null}
        <button
          type="button"
          disabled={
            !checkIn.isConnected ||
            !checkIn.contractConfigured ||
            checkIn.isPending ||
            checkIn.canCheckInToday !== true ||
            !chainOk
          }
          onClick={() => void checkIn.checkIn()}
          className="mt-3 w-full rounded-xl bg-gradient-to-r from-emerald-600/90 to-cyan-600/80 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          {!checkIn.isConnected
            ? "Connect wallet to check in"
            : !chainOk
              ? "Switch to Base network"
            : checkIn.canCheckInToday === undefined && checkIn.contractConfigured
              ? "Loading…"
              : checkIn.canCheckInToday === false
                ? "Already checked in today"
                : checkIn.isPending
                  ? "Confirm in wallet…"
                  : "Check in onchain"}
        </button>
        {checkIn.streak !== undefined && checkIn.isConnected ? (
          <p className="mt-2 text-xs text-zinc-500">
            Streak: <span className="text-cyan-300">{checkIn.streak.toString()}</span> day(s)
          </p>
        ) : null}
      </section>
    </div>
  );
}

function DirButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10 text-lg text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.12)] active:scale-95"
    >
      {label}
    </button>
  );
}
