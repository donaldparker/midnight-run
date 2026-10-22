import type {Racer} from '../../core/race';
export const POLICE_WINDUP=.85;
export const POLICE_RECOVERY=.65;
export interface Police extends Racer {active:boolean;pursuitAge:number;bust:number;flashUntil:number;kickAt:number;kickUntil:number;kickSide:number;attackStarted:number}
export function newPolice(player:Racer,armor=35):Police {
 return {id:'police',distance:player.distance-5000,lane:Math.max(-.8,player.lane-.38),speed:Math.min(8500,player.speed+500),armor,downUntil:0,attackAt:2.2,active:true,pursuitAge:0,bust:0,flashUntil:0,kickAt:0,kickUntil:0,kickSide:1,attackStarted:-10};
}
/** The boot must reach Ian at contact; proximity alone never causes damage. */
export function policeKickConnects(cop:Police,player:Racer):boolean {
 const gap=cop.distance-player.distance,lateral=player.lane-cop.lane;
 return Math.abs(gap)<250&&Math.abs(lateral)>.12&&Math.abs(lateral)<.43&&Math.sign(lateral)===cop.kickSide;
}
export function interruptPolice(cop:Police):void {cop.kickAt=0;cop.kickUntil=0;cop.attackStarted=-10;cop.attackAt=cop.pursuitAge+2;}
export function stepPolice(cop:Police,player:Racer,dt:number,level=1):'pursuing'|'escaped'|'kick' {
 if(!cop.active)return 'escaped';
 cop.pursuitAge+=dt;const gap=cop.distance-player.distance;
 const target=Math.max(1800,Math.min(9100+level*100,player.speed+(80-gap)*.55));
 cop.speed+=Math.max(-4500*dt,Math.min(1800*dt,target-cop.speed));cop.distance+=cop.speed*dt;
 // Commit to the chosen lane throughout windup and recovery, giving Ian a clean dodge.
 if(!cop.kickAt&&cop.pursuitAge>=cop.kickUntil){
  const lane=Math.max(-.8,Math.min(.8,player.lane+(cop.lane<player.lane?-.32:.32)));
  cop.lane+=Math.max(-.32*dt,Math.min(.32*dt,lane-cop.lane));
 }
 const lateral=player.lane-cop.lane;
 if(cop.kickAt>0&&cop.pursuitAge>=cop.kickAt){
  cop.kickAt=0;cop.kickUntil=cop.pursuitAge+POLICE_RECOVERY;cop.attackAt=cop.pursuitAge+Math.max(2.2,3.4-level*.25);
  if(policeKickConnects(cop,player))return 'kick';
 }
 if(!cop.kickAt&&cop.pursuitAge>=cop.kickUntil&&cop.pursuitAge>=cop.attackAt&&Math.abs(cop.distance-player.distance)<400&&Math.abs(lateral)>.12&&Math.abs(lateral)<.55){
  cop.kickSide=Math.sign(lateral);cop.attackStarted=cop.pursuitAge;cop.kickAt=cop.pursuitAge+POLICE_WINDUP;
 }
 if(gap< -10000&&cop.pursuitAge>4){cop.active=false;return 'escaped';}
 return 'pursuing';
}

export const POLICE_HITS_TO_BUST=5;
export interface PoliceFight {hits:number}
export function newPoliceFight():PoliceFight{return {hits:0};}
/** Only a landed, unblocked hit counts. Keep the first four hits nonlethal. */
export function policeHitDamage(armor:number):number{return Math.max(0,Math.min(6,armor-1));}
export function registerPoliceHit(fight:PoliceFight,landed:boolean):boolean {
 if(!landed)return false;
 fight.hits=Math.min(POLICE_HITS_TO_BUST,fight.hits+1);
 return fight.hits>=POLICE_HITS_TO_BUST;
}
