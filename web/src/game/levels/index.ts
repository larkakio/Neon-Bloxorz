import type { Level } from "../types";
import level01 from "./level-01.json";
import level02 from "./level-02.json";

const raw = [level01, level02] as Level[];

export const levels: Level[] = raw.map((l) => ({
  ...l,
  start: {
    ...l.start,
    orientation: l.start.orientation as Level["start"]["orientation"],
  },
}));
