export type Move='punch'|'kick'|'club'|'chain';
export type HeldWeapon='club'|'chain';
export const MOVES:Record<Move,{damage:number;reach:number;cooldown:number;knock:number}>={
 punch:{damage:7,reach:750,cooldown:.43,knock:90},
 kick:{damage:13,reach:1000,cooldown:.64,knock:450},
 club:{damage:14,reach:1150,cooldown:.70,knock:250},
 chain:{damage:14,reach:1650,cooldown:.86,knock:180},
};
export function strike(move:Move,gap:number,lateral:number,facing:number):boolean {
 return Math.abs(gap)<MOVES[move].reach&&Math.abs(lateral)<.76&&Math.abs(lateral)>.06&&(facing===0||Math.sign(lateral)===facing);
}
export function crossed(before:number,after:number,target:number,padding=0):boolean{return before<=target+padding&&after>=target-padding;}
export function weaponAfterAttack(held:HeldWeapon,move:Move,charges:{chain:number}):HeldWeapon {
 if(move==='punch'||move==='kick')return held;
 return move==='chain'&&charges.chain>=1?'chain':'club';
}
export function gearAttack(held:HeldWeapon,charges:{chain:number}):HeldWeapon {return held==='chain'&&charges.chain>=1?'chain':charges.chain>=1?'chain':'club';}
export interface TargetSpot {distance:number;lane:number}
/** Pick an enemy before choosing the hand; steering is only a fallback with no nearby opponent. */
export function attackSide(player:TargetSpot,targets:readonly TargetSpot[],move:Move,fallback=1):number {
 const near=targets.filter(t=>Math.abs(t.distance-player.distance)<MOVES[move].reach+600&&Math.abs(t.lane-player.lane)<1.1)
  .sort((a,b)=>Math.abs(a.distance-player.distance)-Math.abs(b.distance-player.distance));
 return (near.length?Math.sign(near[0].lane-player.lane):0)||Math.sign(fallback)||1;
}
