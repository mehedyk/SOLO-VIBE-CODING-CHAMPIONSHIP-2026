import test from "node:test";
import assert from "node:assert/strict";
import { LESSONS, findLesson } from "../src/lib/lessons/registry";
import { parseQuery, filterLessons, facetCounts } from "../src/lib/lessons/catalogue";
import { ENGINES } from "../src/lib/lessons/engines";
import { dict, noteText } from "../src/lib/i18n/dict";

const q = (o: Record<string, string> = {}) => parseQuery(o);

test("registry: unique slugs, every lesson has an engine and text in both languages", () => {
  assert.equal(new Set(LESSONS.map((l) => l.slug)).size, LESSONS.length);
  for (const l of LESSONS) {
    const e = ENGINES[l.kind];
    for (const lang of ["bn", "en"] as const) {
      const d = dict[lang];
      for (const k of [e.keys.title, e.keys.objective, e.keys.prerequisite, e.keys.aLabel, e.keys.bLabel, ...e.keys.notes]) assert.ok(d[k].length > 3);
    }
  }
  assert.equal(findLesson("nope"), undefined);
});

test("no filter returns everything; title sort is stable", () => {
  assert.equal(filterLessons(LESSONS, q(), "bn").length, LESSONS.length);
  assert.deepEqual(filterLessons(LESSONS, q(), "en").map((l) => l.slug), filterLessons(LESSONS, q(), "en").map((l) => l.slug));
});

test("topic filter", () => {
  assert.deepEqual(filterLessons(LESSONS, q({ topic: "addition" }), "bn").map((l) => l.slug), ["addition-regrouping"]);
  assert.deepEqual(filterLessons(LESSONS, q({ topic: "subtraction" }), "en").map((l) => l.slug), ["subtraction-regrouping"]);
});

test("search works in Bangla and English, across languages, case-insensitively", () => {
  assert.deepEqual(filterLessons(LESSONS, q({ q: "বিয়োগ" }), "bn").map((l) => l.slug), ["subtraction-regrouping"]);
  assert.deepEqual(filterLessons(LESSONS, q({ q: "ADDITION" }), "en").map((l) => l.slug), ["addition-regrouping"]);
  assert.deepEqual(filterLessons(LESSONS, q({ q: "subtraction" }), "bn").map((l) => l.slug), ["subtraction-regrouping"]); // English word, Bangla UI
  assert.equal(filterLessons(LESSONS, q({ q: "যোগ বিয়োগ" }), "bn").length, 0); // all tokens must match
  assert.equal(filterLessons(LESSONS, q({ q: "  " }), "bn").length, LESSONS.length);
});

test("search + filter combine; empty result is an empty array not an error", () => {
  assert.equal(filterLessons(LESSONS, q({ q: "যোগ", topic: "subtraction" }), "bn").length, 0);
  assert.equal(filterLessons(LESSONS, q({ q: "zzzzzz" }), "en").length, 0);
});

test("query parsing is a whitelist: junk, arrays and oversized input are neutralised", () => {
  const p = parseQuery({ topic: "$ne", review: "x", sort: "DROP", q: "a".repeat(500) });
  assert.equal(p.topic, ""); assert.equal(p.review, ""); assert.equal(p.sort, "title"); assert.equal(p.q.length, 80);
  assert.equal(parseQuery({ topic: ["addition", "subtraction"] }).topic, "addition");
  assert.equal(parseQuery({ sort: "topic" }).sort, "topic");
});

test("facet counts come from data", () => {
  const f = facetCounts();
  assert.equal(f.topics.get("addition"), 1);
  assert.equal(f.topics.get("subtraction"), 1);
  assert.equal(f.reviews.get("demo"), LESSONS.length);
});

test("lesson text renders for every step of every lesson in both languages (no unfilled placeholders)", () => {
  for (const l of LESSONS) {
    const e = ENGINES[l.kind];
    for (const lang of ["bn", "en"] as const)
      for (const st of e.build(...e.defaults)) {
        const t = noteText(st.note, lang);
        assert.ok(t.length > 5 && !/\{\w+\}/.test(t));
        if (lang === "bn") assert.ok(!/[0-9]/.test(t));
      }
  }
});
