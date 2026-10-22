import {it,expect} from 'vitest';
import {combatDifficulty,clampDifficulty,difficultyDescription} from '../src/core/difficulty';
it('scales durability and aggression together from Easy to Outlaw',()=>{for(let level=1;level<5;level++){const a=combatDifficulty(level),b=combatDifficulty(level+1);expect(b.armor).toBeGreaterThan(a.armor);expect(b.interval).toBeLessThan(a.interval);expect(b.windup).toBeLessThan(a.windup);expect(b.steer).toBeGreaterThan(a.steer);}expect(combatDifficulty(2).armor).toBe(14);});
it('keeps every difficulty escapable at full throttle',()=>{for(let i=1;i<=5;i++)expect(combatDifficulty(i).chase).toBeLessThan(11200);});
it('validates saved settings and explains the actual hit counts',()=>{expect(clampDifficulty(NaN)).toBe(2);expect(clampDifficulty(100)).toBe(5);expect(clampDifficulty(-1)).toBe(1);expect(difficultyDescription(2)).toContain('2 punches or 1 cane/chain hit');expect(difficultyDescription(5)).toContain('5 punches or 3 cane/chain hits');});
