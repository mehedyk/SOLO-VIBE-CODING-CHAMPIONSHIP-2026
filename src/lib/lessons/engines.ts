import { buildSubtractionSteps, digitsOf, type Cols, type Place } from "../math/subtraction";
import { buildAdditionSteps } from "../math/addition";
import type { BoardStep } from "../math/board";
import { checkAnswer, checkInputs, checkAdditionAnswer, checkAdditionInputs, TRANSFER, ADD_TRANSFER, type AnswerCheck, type InputCheck } from "../math/inputs";
import type { Dict } from "../i18n/dict";

export type Kind = "subtraction" | "addition";
type K = keyof Dict;

export interface Engine {
  kind: Kind;
  sign: "−" | "+";
  defaults: readonly [number, number];
  transfer: ReadonlyArray<readonly [number, number]>;
  build(a: number, b: number): BoardStep[];
  checkInputs(aRaw: string, bRaw: string): InputCheck;
  checkAnswer(a: number, b: number, raw: string): AnswerCheck;
  result(a: number, b: number): number;
  /** Ground truth for the prediction asked before a column. `expectedYes` is what "Yes" must mean. */
  prediction(a: number, b: number, boardBefore: Cols, place: Place): { expectedYes: boolean; c: number; s: number; t: number };
  keys: {
    title: K; objective: K; prerequisite: K; aLabel: K; bLabel: K; rangeHint: K; sideLabel: K; valueCheck: K; rowSub: K;
    predQ: K; predYes: K; predNo: K; predWhyYes: K; predWhyNo: K; guidedPrompt: K; transferPrompt: K; notes: readonly K[];
    wrongMap: { smaller_from_larger?: K; forgot_to_reduce?: K; forgot_carry?: K };
  };
}

const subtraction: Engine = {
  kind: "subtraction", sign: "−", defaults: [52, 27], transfer: TRANSFER,
  build(a, b) {
    return buildSubtractionSteps(a, b).map((s): BoardStep => ({
      kind: s.kind, place: s.place, from: s.from, to: s.from !== undefined ? ((s.from - 1) as Place) : undefined,
      counts: s.counts, side: s.removed, answerDigits: s.answerDigits, note: s.note,
    }));
  },
  checkInputs, checkAnswer,
  result: (a, b) => a - b,
  prediction(a, b, before, place) {
    const s = digitsOf(b)[place];
    const c = before[place];
    return { expectedYes: c >= s, c, s, t: c - s };
  },
  keys: {
    title: "lessonTitle", objective: "objective", prerequisite: "prerequisite", aLabel: "minuendLabel", bLabel: "subtrahendLabel",
    rangeHint: "rangeHint", sideLabel: "removedLabel", valueCheck: "valueCheck", rowSub: "rowSub",
    predQ: "predQ", predYes: "predYes", predNo: "predNo", predWhyYes: "predWhyCan", predWhyNo: "predWhyCannot",
    guidedPrompt: "guidedPrompt", transferPrompt: "transferPrompt", notes: ["note1", "note2", "note3", "note4", "note5"],
    wrongMap: { smaller_from_larger: "wrongSmaller", forgot_to_reduce: "wrongForgot" },
  },
};

const addition: Engine = {
  kind: "addition", sign: "+", defaults: [48, 37], transfer: ADD_TRANSFER,
  build: buildAdditionSteps,
  checkInputs: checkAdditionInputs, checkAnswer: checkAdditionAnswer,
  result: (a, b) => a + b,
  prediction(a, b, before, place) {
    const y = digitsOf(b)[place];
    const c = before[place];
    return { expectedYes: c + y >= 10, c, s: y, t: c + y };
  },
  keys: {
    title: "add_lessonTitle", objective: "add_objective", prerequisite: "add_prerequisite", aLabel: "add_aLabel", bLabel: "add_bLabel",
    rangeHint: "add_rangeHint", sideLabel: "add_sideLabel", valueCheck: "add_valueCheck", rowSub: "add_rowSub",
    predQ: "add_predQ", predYes: "add_predYes", predNo: "add_predNo", predWhyYes: "add_predWhyYes", predWhyNo: "add_predWhyNo",
    guidedPrompt: "add_guidedPrompt", transferPrompt: "add_transferPrompt", notes: ["add_note1", "add_note2", "add_note3", "add_note4", "note5"],
    wrongMap: { forgot_carry: "add_wrongForgotCarry" },
  },
};

export const ENGINES: Record<Kind, Engine> = { subtraction, addition };
