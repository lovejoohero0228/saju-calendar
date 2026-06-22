export function seededScore(seed: string): number {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash % 101);
}

export function seededPick<T>(seed: string, values: readonly T[]): T {
  return values[seededScore(seed) % values.length];
}
