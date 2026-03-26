import { describe, expect, it } from "vitest";
import { tryMove, getOccupiedCells } from "./engine";
import type { Level } from "./types";

const mini: Level = {
  id: "t",
  name: "t",
  width: 5,
  height: 5,
  tiles: [
    ["void", "void", "void", "void", "void"],
    ["void", "floor", "floor", "floor", "void"],
    ["void", "floor", "floor", "goal", "floor"],
    ["void", "floor", "floor", "floor", "void"],
    ["void", "void", "void", "void", "void"],
  ],
  start: { x: 1, y: 1, orientation: "standing" },
};

describe("getOccupiedCells", () => {
  it("standing", () => {
    expect(getOccupiedCells({ x: 2, y: 2, orientation: "standing" })).toEqual([[2, 2]]);
  });
  it("horizontal", () => {
    expect(getOccupiedCells({ x: 1, y: 1, orientation: "horizontal" }).sort()).toEqual(
      [
        [1, 1],
        [2, 1],
      ].sort(),
    );
  });
});

describe("tryMove", () => {
  it("rolls into void", () => {
    const r = tryMove(mini, { x: 1, y: 1, orientation: "standing" }, "left");
    expect(r.kind).toBe("void");
  });

  it("wins when rolling to stand on goal", () => {
    const r = tryMove(mini, { x: 1, y: 2, orientation: "horizontal" }, "right");
    expect(r.kind).toBe("win");
  });
});
