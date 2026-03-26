import type { BlockState, Direction, Level, MoveResult, Tile } from "./types";

export function getOccupiedCells(s: BlockState): [number, number][] {
  const { x, y, orientation } = s;
  if (orientation === "standing") return [[x, y]];
  if (orientation === "horizontal") return [
    [x, y],
    [x + 1, y],
  ];
  return [
    [x, y],
    [x, y + 1],
  ];
}

function transition(state: BlockState, dir: Direction): BlockState {
  const { x, y, orientation } = state;

  if (orientation === "standing") {
    switch (dir) {
      case "right":
        return { x: x + 1, y, orientation: "horizontal" };
      case "left":
        return { x: x - 2, y, orientation: "horizontal" };
      case "up":
        return { x, y: y - 2, orientation: "vertical" };
      case "down":
        return { x, y: y + 1, orientation: "vertical" };
    }
  }

  if (orientation === "horizontal") {
    switch (dir) {
      case "right":
        return { x: x + 2, y, orientation: "standing" };
      case "left":
        return { x: x - 1, y, orientation: "standing" };
      case "up":
        return { x, y: y - 2, orientation: "vertical" };
      case "down":
        return { x, y: y + 1, orientation: "vertical" };
    }
  }

  // vertical
  switch (dir) {
    case "up":
      return { x, y: y - 1, orientation: "standing" };
    case "down":
      return { x, y: y + 2, orientation: "standing" };
    case "left":
      return { x: x - 2, y, orientation: "horizontal" };
    case "right":
      return { x: x + 1, y, orientation: "horizontal" };
  }
}

function inBounds(level: Level, cx: number, cy: number): boolean {
  return cx >= 0 && cy >= 0 && cx < level.width && cy < level.height;
}

function tileAt(level: Level, cx: number, cy: number): Tile | undefined {
  if (!inBounds(level, cx, cy)) return undefined;
  return level.tiles[cy][cx];
}

export function tryMove(level: Level, state: BlockState, dir: Direction): MoveResult {
  const next = transition(state, dir);
  const cells = getOccupiedCells(next);

  for (const [cx, cy] of cells) {
    const t = tileAt(level, cx, cy);
    if (t === undefined || t === "void") {
      return { kind: "void" };
    }
  }

  const standingOnGoal =
    next.orientation === "standing" && tileAt(level, next.x, next.y) === "goal";
  if (standingOnGoal) {
    return { kind: "win" };
  }

  const blocked = cells.some(([cx, cy]) => {
    const t = tileAt(level, cx, cy);
    return t === "goal";
  });
  if (blocked) {
    return { kind: "blocked" };
  }

  return { kind: "ok", state: next };
}

export function createInitialState(level: Level): BlockState {
  return { ...level.start };
}
