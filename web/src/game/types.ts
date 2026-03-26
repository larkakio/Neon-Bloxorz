export type Orientation = "standing" | "horizontal" | "vertical";

export type Direction = "up" | "down" | "left" | "right";

export type Tile = "floor" | "void" | "goal";

export type BlockState = {
  x: number;
  y: number;
  orientation: Orientation;
};

export type Level = {
  id: string;
  name: string;
  width: number;
  height: number;
  /** row-major: grid[y][x] */
  tiles: Tile[][];
  start: BlockState;
};

export type MoveResult =
  | { kind: "ok"; state: BlockState }
  | { kind: "void" }
  | { kind: "win" }
  | { kind: "blocked" };
