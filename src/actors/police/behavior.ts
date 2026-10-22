import type {Racer} from '../../core/race';
export interface Police extends Racer {active:boolean;pursuitAge:number;bust:number;flashUntil:number;kickAt:number;kickUntil:number;kickSide:number}
export function newPolice(player:Racer):Police {
 return {id:'police',distance:player.distance-3500,lane:Math.max(-.8,player.lane-.38),speed:10100,armor:28,downUntil:0,attackAt:1.2,active:true,pursuitAge:0,bust:0,flashUntil:0,kickAt:0,kickUntil:0,kickSide:1};
}
export function stepPolice(cop:Police,player:Racer,dt:number,level=1):'pursuing'|'escaped'|'kick' {
 if(!cop.active)return 'escaped';
 cop.pursuitAge+=dt;const gap=cop.distance-player.distance;
 const target=Math.max(1800,Math.min(9900+level*90,player.speed+(-100-gap)*.9));
 cop.speed+=Math.max(-8000*dt,Math.min(3200*dt,target-cop.speed));cop.distance+=cop.speed*dt;
 const lane=Math.max(-.8,Math.min(.8,player.lane+(cop.lane<player.lane?-.32:.32)));
 cop.lane+=Math.max(-.45*dt,Math.min(.45*dt,lane-cop.lane));
 const beside=Math.abs(cop.distance-player.distance)<650&&Math.abs(cop.lane-player.lane)<.55;
 cop.bust=beside&&player.speed<9500?cop.bust+dt:Math.max(0,cop.bust-dt*2);
 if(cop.kickAt>0&&cop.pursuitAge>=cop.kickAt){cop.kickAt=0;cop.kickUntil=cop.pursuitAge+.28;cop.attackAt=cop.pursuitAge+Math.max(1.8,3-level*.2);if(beside&&Math.sign(player.lane-cop.lane)===cop.kickSide)return 'kick';}
 if(!cop.kickAt&&beside&&cop.pursuitAge>=cop.attackAt){cop.kickSide=Math.sign(player.lane-cop.lane)||1;cop.kickAt=cop.pursuitAge+.65;}
 if(gap< -12000&&cop.pursuitAge>4){cop.active=false;return 'escaped';}
 return 'pursuing';
}
