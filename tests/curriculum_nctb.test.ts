import test from 'node:test';
import assert from 'node:assert/strict';
import {
  NCTB_CURRICULUM,
  CURRICULUM_MANIPULATIVES,
  CURRICULUM_TOPICS,
  TOPIC_LABELS,
  VISUAL_TOOLS,
  chapterInteractiveHref,
  curriculumFacetCounts,
  filterChapters,
  getChaptersByGrade,
  findChapterBySlug,
  parseCurriculumQuery,
} from '../src/lib/curriculum/nctb';

test('NCTB Primary Mathematics Curriculum (Classes 1-5): covers all 56 chapters', () => {
  assert.equal(NCTB_CURRICULUM.length, 56);
});

test('NCTB Curriculum: authentic chapter count per grade', () => {
  const grade1 = getChaptersByGrade(1);
  const grade2 = getChaptersByGrade(2);
  const grade3 = getChaptersByGrade(3);
  const grade4 = getChaptersByGrade(4);
  const grade5 = getChaptersByGrade(5);

  assert.equal(grade1.length, 11);
  assert.equal(grade2.length, 12);
  assert.equal(grade3.length, 11);
  assert.equal(grade4.length, 10);
  assert.equal(grade5.length, 12);

  assert.equal(grade1.length + grade2.length + grade3.length + grade4.length + grade5.length, 56);
});

test('NCTB Curriculum: unique IDs and slugs across all 56 chapters', () => {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const ch of NCTB_CURRICULUM) {
    assert.equal(ids.has(ch.id), false, `Duplicate ID: ${ch.id}`);
    assert.equal(slugs.has(ch.slug), false, `Duplicate slug: ${ch.slug}`);
    ids.add(ch.id);
    slugs.add(ch.slug);
  }

  assert.equal(ids.size, 56);
  assert.equal(slugs.size, 56);
});

test('NCTB Curriculum: covers all 10 authentic math topics', () => {
  const topics = new Set(NCTB_CURRICULUM.map((c) => c.topic));
  const expectedTopics = [
    'counting',
    'addition',
    'subtraction',
    'multiplication',
    'division',
    'fractions',
    'decimals',
    'measurement',
    'geometry',
    'statistics',
  ];

  for (const t of expectedTopics) {
    assert.equal(topics.has(t as any), true, `Missing topic: ${t}`);
  }
});

test('NCTB Curriculum: maps to all concrete manipulative engines', () => {
  const manipulatives = new Set(NCTB_CURRICULUM.map((c) => c.manipulative));
  const expectedManipulatives = [
    'base10',
    'fraction_bars',
    'number_line',
    'counting_dots',
    'multiplication_grid',
    'decimals_grid',
    'geoboard',
  ];

  for (const m of expectedManipulatives) {
    assert.equal(manipulatives.has(m as any), true, `Missing manipulative: ${m}`);
  }
});

test('NCTB Curriculum: complete metadata, bilingual titles, and valid routes', () => {
  for (const ch of NCTB_CURRICULUM) {
    assert.ok(ch.titleBn.trim().length > 0);
    assert.ok(ch.titleEn.trim().length > 0);
    assert.ok(ch.objectiveBn.trim().length > 0);
    assert.ok(ch.objectiveEn.trim().length > 0);
    assert.ok(ch.summaryBn.trim().length > 0);
    assert.ok(ch.summaryEn.trim().length > 0);

    assert.ok(ch.interactiveRoute.startsWith('/'));
    assert.equal(ch.demoNumbers.length, 2);
    assert.equal(typeof ch.demoNumbers[0], 'number');
    assert.equal(typeof ch.demoNumbers[1], 'number');
  }
});

test('NCTB Curriculum: findChapterBySlug correctly resolves all 56 slugs', () => {
  for (const ch of NCTB_CURRICULUM) {
    const found = findChapterBySlug(ch.slug);
    assert.ok(found);
    assert.equal(found?.id, ch.id);
    assert.equal(found?.grade, ch.grade);
  }

  assert.equal(findChapterBySlug('non-existent-slug'), undefined);
});

test('VISUAL_TOOLS covers all 7 manipulatives and valid routes', () => {
  const covered = new Set(VISUAL_TOOLS.map((t) => t.manipulative));
  for (const m of CURRICULUM_MANIPULATIVES) {
    assert.equal(covered.has(m), true, `Missing visual tool for ${m}`);
  }
  for (const tp of CURRICULUM_TOPICS) {
    assert.ok(TOPIC_LABELS[tp].bn.length > 0 && TOPIC_LABELS[tp].en.length > 0, tp);
  }
  for (const t of VISUAL_TOOLS) {
    assert.ok(t.href.startsWith('/'));
    assert.ok(t.titleBn.length > 0 && t.titleEn.length > 0);
  }
});

test('Curriculum filtering, Bangla/English search, and query whitelist work across 56 chapters', () => {
  const safe = parseCurriculumQuery({
    grade: '99',
    topic: '$ne',
    tool: 'bad_tool',
    sort: 'DROP',
    q: 'x'.repeat(200),
  });
  assert.equal(safe.grade, undefined);
  assert.equal(safe.topic, '');
  assert.equal(safe.manipulative, '');
  assert.equal(safe.sort, 'order');
  assert.equal(safe.q.length, 80);

  const g4Fractions = filterChapters(parseCurriculumQuery({ grade: '4', topic: 'fractions' }), 'en');
  assert.ok(g4Fractions.length > 0);
  assert.ok(g4Fractions.every((c) => c.grade === 4 && c.topic === 'fractions'));

  const bnQuery = filterChapters(parseCurriculumQuery({ q: 'ভগ্নাংশ' }), 'en');
  assert.ok(bnQuery.length > 0);
  assert.ok(bnQuery.some((c) => c.topic === 'fractions'));

  const digitQuery = filterChapters(parseCurriculumQuery({ q: 'শ্রেণি ৩' }), 'bn');
  assert.ok(digitQuery.length > 0);
  assert.ok(digitQuery.some((c) => c.grade === 3));

  const facets = curriculumFacetCounts();
  let gradeTotal = 0;
  for (const count of facets.grades.values()) gradeTotal += count;
  assert.equal(gradeTotal, 56);

  const sample = NCTB_CURRICULUM[0]!;
  assert.equal(chapterInteractiveHref(sample, 'bn'), `/bn${sample.interactiveRoute}?chapter=${encodeURIComponent(sample.slug)}`);
});
