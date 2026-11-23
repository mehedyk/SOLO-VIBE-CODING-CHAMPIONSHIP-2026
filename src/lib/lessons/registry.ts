import { ENGINES, type Kind } from "./engines";
import { dict, type Lang } from "../i18n/dict";

export type Topic = "addition" | "subtraction";
export type Review = "demo";

export interface LessonMeta {
  slug: string;
  kind: Kind;
  topic: Topic;
  template: "place_value_blocks";
  review: Review;
  version: string;
  /** Class is deliberately unverified: no textbook edition has been confirmed. */
  grade: "unverified";
}

/** Phase 2: static registry. Phase 3 moves this to MongoDB (lessons + immutable versions). */
export const LESSONS: readonly LessonMeta[] = [
  { slug: "subtraction-regrouping", kind: "subtraction", topic: "subtraction", template: "place_value_blocks", review: "demo", version: "v0", grade: "unverified" },
  { slug: "addition-regrouping", kind: "addition", topic: "addition", template: "place_value_blocks", review: "demo", version: "v0", grade: "unverified" },
];

export const TOPICS: readonly Topic[] = ["addition", "subtraction"];
export const REVIEWS: readonly Review[] = ["demo"];
export const SORTS = ["title", "topic"] as const;
export type Sort = (typeof SORTS)[number];

export const findLesson = (slug: string) => LESSONS.find((l) => l.slug === slug);

export function lessonText(l: LessonMeta, lang: Lang) {
  const d = dict[lang];
  const k = ENGINES[l.kind].keys;
  return { title: d[k.title], objective: d[k.objective], prerequisite: d[k.prerequisite] };
}
