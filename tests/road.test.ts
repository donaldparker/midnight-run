import {describe,it,expect} from 'vitest';
import {makeRoad,SEGMENT} from '../src/levels/build-level';
import {strike,crossed} from '../src/core/combat';
import {newRacer,stepPlayer,rank} from '../src/core/race';
import {IAN} from '../src/riders';
import {projectGround} from '../src/core/projection';
describe('procedural routes',()=>{
 it('replays a seed exactly, with different roads for different seeds',()=>{expect(makeRoad('ian')).toEqual(makeRoad('ian'));expect(makeRoad('ian')).not.toEqual(makeRoad('leona'));});
 it('keeps curves and hills smooth across section joins for many seeds',()=>{for(let n=0;n<20;n++){const road=makeRoad(String(n));expect(road).toHaveLength(6000);for(let i=1;i<road.length;i++){expect(Math.abs(road[i].y-road[i-1].y)).toBeLessThan(22);expect(Math.abs(road[i].curve-road[i-1].curve)).toBeLessThan(.1);expect(Number.isFinite(road[i].y)).toBe(true);}}});
 it('supports all three scenery regions and opens on a safe straight',()=>{const road=makeRoad('midnight');expect(new Set(road.map(s=>s.zone)).size).toBe(3);expect(road.slice(0,70).every(s=>s.curve===0)).toBe(true);expect(road.length*SEGMENT).toBe(1200000);});
});
describe('combat geometry',()=>{
 it('requires a nearby rival on the side being attacked',()=>{expect(strike('punch',500,.4,1)).toBe(true);expect(strike('punch',500,.4,-1)).toBe(false);expect(strike('punch',900,.4,1)).toBe(false);expect(strike('club',500,1.1,1)).toBe(false);expect(strike('club',500,0,0)).toBe(false);});
 it('gives a chain more reach than the shillelagh',()=>{expect(strike('chain',1300,.5,1)).toBe(true);expect(strike('club',1300,.5,1)).toBe(false);});
 it('detects pickups crossed at high speed rather than requiring exact overlap',()=>{expect(crossed(1000,1560,1200)).toBe(true);expect(crossed(1560,1800,1200)).toBe(false);});
});
describe('racing and perspective',()=>{
 it('accelerates and brakes with stable nonnegative speed',()=>{const p=newRacer('ian');for(let i=0;i<500;i++)stepPlayer(p,1,0,0,.02,IAN);expect(p.speed).toBe(IAN.stats.boostSpeed);const d=p.distance;for(let i=0;i<100;i++)stepPlayer(p,-1,0,0,.02,IAN);expect(p.speed).toBe(0);expect(p.distance).toBeGreaterThan(d);});
 it('penalizes riding on the shoulder and bounds steering',()=>{const p=newRacer('ian',0,1.5,11000);stepPlayer(p,1,1,0,1,IAN);expect(p.speed).toBeLessThan(11000);expect(p.lane).toBeLessThanOrEqual(1.6);});
 it('ranks racers by actual distance',()=>{expect(rank(newRacer('ian',100),[newRacer('a',200),newRacer('b',50)])).toBe(2);});
 it('shrinks distant road segments toward the horizon',()=>{const near=projectGround(0,0,1000,0,1000,0,1450),far=projectGround(0,0,10000,0,1000,0,1450);expect(near.w).toBeGreaterThan(far.w);expect(near.y).toBeGreaterThan(far.y);});
});
