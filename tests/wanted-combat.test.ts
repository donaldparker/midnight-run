import {it,expect} from 'vitest';
import {newWanted,addWanted,coolWanted,wantedLevel,pursuitDelay} from '../src/core/wanted';
import {MOVES} from '../src/core/combat';
import {rivalFight,RIVAL_ARMOR} from '../src/actors/rival/behavior';
import {newRacer} from '../src/core/race';
import {newPolice,stepPolice} from '../src/actors/police/behavior';
it('raises wanted levels with damage, doubles police heat and caps five stars',()=>{const w=newWanted();expect(wantedLevel(w)).toBe(0);addWanted(w,7);expect(wantedLevel(w)).toBe(1);addWanted(w,14,true);expect(wantedLevel(w)).toBe(2);addWanted(w,1000);expect(wantedLevel(w)).toBe(5);expect(pursuitDelay(5)).toBeLessThan(pursuitDelay(1));});
it('only cools wanted heat after ten quiet seconds outside pursuit',()=>{const w=newWanted();addWanted(w,28);coolWanted(w,20,true);expect(w.heat).toBe(28);coolWanted(w,10,false);expect(w.heat).toBe(28);coolWanted(w,5,false);expect(w.heat).toBe(13);addWanted(w,7);expect(w.quiet).toBe(0);});
it('takes exactly two punches or a single chain or cane to defeat a rival',()=>{expect(RIVAL_ARMOR-MOVES.punch.damage).toBeGreaterThan(0);expect(RIVAL_ARMOR-2*MOVES.punch.damage).toBe(0);expect(RIVAL_ARMOR-MOVES.chain.damage).toBeLessThanOrEqual(0);expect(RIVAL_ARMOR-MOVES.club.damage).toBeLessThanOrEqual(0);});
it('telegraphs rival punches and lets Ian dodge before contact',()=>{const p=newRacer('ian',1000,.4,7900);const r={...newRacer('rival',1100,0,7900),armor:14,strikeAt:0,strikeSide:1};expect(rivalFight(r,p,1,.016)).toBe(false);expect(r.strikeAt).toBe(1.5);p.lane=1.2;expect(rivalFight(r,p,1.6,.016)).toBe(false);expect(r.strikeAt).toBe(0);});
it('allows a nearby rival to land a punch after its windup but never after defeat',()=>{const p=newRacer('ian',1000,.4,7900),r={...newRacer('rival',1100,0,7900),armor:14,strikeAt:0,strikeSide:1};rivalFight(r,p,1,.016);expect(rivalFight(r,p,1.6,.016)).toBe(true);r.armor=0;expect(rivalFight(r,p,5,.016)).toBe(false);});
it('police kicks wind up and can be dodged by accelerating away',()=>{const p=newRacer('ian',1000,.4,7900),c=newPolice(p);c.distance=1000;c.lane=0;c.pursuitAge=3;c.speed=7900;expect(stepPolice(c,p,.016)).toBe('pursuing');expect(c.kickAt).toBeGreaterThan(3);p.distance+=4000;expect(stepPolice(c,p,.7)).toBe('pursuing');});

it('stays escapable even at five wanted stars',()=>{const p=newRacer('ian',20000,0,11200),cop=newPolice(p);let outcome='pursuing';for(let i=0;i<1800&&outcome==='pursuing';i++){p.distance+=p.speed/60;outcome=stepPolice(cop,p,1/60,5);}expect(outcome).toBe('escaped');});
it('applies only quiet time beyond the cooling delay in a long step',()=>{const w=newWanted();addWanted(w,56);coolWanted(w,12,false);expect(w.heat).toBe(50);});
