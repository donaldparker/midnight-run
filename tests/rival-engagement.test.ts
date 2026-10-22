import {it,expect} from 'vitest';
import {newRacer} from '../src/core/race';
import {rivalFight,type Fighter} from '../src/actors/rival/behavior';
function simulate(gap:number,speed=7900){const p=newRacer('ian',10000,.32,speed),r:Fighter={...newRacer('r',10000+gap,0,7900),strikeAt:0,strikeSide:1};let hits=0,windups=0;for(let i=1;i<=600;i++){const dt=1/60;p.distance+=p.speed*dt;r.speed+=Math.max(-900*dt,Math.min(900*dt,7800-r.speed));r.distance+=r.speed*dt;const before=r.strikeStarted;if(rivalFight(r,p,i*dt,dt))hits++;if(before!==r.strikeStarted)windups++;}return {hits,windups};}
it('closes a speed-matched gap and actually attacks rather than following passively',()=>{expect(simulate(600).hits).toBeGreaterThan(0);expect(simulate(3000).hits).toBeGreaterThan(0);});
it('winds up before a fast overtaking rider arrives and can connect during the pass',()=>{const result=simulate(3500,11200);expect(result.windups).toBeGreaterThan(0);expect(result.hits).toBeGreaterThan(0);});
