import {it,expect} from 'vitest';
import {newRacer} from '../src/core/race';
import {newPolice,stepPolice} from '../src/actors/police/behavior';
import {encounterCount,carScale} from '../src/core/encounters';
it('keeps replenishing encounters throughout the route without crowding',()=>{for(let distance=10000;distance<560000;distance+=10000)expect(encounterCount(distance,distance-10000,0)).toBe(2);expect(encounterCount(30000,20000,4)).toBe(0);expect(encounterCount(23000,20000,0)).toBe(0);});
it('makes a car wider than a motorcycle at equal depth',()=>{expect(carScale(1000,1000,160)*160).toBe(132);expect(carScale(5000,1000,160)).toBeLessThan(carScale(1000,1000,160));});
it('allows sustained throttle to outrun the patrol',()=>{const p=newRacer('ian',20000,0,11200),cop=newPolice(p);let outcome='pursuing';for(let i=0;i<1200&&outcome==='pursuing';i++){p.distance+=p.speed/60;outcome=stepPolice(cop,p,1/60);}expect(outcome).toBe('escaped');expect(cop.active).toBe(false);});
it('catches and kicks a cruising rider',()=>{const p=newRacer('ian',20000,0,7900),cop=newPolice(p);let outcome='pursuing';for(let i=0;i<1800&&outcome==='pursuing';i++){p.distance+=p.speed/60;outcome=stepPolice(cop,p,1/60);}expect(outcome).toBe('kick');});
