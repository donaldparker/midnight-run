import {it,expect} from 'vitest';
import {newPoliceFight,registerPoliceHit,policeHitDamage} from '../src/actors/police/behavior';
it('requires five landed cop hits before arresting Ian',()=>{const fight=newPoliceFight();for(let i=1;i<5;i++){expect(registerPoliceHit(fight,true)).toBe(false);expect(fight.hits).toBe(i);}expect(registerPoliceHit(fight,true)).toBe(true);expect(fight.hits).toBe(5);});
it('does not count misses or hits blocked by invulnerability',()=>{const fight=newPoliceFight();for(let i=0;i<20;i++)expect(registerPoliceHit(fight,false)).toBe(false);expect(fight.hits).toBe(0);registerPoliceHit(fight,true);registerPoliceHit(fight,false);expect(fight.hits).toBe(1);});
it('keeps cop strikes nonlethal until the fifth hit and resets on a new run',()=>{expect(policeHitDamage(100)).toBe(6);expect(policeHitDamage(3)).toBe(2);expect(policeHitDamage(1)).toBe(0);expect(newPoliceFight().hits).toBe(0);});
