import { LESSONS, TOPICS, REVIEWS, SORTS, lessonText, type LessonMeta, type Topic, type Review, type Sort } from "./registry";
import { dict, LANGS, type Lang } from "../i18n/dict";
import { toBnDigits } from "../math/numerals";

export interface Query { q: string; topic: Topic | ""; review: Review | ""; sort: Sort }

const BN_TO_ASCII = (s: string) => s.replace(/[০-৯]/g, (d) => String("০১২৩৪৫৬৭৮৯".indexOf(d)));
const norm = (s: string) => BN_TO_ASCII(s).toLowerCase().normalize("NFC").replace(/\s+/g, " ").trim();

/** Never trust the URL: whitelist every field and bound lengths. */
export function parseQuery(raw: Record<string, string | string[] | undefined>): Query {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const q = one(raw.q).slice(0, 80);
  const topic = one(raw.topic);
  const review = one(raw.review);
  const sort = one(raw.sort);
  return {
    q,
    topic: (TOPICS as readonly string[]).includes(topic) ? (topic as Topic) : "",
    review: (REVIEWS as readonly string[]).includes(review) ? (review as Review) : "",
    sort: (SORTS as readonly string[]).includes(sort) ? (sort as Sort) : "title",
  };
}

function haystack(l: LessonMeta): string {
  // search both languages so an English query finds a Bangla-first lesson and vice versa
  return norm(
    LANGS.map((lang) => {
      const t = lessonText(l, lang);
      return `${t.title} ${t.objective} ${dict[lang][`topic_${l.topic}` as const]}`;
    }).join(" "),
  );
}

export function filterLessons(all: readonly LessonMeta[], query: Query, lang: Lang): LessonMeta[] {
  const tokens = norm(query.q).split(" ").filter(Boolean);
  const out = all.filter((l) =>
    (query.topic === "" || l.topic === query.topic) &&
    (query.review === "" || l.review === query.review) &&
    tokens.every((t) => haystack(l).includes(t)),
  );
  const collator = new Intl.Collator(lang === "bn" ? "bn" : "en");
  const title = (l: LessonMeta) => lessonText(l, lang).title;
  const topic = (l: LessonMeta) => dict[lang][`topic_${l.topic}` as const];
  return out.sort((a, b) =>
    query.sort === "topic" ? collator.compare(topic(a), topic(b)) || collator.compare(title(a), title(b)) : collator.compare(title(a), title(b)),
  );
}

/** Facet counts for the filter UI: computed from the data, never hard-coded. */
export function facetCounts(all: readonly LessonMeta[] = LESSONS) {
  const topics = new Map<Topic, number>();
  const reviews = new Map<Review, number>();
  for (const l of all) {
    topics.set(l.topic, (topics.get(l.topic) ?? 0) + 1);
    reviews.set(l.review, (reviews.get(l.review) ?? 0) + 1);
  }
  return { topics, reviews };
}
export { toBnDigits };
