import type { Cols, Place } from "./subtraction";

/** Engine-neutral step the board and lab render. `side` is the faded lower panel
 *  (objects taken away for subtraction; objects still waiting to be added for addition). */
export interface BoardStep {
  kind: string;
  place?: Place;
  from?: Place;
  to?: Place;
  counts: Cols;
  side: Cols;
  answerDigits: readonly [number, number, number];
  note: { key: string; params: Record<string, number> };
}
