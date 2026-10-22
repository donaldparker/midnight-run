import type {HeldWeapon,Move} from '../../core/combat';
export const ANIMATION_ART={
 'club-right':'/assets/shillelagh-right-sheet.png','club-left':'/assets/shillelagh-left-sheet.png',
 'chain-right':'/assets/chain-right-sheet.png','chain-left':'/assets/chain-left-sheet.png',
 'punch-right':'/assets/punch-right-sheet.png','punch-left':'/assets/punch-left-sheet.png',
 'kick-right':'/assets/kick-right-sheet.png','kick-left':'/assets/kick-left-sheet.png',
 'outro':'/assets/ian-outro-sheet.png',
} as const;
export const FRAME_TIMES:Record<Move,readonly number[]>={
 punch:[.045,.055,.055,.085,.07,.08],kick:[.06,.07,.08,.12,.09,.10],
 club:[.06,.09,.10,.12,.10,.12],chain:[.08,.10,.12,.12,.14,.14],
};
export const OUTRO_TIMES=[.65,.8,.8,.8,.75,2.1] as const;
export function duration(times:readonly number[]):number{return times.reduce((sum,n)=>sum+n,0);}
export function frameAt(age:number,times:readonly number[]):number {
 let elapsed=0;for(let i=0;i<times.length;i++){elapsed+=times[i];if(age<elapsed)return i;}return times.length-1;
}
export function attackDuration(move:Move){return duration(FRAME_TIMES[move]);}
export function contactAt(move:Move){return FRAME_TIMES[move].slice(0,3).reduce((a,b)=>a+b,0);}
export function animationKey(move:Move,side:number,frame:number){return `anim-${move}-${side<0?'left':'right'}-${frame}`;}
export function riderTexture(held:HeldWeapon,move:Move,age:number,side:number):string {
 if(age>=0&&age<attackDuration(move))return animationKey(move,side,frameAt(age,FRAME_TIMES[move]));
 return held==='chain'?'anim-chain-right-0':'anim-club-right-0';
}
