import {combatDifficulty,type CombatDifficulty} from '../../core/difficulty';
import type {Racer} from '../../core/race';
export interface Fighter extends Racer {strikeAt:number;strikeSide:number;strikeStarted?:number;strikeUntil?:number;strikeMove?:'punch'|'kick';strikeWindup?:number}
export const RIVAL_ARMOR=14;
export function interruptRival(r:Fighter,time:number):void {r.strikeAt=0;r.strikeStarted=undefined;r.strikeUntil=0;r.attackAt=time+1.8;}
/** Nearby bikers spar alongside Ian; windup locks their lane so attacks can be dodged. */
export function rivalFight(r:Fighter,player:Racer,time:number,dt:number,difficulty:CombatDifficulty=combatDifficulty(3)):boolean {
 if(r.armor<=0)return false;
 const gap=r.distance-player.distance,lateral=player.lane-r.lane;
 if(Math.abs(gap)<6500){
  // Close to a visible alongside position; matching speed at a large gap leaves riders passive.
  const correction=Math.max(-2200,Math.min(1200,(80-gap)*.8));
  const targetSpeed=Math.max(1800,Math.min(difficulty.chase,player.speed+correction));
  r.speed+=Math.max(-2800*dt,Math.min(2800*dt,targetSpeed-r.speed));
  if(!r.strikeAt&&time>=(r.strikeUntil??0)){
   const target=player.lane+(lateral>0?-.32:.32);
   r.lane+=Math.max(-difficulty.steer*dt,Math.min(difficulty.steer*dt,target-r.lane));
  }
 }
 if(r.strikeAt>0&&time>=r.strikeAt){r.strikeAt=0;r.strikeUntil=time+.35;return Math.abs(gap)<250&&Math.abs(lateral)<.43&&Math.abs(lateral)>.12&&Math.sign(lateral)===r.strikeSide;}
 const contactGap=gap+(r.speed-player.speed)*difficulty.windup;
 if(!r.strikeAt&&time>=(r.strikeUntil??0)&&time>=r.attackAt&&Math.abs(contactGap)<100&&Math.abs(gap)<2000&&Math.abs(lateral)>.12&&Math.abs(lateral)<.6){
  r.strikeSide=Math.sign(lateral);r.strikeMove=r.strikeMove==='punch'?'kick':'punch';r.strikeStarted=time;r.strikeWindup=difficulty.windup;r.strikeAt=time+difficulty.windup;r.attackAt=time+difficulty.interval;
 }
 return false;
}
