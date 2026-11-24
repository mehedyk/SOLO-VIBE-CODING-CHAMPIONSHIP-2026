export type Fraction = readonly [numerator: number, denominator: number];

export interface FractionStep {
  kind: 'initial' | 'partition' | 'highlight' | 'compare' | 'result';
  bars: Array<{
    numerator: number;
    denominator: number;
    shaded: number;
    color: string;
    label: string;
  }>;
  equivalent: boolean;
  noteBn: string;
  noteEn: string;
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function simplifyFraction([n, d]: Fraction): Fraction {
  if (d === 0) throw new Error('Zero denominator');
  const g = gcd(n, d);
  return [n / g, d / g];
}

export function areFractionsEquivalent(f1: Fraction, f2: Fraction): boolean {
  return f1[0] * f2[1] === f1[1] * f2[0];
}

export function validateFraction(n: number, d: number): { valid: boolean; error?: string } {
  if (!Number.isInteger(n) || !Number.isInteger(d)) {
    return { valid: false, error: 'Fractions must use whole integers' };
  }
  if (d <= 0 || d > 16) {
    return { valid: false, error: 'Denominator must be between 1 and 16' };
  }
  if (n < 0 || n > d) {
    return { valid: false, error: 'Numerator must be between 0 and denominator' };
  }
  return { valid: true };
}

export function buildFractionComparisonSteps(f1: Fraction, f2: Fraction): FractionStep[] {
  const [n1, d1] = f1;
  const [n2, d2] = f2;
  const eq = areFractionsEquivalent(f1, f2);

  return [
    {
      kind: 'initial',
      bars: [
        { numerator: n1, denominator: d1, shaded: 0, color: '#0ea5e9', label: `${n1}/${d1}` },
        { numerator: n2, denominator: d2, shaded: 0, color: '#f59e0b', label: `${n2}/${d2}` },
      ],
      equivalent: eq,
      noteBn: `দুটি বার দেখানো হয়েছে: প্রথমটি ${d1} ভাগে এবং দ্বিতীয়টি ${d2} ভাগে ভাগ করা হবে।`,
      noteEn: `Two whole bars shown: the first will be partitioned into ${d1} parts, the second into ${d2} parts.`,
    },
    {
      kind: 'partition',
      bars: [
        { numerator: n1, denominator: d1, shaded: 0, color: '#0ea5e9', label: `${n1}/${d1}` },
        { numerator: n2, denominator: d2, shaded: 0, color: '#f59e0b', label: `${n2}/${d2}` },
      ],
      equivalent: eq,
      noteBn: `প্রথম বারটিকে ${d1}টি সমান অংশে এবং দ্বিতীয় বারটিকে ${d2}টি সমান অংশে ভাগ করা হলো।`,
      noteEn: `First bar partitioned into ${d1} equal pieces, second bar into ${d2} equal pieces.`,
    },
    {
      kind: 'highlight',
      bars: [
        { numerator: n1, denominator: d1, shaded: n1, color: '#0ea5e9', label: `${n1}/${d1}` },
        { numerator: n2, denominator: d2, shaded: n2, color: '#f59e0b', label: `${n2}/${d2}` },
      ],
      equivalent: eq,
      noteBn: `প্রথম বারের ${n1}টি অংশ এবং দ্বিতীয় বারের ${n2}টি অংশ রঙ করা হলো।`,
      noteEn: `Shaded ${n1} pieces of the first bar and ${n2} pieces of the second bar.`,
    },
    {
      kind: 'result',
      bars: [
        { numerator: n1, denominator: d1, shaded: n1, color: '#0ea5e9', label: `${n1}/${d1}` },
        { numerator: n2, denominator: d2, shaded: n2, color: '#f59e0b', label: `${n2}/${d2}` },
      ],
      equivalent: eq,
      noteBn: eq
        ? `উভয় বারের রঙ করা অংশের মোট দৈর্ঘ্য হুবহু সমান! অতএব ${n1}/${d1} = ${n2}/${d2} সমতুল্য ভগ্নাংশ।`
        : `রঙ করা অংশের দৈর্ঘ্য সমান নয়। অতএব ${n1}/${d1} এবং ${n2}/${d2} সমতুল্য নয়।`,
      noteEn: eq
        ? `Both shaded regions span the exact same length! Therefore, ${n1}/${d1} = ${n2}/${d2} are equivalent fractions.`
        : `The shaded regions do not span the same length. Therefore, ${n1}/${d1} and ${n2}/${d2} are not equivalent.`,
    },
  ];
}
