/** Ways for Ian to recover armor during a long ride. */
export const REPAIR_KIT_HEAL=30;
export const KNOCKDOWN_HEAL=6;
export type ItemKind='chain'|'health'|'car';
/** Roadside drops: roughly a third chains, a quarter repair kits, the rest traffic. */
export function itemKind(roll:number):ItemKind {return roll<.32?'chain':roll<.57?'health':'car';}
export function heal(armor:number,amount:number,max:number):number {return Math.max(0,Math.min(max,armor+Math.max(0,amount)));}
