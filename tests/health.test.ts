import {it,expect} from 'vitest';
import {itemKind,heal} from '../src/core/health';
import {combatDifficulty} from '../src/core/difficulty';
it('places chains, repair kits and traffic along the road',()=>{expect(itemKind(.1,.2)).toBe('chain');expect(itemKind(.4,.2)).toBe('health');expect(itemKind(.9,.2)).toBe('car');expect(itemKind(.4,.05)).toBe('car');});
it('restores armor without exceeding the maximum',()=>{expect(heal(40,25,100)).toBe(65);expect(heal(90,25,100)).toBe(100);expect(heal(0,-5,100)).toBe(0);});
it('heals less and drops fewer kits as difficulty rises',()=>{for(let level=1;level<5;level++){const a=combatDifficulty(level),b=combatDifficulty(level+1);expect(b.kitHeal).toBeLessThan(a.kitHeal);expect(b.kits).toBeLessThan(a.kits);expect(b.koHeal).toBeLessThanOrEqual(a.koHeal);}expect(combatDifficulty(5).koHeal).toBe(0);});
