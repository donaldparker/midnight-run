export const SEGMENT = 200;
export const ROAD_WIDTH = 1450;
export interface Segment { index: number; curve: number; y: number; zone: number; decor: number; side: number }
export function random(seed: string): () => number {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => { h += 0x6d2b79f5; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
export function makeRoad(seed: string, count = 2800): Segment[] {
  const rng = random(seed); const road: Segment[] = [];
  let y = 0;
  while (road.length < count) {
    const n = 70 + Math.floor(rng() * 70);
    const curve = road.length < 100 ? 0 : (rng() - .5) * 3.2;
    const rise = road.length < 100 ? 0 : (rng() - .5) * 1800;
    const start = y;
    for (let j = 0; j < n && road.length < count; j++) {
      const t = j / (n - 1);
      y = start + rise * (.5 - .5 * Math.cos(Math.PI * t));
      const i = road.length;
      road.push({ index:i, curve:curve * Math.sin(Math.PI * t) ** 2, y, zone:Math.floor(i / 940) % 3, decor:rng(), side:rng() > .5 ? 1 : -1 });
    }
  }
  return road;
}
