/** Bangla/English numeral helpers. Integers only: exact arithmetic, no floats. */
const BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"] as const;

export function toBnDigits(s: string): string {
  return s.replace(/[0-9]/g, (d) => BN[Number(d)] ?? d);
}

export function formatInt(n: number, lang: "bn" | "en"): string {
  if (!Number.isSafeInteger(n)) throw new RangeError("not a safe integer");
  const s = String(n);
  return lang === "bn" ? toBnDigits(s) : s;
}

export type ParseResult =
  | { ok: true; value: number }
  | { ok: false; reason: "empty" | "not_integer" | "too_long" };

/**
 * Parse a learner's typed whole number. Accepts Bangla or English digits,
 * surrounding spaces, commas as thousands separators and leading zeros.
 * Rejects decimals, signs and letters (we never guess what they meant).
 */
export function parseNumeral(raw: string): ParseResult {
  const t = raw.trim().replace(/[,٬،\s]/g, "");
  if (t === "") return { ok: false, reason: "empty" };
  if (t.length > 9) return { ok: false, reason: "too_long" };
  const ascii = t.replace(/[০-৯]/g, (d) => String(BN.indexOf(d as (typeof BN)[number])));
  if (!/^[0-9]+$/.test(ascii)) return { ok: false, reason: "not_integer" };
  return { ok: true, value: Number(ascii) };
}
