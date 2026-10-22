import {describe,it,expect} from 'vitest';
import {sampleRoad,riderScale,passingOpacity,type RoadSample} from '../src/core/actor-projection';
import {projectGround} from '../src/core/projection';
const project=(z:number)=>projectGround(0,0,z,0,1000,0,1450);
const samples=new Map<number,RoadSample>([4,5,6].map(index=>[index,{index,p:project(index*200),end:project((index+1)*200),clip:270}]));
describe('close-pass rendering regressions',()=>{
 it('moves continuously across a road segment boundary',()=>{const before=sampleRoad(samples,999.999)!,after=sampleRoad(samples,1000.001)!;expect(Math.abs(before.p.y-after.p.y)).toBeLessThan(.01);expect(Math.abs(before.p.w-after.p.w)).toBeLessThan(.01);});
 it('projects the actual distance between the segment endpoints',()=>{const sample=sampleRoad(samples,1100)!;const exact=project(1100);expect(sample.p.y).toBeCloseTo(exact.y,1);expect(sample.p.scale).toBeCloseTo(exact.scale,8);});
 it('matches Ian’s displayed height when a rival is alongside',()=>{expect(riderScale(1090,1090,88,320)*320).toBeCloseTo(88,6);});
 it('limits close riders to a reasonable size',()=>{expect(riderScale(300,1090,88,320)*320).toBeLessThanOrEqual(110);});
 it('fades overtaken rivals instead of abruptly dropping the sprite',()=>{expect(passingOpacity(-200.001)).toBeCloseTo(passingOpacity(-199.999),4);expect(passingOpacity(-325)).toBeGreaterThan(0);expect(passingOpacity(-650)).toBe(0);expect(passingOpacity(0)).toBe(1);});
});
