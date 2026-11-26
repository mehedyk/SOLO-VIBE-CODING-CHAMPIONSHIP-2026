import { randomUUID } from 'node:crypto';

/** Unguessable, collision-safe identifier such as `usr_3f9a…`. Never use Math.random for ids. */
export function newId(prefix: string): string {
  return `${prefix}_${randomUUID().replace(/-/g, '').slice(0, 20)}`;
}
