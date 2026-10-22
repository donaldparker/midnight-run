/** Midnight at the start line, first light by the finish. Pure color math so it stays testable. */
export interface Palette {sky:number;haze:number;far:number;near:number;ground:number;light:number;road:number;road2:number}
export const DAWN:Palette={sky:0x56709e,haze:0xf3a46e,far:0x6c6383,near:0x4a465a,ground:0x4c5a44,light:0x58684d,road:0x676a77,road2:0x6f717d};
/** Stays dark for the first third of the ride, then brightens slowly toward dawn. */
export function dawnAt(progress:number):number {
 const t=Math.max(0,Math.min(1,(progress-.3)/.7));
 return t*t*(3-2*t);
}
export function mixColor(a:number,b:number,t:number):number {
 const k=Math.max(0,Math.min(1,t));let out=0;
 for(const shift of [16,8,0]){const ca=a>>shift&255,cb=b>>shift&255;out|=Math.round(ca+(cb-ca)*k)<<shift;}
 return out;
}
export function dawnPalette<T extends Palette>(night:T,dawn:number):T {
 const out={...night};
 for(const key of Object.keys(DAWN) as (keyof Palette)[]){
  // Sky and horizon glow change most; the land lags behind like real first light.
  const weight=key==='sky'||key==='haze'?1:key==='far'?.85:.7;
  (out as Palette)[key]=mixColor(night[key],DAWN[key],dawn*weight);
 }
 return out;
}
