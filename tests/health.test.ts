import {it,expect} from 'vitest';
import {itemKind,heal,REPAIR_KIT_HEAL} from '../src/core/health';
it('places chains, repair kits and traffic along the road',()=>{expect(itemKind(.1)).toBe('chain');expect(itemKind(.4)).toBe('health');expect(itemKind(.9)).toBe('car');});
it('restores armor without exceeding the maximum',()=>{expect(heal(40,REPAIR_KIT_HEAL,100)).toBe(70);expect(heal(90,REPAIR_KIT_HEAL,100)).toBe(100);expect(heal(0,-5,100)).toBe(0);});
