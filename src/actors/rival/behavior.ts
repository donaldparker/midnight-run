import type {Racer} from '../../core/race';
export interface Fighter extends Racer {strikeAt:number;strikeSide:number}
export const RIVAL_ARMOR=14;
/** A visible windup gives the player a chance to lean away before the punch lands. */
export function rivalFight(r:Fighter,player:Racer,time:number,dt:number):boolean {
 if(r.armor<=0)return false;
 const gap=r.distance-player.distance,lateral=player.lane-r.lane;
 if(Math.abs(gap)<1600){
  r.speed+=Math.max(-2200*dt,Math.min(2200*dt,player.speed*.94-r.speed));
  const target=player.lane+(lateral>0?-.42:.42);
  r.lane+=Math.max(-.2*dt,Math.min(.2*dt,target-r.lane));
 }
 if(r.strikeAt>0&&time>=r.strikeAt){r.strikeAt=0;return Math.abs(gap)<750&&Math.abs(lateral)<.65&&Math.abs(lateral)>.08&&Math.sign(lateral)===r.strikeSide;}
 if(!r.strikeAt&&time>=r.attackAt&&Math.abs(gap)<900&&Math.abs(lateral)<.75){r.strikeSide=Math.sign(lateral)||1;r.strikeAt=time+.5;r.attackAt=time+2.8;}
 return false;
}
