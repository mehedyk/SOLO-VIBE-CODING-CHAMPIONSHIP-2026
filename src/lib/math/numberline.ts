export interface NumberLineStep {
  kind: 'start' | 'jump' | 'result';
  min: number;
  max: number;
  start: number;
  jump: number;
  current: number;
  target: number;
  operation: '+' | '−';
  noteBn: string;
  noteEn: string;
}

export function validateNumberLineInputs(
  start: number,
  jump: number,
  op: '+' | '−'
): { valid: boolean; error?: string } {
  if (!Number.isInteger(start) || !Number.isInteger(jump)) {
    return { valid: false, error: 'Start and jump must be whole integers' };
  }
  if (start < 0 || start > 20) {
    return { valid: false, error: 'Start position must be between 0 and 20' };
  }
  if (jump < 1 || jump > 20) {
    return { valid: false, error: 'Jump magnitude must be between 1 and 20' };
  }
  const target = op === '+' ? start + jump : start - jump;
  if (target < 0 || target > 20) {
    return { valid: false, error: 'Result must remain on number line (0 to 20)' };
  }
  return { valid: true };
}

export function buildNumberLineSteps(
  start: number,
  jump: number,
  op: '+' | '−' = '+'
): NumberLineStep[] {
  const target = op === '+' ? start + jump : start - jump;
  const min = 0;
  const max = 20;

  return [
    {
      kind: 'start',
      min,
      max,
      start,
      jump,
      current: start,
      target,
      operation: op,
      noteBn: `সংখ্যারেখায় শুরুর অবস্থান ${start} এ একটি মার্কার বসানো হলো।`,
      noteEn: `Marker placed at initial starting position ${start} on the number line.`,
    },
    {
      kind: 'jump',
      min,
      max,
      start,
      jump,
      current: start,
      target,
      operation: op,
      noteBn: op === '+'
        ? `শুরুর বিন্দু ${start} থেকে ডানে ${jump} একক লাফ দেওয়া হচ্ছে।`
        : `শুরুর বিন্দু ${start} থেকে বামে ${jump} একক লাফ দেওয়া হচ্ছে।`,
      noteEn: op === '+'
        ? `Leaping ${jump} units to the right from starting point ${start}.`
        : `Leaping ${jump} units to the left from starting point ${start}.`,
    },
    {
      kind: 'result',
      min,
      max,
      start,
      jump,
      current: target,
      target,
      operation: op,
      noteBn: op === '+'
        ? `লাফ শেষে আমরা পৌঁছালাম ${target} এ। অতএব ${start} + ${jump} = ${target}।`
        : `লাফ শেষে আমরা পৌঁছালাম ${target} এ। অতএব ${start} − ${jump} = ${target}।`,
      noteEn: op === '+'
        ? `The jump lands exactly on ${target}. Therefore, ${start} + ${jump} = ${target}.`
        : `The jump lands exactly on ${target}. Therefore, ${start} − ${jump} = ${target}.`,
    },
  ];
}
