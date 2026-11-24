/**
 * National Curriculum and Textbook Board (NCTB) Bangladesh
 * Primary Mathematics (প্রাথমিক গণিত) Curriculum: Classes 1 to 5.
 * Complete chapter mapping, learning competencies, and interactive visual manipulative engines.
 */

export interface NCTBChapter {
  id: string;
  slug: string;
  grade: 1 | 2 | 3 | 4 | 5;
  chapterNumber: number;
  titleBn: string;
  titleEn: string;
  topic: 'counting' | 'addition' | 'subtraction' | 'multiplication' | 'division' | 'fractions' | 'decimals' | 'measurement' | 'geometry' | 'statistics';
  objectiveBn: string;
  objectiveEn: string;
  manipulative: 'base10' | 'fraction_bars' | 'number_line' | 'counting_dots' | 'multiplication_grid' | 'decimals_grid' | 'geoboard';
  demoNumbers: [number, number];
  interactiveRoute: string;
  slideSlug: string;
  summaryBn: string;
  summaryEn: string;
}

export const NCTB_CURRICULUM: readonly NCTBChapter[] = [
  // ─── CLASS 1 ─────────────────────────────────────────────────────────────
  {
    id: 'c1-ch1',
    slug: 'counting-dots',
    grade: 1,
    chapterNumber: 1,
    titleBn: 'গণনা ও সংখ্যা পরিচিতি (১ থেকে ১০)',
    titleEn: 'Counting & Number Sense (1 to 10)',
    topic: 'counting',
    objectiveBn: 'বাস্তব বস্তু ও ডটের মাধ্যমে ১ থেকে ১০ পর্যন্ত সংখ্যা গণনা ও সমজাতীয় জোড় মেলানো।',
    objectiveEn: 'Count and associate quantities 1 to 10 through concrete dots and pairing.',
    manipulative: 'counting_dots',
    demoNumbers: [7, 3],
    interactiveRoute: '/manipulatives/counting',
    slideSlug: 'counting-dots',
    summaryBn: 'বস্তু গুণে সংখ্যার প্রতীকের সাথে মেলাও এবং কম-বেশির পার্থক্য প্রত্যক্ষ করো।',
    summaryEn: 'Count physical items, match with numerals, and see visual comparisons.',
  },
  {
    id: 'c1-ch2',
    slug: 'addition-basic',
    grade: 1,
    chapterNumber: 2,
    titleBn: 'একত্রে করা: প্রাথমিক যোগ',
    titleEn: 'Combining Quantities: Basic Addition',
    topic: 'addition',
    objectiveBn: 'দুটি দলের বস্তু একত্রিত করে ১০-এর মধ্যে যোগফল নির্ণয় করা।',
    objectiveEn: 'Combine two groups of items to find totals within 10 visually.',
    manipulative: 'number_line',
    demoNumbers: [4, 3],
    interactiveRoute: '/manipulatives/numberline',
    slideSlug: 'addition-basic',
    summaryBn: 'সংখ্যারেখায় ডানদিকে লাফিয়ে যোগের প্রত্যক্ষ ধারণা অর্জন করো।',
    summaryEn: 'Jump forward on the directed number line to understand addition.',
  },
  {
    id: 'c1-ch3',
    slug: 'subtraction-basic',
    grade: 1,
    chapterNumber: 3,
    titleBn: 'বাদ দেওয়া: প্রাথমিক বিয়োগ',
    titleEn: 'Take-Away: Basic Subtraction',
    topic: 'subtraction',
    objectiveBn: 'নির্দিষ্ট সংখ্যক বস্তু সরিয়ে নিয়ে বিয়োগের ধারণা ও শূন্যের (০) উৎপত্তি বোঝা।',
    objectiveEn: 'Remove items from a set to understand subtraction and zero conceptually.',
    manipulative: 'number_line',
    demoNumbers: [8, 3],
    interactiveRoute: '/manipulatives/numberline',
    slideSlug: 'subtraction-basic',
    summaryBn: 'সংখ্যারেখায় বামদিকে পিছিয়ে বিয়োগফল নির্ণয় করো।',
    summaryEn: 'Step backwards on the number line to find the difference.',
  },

  // ─── CLASS 2 ─────────────────────────────────────────────────────────────
  {
    id: 'c2-ch1',
    slug: 'subtraction-regrouping',
    grade: 2,
    chapterNumber: 1,
    titleBn: 'হাতে রেখে বিয়োগ ও দশকে রূপান্তর',
    titleEn: 'Subtraction with Regrouping (Base-10)',
    topic: 'subtraction',
    objectiveBn: '১টি দশক ভেঙে ১০টি এককে রূপান্তর করে দ্বি-অঙ্কের বিয়োগ সমাধান।',
    objectiveEn: 'Decompose 1 ten into 10 ones while preserving total invariant value.',
    manipulative: 'base10',
    demoNumbers: [52, 27],
    interactiveRoute: '/lessons/subtraction-regrouping',
    slideSlug: 'subtraction-regrouping',
    summaryBn: '১০টি একের বিনিময়ে ১টি দশ রড ভেঙে বিয়োগ করার জীবন্ত ভিজ্যুয়াল মডেল।',
    summaryEn: 'Interactive Base-10 block exchange where value remains constant.',
  },
  {
    id: 'c2-ch2',
    slug: 'addition-regrouping',
    grade: 2,
    chapterNumber: 2,
    titleBn: 'হাতে রেখে যোগ ও নতুন দশক গঠন',
    titleEn: 'Addition with Regrouping (Bundle to Ten)',
    topic: 'addition',
    objectiveBn: '১০টি একক একত্রিত হয়ে ১টি নতুন দশক রডে পরিণত হওয়ার ভিজ্যুয়াল প্রমাণ।',
    objectiveEn: 'Bundle 10 ones into a solid ten rod with carrying to tens column.',
    manipulative: 'base10',
    demoNumbers: [48, 37],
    interactiveRoute: '/lessons/addition-regrouping',
    slideSlug: 'addition-regrouping',
    summaryBn: 'এককের ঘরে ১০ পূর্ণ হলে কীভাবে দশকের ঘরে ১ যুক্ত হয় তা প্রত্যক্ষ করো।',
    summaryEn: 'See concrete ones units gather into a ten-rod and carry leftward.',
  },
  {
    id: 'c2-ch3',
    slug: 'multiplication-grid',
    grade: 2,
    chapterNumber: 3,
    titleBn: 'গুণের ধারণা ও আয়তাকার নামতা গ্রিড',
    titleEn: 'Multiplication Arrays & Times Tables',
    topic: 'multiplication',
    objectiveBn: 'পুনরাবৃত্তিমূলক যোগফল হিসেবে গুণ বোঝা এবং সারি-কলামে নামতা নির্ণয়।',
    objectiveEn: 'Understand multiplication as repeated addition using row-column arrays.',
    manipulative: 'multiplication_grid',
    demoNumbers: [4, 6],
    interactiveRoute: '/manipulatives/multiplication',
    slideSlug: 'multiplication-grid',
    summaryBn: '৪ সারি এবং ৬ কলামের গ্রিডে ২৪টি বিন্দুর জ্যামিতিক বিন্যাস দেখুন।',
    summaryEn: 'Visualize 4 rows times 6 columns generating a total of 24 units.',
  },

  // ─── CLASS 3 ─────────────────────────────────────────────────────────────
  {
    id: 'c3-ch1',
    slug: 'place-value-thousands',
    grade: 3,
    chapterNumber: 1,
    titleBn: '৪-অঙ্কের স্থানীয় মান (একক, দশক, শতক, হাজার)',
    titleEn: '4-Digit Place Value (Thousands, Hundreds, Tens, Ones)',
    topic: 'counting',
    objectiveBn: '১০০ এবং ১০০০ এর ব্লক দিয়ে বড় সংখ্যা গঠন ও বিশ্লেষণ।',
    objectiveEn: 'Construct and decompose 4-digit numbers using 3D cube representations.',
    manipulative: 'base10',
    demoNumbers: [1345, 0],
    interactiveRoute: '/lessons/subtraction-regrouping',
    slideSlug: 'place-value-thousands',
    summaryBn: 'হাজারের কিউব, শতকের ফ্ল্যাট এবং দশকের রড সাজিয়ে সংখ্যা তৈরি করুন।',
    summaryEn: 'Arrange thousands cubes, hundreds flats, and ten rods interactively.',
  },
  {
    id: 'c3-ch2',
    slug: 'fraction-bars',
    grade: 3,
    chapterNumber: 2,
    titleBn: 'ভগ্নাংশের ধারণা: হর, লব ও সমান অংশ',
    titleEn: 'Introduction to Fractions (Parts of a Whole)',
    topic: 'fractions',
    objectiveBn: 'একটি পূর্ণ বস্তুকে সমান অংশে ভাগ করে হর ও লবের সম্পর্ক স্থাপন।',
    objectiveEn: 'Partition a whole bar into equal sections to see numerator & denominator.',
    manipulative: 'fraction_bars',
    demoNumbers: [3, 4],
    interactiveRoute: '/manipulatives/fractions',
    slideSlug: 'fraction-bars',
    summaryBn: '৩/৪ মানে ৪টি সমান অংশের ৩টি অংশ—বার কেটে সরাসরি মিলিয়ে দেখুন।',
    summaryEn: 'Visually highlight 3 out of 4 segments in a segmented fraction bar.',
  },
  {
    id: 'c3-ch3',
    slug: 'geometry-shapes',
    grade: 3,
    chapterNumber: 3,
    titleBn: 'জ্যামিতিক আকৃতি ও কোণ (সমকোণ, ত্রিভুজ, চতুর্ভুজ)',
    titleEn: 'Geometric Shapes & Angles (Right Angle & Polygons)',
    topic: 'geometry',
    objectiveBn: 'বিন্দু, রেখা ও কোণ চেনা এবং সমকোণের ধারণা উপলব্ধি।',
    objectiveEn: 'Identify right angles, triangles, and quadrilaterals on a grid.',
    manipulative: 'geoboard',
    demoNumbers: [90, 3],
    interactiveRoute: '/manipulatives/geometry',
    slideSlug: 'geometry-shapes',
    summaryBn: 'ইন্টারঅ্যাক্টিভ জিওবোর্ডে রাবার ব্যান্ড টেনে ত্রিভুজ ও চতুর্ভুজ তৈরি করুন।',
    summaryEn: 'Stretch virtual bands on a pegboard to inspect shapes and 90° angles.',
  },

  // ─── CLASS 4 ─────────────────────────────────────────────────────────────
  {
    id: 'c4-ch1',
    slug: 'equivalent-fractions',
    grade: 4,
    chapterNumber: 1,
    titleBn: 'সমতুল্য ভগ্নাংশ ও সাধারণ হর',
    titleEn: 'Equivalent Fractions (Visual Proof)',
    topic: 'fractions',
    objectiveBn: '১/২, ২/৪, ৪/৮ যে একই দৈর্ঘ্য নির্দেশ করে তা বার পাশাপাশি রেখে যাচাই।',
    objectiveEn: 'Prove 1/2 = 2/4 = 4/8 by comparing aligned bar lengths.',
    manipulative: 'fraction_bars',
    demoNumbers: [1, 2],
    interactiveRoute: '/manipulatives/fractions',
    slideSlug: 'equivalent-fractions',
    summaryBn: 'বারগুলোকে উল্লম্ব রেখায় মিলিয়ে সমতুল্যতা নিশ্চিত করুন।',
    summaryEn: 'Align fraction partition bars against vertical hairline references.',
  },
  {
    id: 'c4-ch2',
    slug: 'decimals-tenths',
    grade: 4,
    chapterNumber: 2,
    titleBn: 'দশমিক ভগ্নাংশ: দশমাংশ ও শতাংশ',
    titleEn: 'Decimals: Tenths & Hundredths Grid',
    topic: 'decimals',
    objectiveBn: '১-কে ১০ ও ১০০ ভাগে ভাগ করে ০.১ এবং ০.০১ এর মান উপলব্ধি।',
    objectiveEn: 'Represent decimals as fractions of a 100-cell grid.',
    manipulative: 'decimals_grid',
    demoNumbers: [75, 100],
    interactiveRoute: '/manipulatives/decimals',
    slideSlug: 'decimals-tenths',
    summaryBn: '১০০ ঘরের গ্রিডে ৭৫টি ঘর রঙ করে ০.৭৫ এর প্রত্যক্ষ রূপ দেখুন।',
    summaryEn: 'Color 75 cells out of 100 to visualize 0.75 without abstraction.',
  },

  // ─── CLASS 5 ─────────────────────────────────────────────────────────────
  {
    id: 'c5-ch1',
    slug: 'percentage-grid',
    grade: 5,
    chapterNumber: 1,
    titleBn: 'শতকরা ও লাভ-ক্ষতির বাস্তব প্রয়োগ',
    titleEn: 'Percentages & Real-Life Profit/Loss',
    topic: 'statistics',
    objectiveBn: 'শতকরাকে ১০০-র অনুপাতে প্রকাশ এবং লাভ বা ক্ষতির শতকরা হার হিসাব।',
    objectiveEn: 'Model percentages per hundred and calculate profit/loss visually.',
    manipulative: 'decimals_grid',
    demoNumbers: [25, 100],
    interactiveRoute: '/manipulatives/decimals',
    slideSlug: 'percentage-grid',
    summaryBn: '২৫% মানে প্রতি ১০০-তে ২৫; গ্রিড কালারিংয়ের মাধ্যমে লাভ-ক্ষতি গণনা।',
    summaryEn: 'Visual 100-unit matrix demonstrating percentage discount & margins.',
  },
  {
    id: 'c5-ch2',
    slug: 'averages-balance',
    grade: 5,
    chapterNumber: 2,
    titleBn: 'গড় ও সমান বন্টন (ভারসাম্য স্কেল)',
    titleEn: 'Averages & Equal Redistribution',
    topic: 'statistics',
    objectiveBn: 'বিভিন্ন রাশির সমষ্টিকে সমান ভাগে ভাগ করে গড়ের ভারসাম্য বিন্দু নির্ণয়।',
    objectiveEn: 'Redistribute uneven quantities into uniform levels on a balance scale.',
    manipulative: 'number_line',
    demoNumbers: [12, 4],
    interactiveRoute: '/manipulatives/numberline',
    slideSlug: 'averages-balance',
    summaryBn: 'উঁচু-নিচু স্তম্ভ সমান উচ্চতায় এনে গড়ের সত্যতা যাচাই করুন।',
    summaryEn: 'Level out unequal columns to find the invariant average height.',
  },
];

export function getChaptersByGrade(grade?: number): NCTBChapter[] {
  if (!grade) return [...NCTB_CURRICULUM];
  return NCTB_CURRICULUM.filter((c) => c.grade === grade);
}

export function findChapterBySlug(slug: string): NCTBChapter | undefined {
  return NCTB_CURRICULUM.find((c) => c.slug === slug);
}
