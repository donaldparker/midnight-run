import type { RiderDefinition } from '../riders';
export interface Racer {id:string;distance:number;lane:number;speed:number;armor:number;downUntil:number;attackAt:number}
export function newRacer(id:string,distance=0,lane=.3,speed=0):Racer {return {id,distance,lane,speed,armor:32,downUntil:0,attackAt:0};}
export function stepPlayer(p:Racer,drive:number,steer:number,curve:number,dt:number,rider:RiderDefinition):void {
 const s=rider.stats;const target=drive<0?0:drive>0?s.boostSpeed:s.cruiseSpeed;
 const acceleration=drive<0?s.brakeDeceleration:s.acceleration;
 p.speed+=Math.max(-acceleration*dt,Math.min(acceleration*dt,target-p.speed));
 p.lane+=steer*s.steerSpeed*dt*(.25+.75*p.speed/s.boostSpeed)-curve*.24*(p.speed/s.boostSpeed)**2*dt;
 p.lane=Math.max(-1.6,Math.min(1.6,p.lane));
 if(Math.abs(p.lane)>1.03)p.speed=Math.max(2800,p.speed-6500*dt);
 p.distance+=p.speed*dt;
}
export function rank(player:Racer,rivals:readonly Racer[]):number {return 1+rivals.filter(r=>r.distance>player.distance).length;}
