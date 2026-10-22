import type {Fighter} from './behavior';
import {frameAt} from '../rider/poses';
export function rivalTexture(r:Fighter,palette:string,time:number):string {
 const windup=r.strikeWindup??.65;
 if(r.armor<=0||r.strikeStarted===undefined||time-r.strikeStarted>=windup+.35||time<r.strikeStarted)return palette;
 const frame=frameAt(time-r.strikeStarted,[windup*.18,windup*.36,windup*.46,.14,.12,.09]);
 return `rival-anim-${palette}-${r.strikeMove??'punch'}-${r.strikeSide<0?'left':'right'}-${frame}`;
}
