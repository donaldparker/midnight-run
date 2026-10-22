/** kitHeal: armor from a repair kit. koHeal: armor per knockdown. kits: share of roadside drops that are repair kits. */
export interface CombatDifficulty {name:string;armor:number;interval:number;windup:number;steer:number;chase:number;kitHeal:number;koHeal:number;kits:number}
export const DEFAULT_DIFFICULTY=2;
export const DIFFICULTIES:readonly CombatDifficulty[]=[
 {name:'Easy',armor:14,interval:3.6,windup:.8,steer:.24,chase:9500,kitHeal:25,koHeal:4,kits:.24},
 {name:'Casual',armor:21,interval:2.9,windup:.68,steer:.3,chase:9900,kitHeal:18,koHeal:2,kits:.17},
 {name:'Standard',armor:28,interval:2.3,windup:.58,steer:.36,chase:10300,kitHeal:14,koHeal:1,kits:.13},
 {name:'Hard',armor:35,interval:1.8,windup:.5,steer:.42,chase:10700,kitHeal:10,koHeal:0,kits:.09},
 {name:'Outlaw',armor:42,interval:1.4,windup:.42,steer:.48,chase:11000,kitHeal:8,koHeal:0,kits:.06},
];
export function clampDifficulty(value:number):number{return Number.isFinite(value)?Math.max(1,Math.min(5,Math.round(value))):DEFAULT_DIFFICULTY;}
export function combatDifficulty(value:number):CombatDifficulty{return DIFFICULTIES[clampDifficulty(value)-1];}
export function difficultyDescription(value:number):string {
 const d=combatDifficulty(value),punches=Math.ceil(d.armor/7),weapons=Math.ceil(d.armor/14);
 return `${punches} punch${punches===1?'':'es'} or ${weapons} cane/chain hit${weapons===1?'':'s'} · attacks every ${d.interval.toFixed(1)}s · repair kits +${d.kitHeal}`;
}
