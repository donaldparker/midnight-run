/** Ways for Ian to recover armor; amounts come from the difficulty setting. */
export type ItemKind='chain'|'health'|'car';
/** Roadside drops: about a third chains, a difficulty-scaled share of repair kits, the rest traffic. */
export function itemKind(roll:number,kitShare:number):ItemKind {return roll<.32?'chain':roll<.32+kitShare?'health':'car';}
export function heal(armor:number,amount:number,max:number):number {return Math.max(0,Math.min(max,armor+Math.max(0,amount)));}
