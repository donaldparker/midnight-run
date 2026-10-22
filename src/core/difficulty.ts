export interface CombatDifficulty {name:string;armor:number;interval:number;windup:number;steer:number;chase:number}
export const DEFAULT_DIFFICULTY=2;
export const DIFFICULTIES:readonly CombatDifficulty[]=[
 {name:'Easy',armor:7,interval:4.5,windup:.95,steer:.18,chase:9200},
 {name:'Casual',armor:14,interval:3.7,windup:.8,steer:.23,chase:9500},
 {name:'Standard',armor:21,interval:3,windup:.65,steer:.28,chase:9800},
 {name:'Hard',armor:28,interval:2.4,windup:.55,steer:.34,chase:10100},
 {name:'Outlaw',armor:35,interval:1.8,windup:.45,steer:.4,chase:10400},
];
export function clampDifficulty(value:number):number{return Number.isFinite(value)?Math.max(1,Math.min(5,Math.round(value))):DEFAULT_DIFFICULTY;}
export function combatDifficulty(value:number):CombatDifficulty{return DIFFICULTIES[clampDifficulty(value)-1];}
export function difficultyDescription(value:number):string {
 const d=combatDifficulty(value),punches=Math.ceil(d.armor/7),weapons=Math.ceil(d.armor/14);
 return `${punches} punch${punches===1?'':'es'} or ${weapons} cane/chain hit${weapons===1?'':'s'} · attacks every ${d.interval.toFixed(1)}s`;
}
