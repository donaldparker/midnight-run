import {describe,it,expect} from 'vitest';
import {weaponAfterAttack,gearAttack,attackSide,MOVES,type Move} from '../src/core/combat';
import {riderTexture,FRAME_TIMES,contactAt,attackDuration,frameAt,OUTRO_TIMES,duration} from '../src/actors/rider/poses';
describe('attack motion and handedness',()=>{
 for(const move of Object.keys(MOVES) as Move[])for(const side of [-1,1])it(`${move} has six ${side<0?'left':'right'} frames`,()=>{
  let age=0;const keys=FRAME_TIMES[move].map(t=>{const key=riderTexture('club',move,age+t/2,side);age+=t;return key;});expect(new Set(keys).size).toBe(6);expect(keys.every(k=>k.includes(side<0?'left':'right'))).toBe(true);
  expect(contactAt(move)).toBeGreaterThan(0);expect(contactAt(move)).toBeLessThan(attackDuration(move));
 });
 it('targets the nearest enemy rather than the steering direction for all moves',()=>{for(const move of Object.keys(MOVES) as Move[]){expect(attackSide({distance:0,lane:0},[{distance:300,lane:-.4},{distance:600,lane:.4}],move,1)).toBe(-1);expect(attackSide({distance:0,lane:0},[{distance:300,lane:.4}],move,-1)).toBe(1);}});
 it('preserves equipment when punching and kicking',()=>{expect(weaponAfterAttack('chain','punch',{chain:3})).toBe('chain');expect(weaponAfterAttack('chain','kick',{chain:3})).toBe('chain');});
 it('falls back to the cane after the last chain charge',()=>{expect(weaponAfterAttack('chain','chain',{chain:0})).toBe('club');expect(gearAttack('chain',{chain:0})).toBe('club');});
 it('removes the fireball from available moves',()=>{expect(Object.keys(MOVES)).toEqual(['punch','kick','club','chain']);});
 it('plays all six ending poses and holds the last',()=>{let age=0;OUTRO_TIMES.forEach((t,i)=>{expect(frameAt(age+t/2,OUTRO_TIMES)).toBe(i);age+=t;});expect(frameAt(100,OUTRO_TIMES)).toBe(5);expect(duration(OUTRO_TIMES)).toBeGreaterThan(4);});
});
