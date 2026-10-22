export interface Wanted {heat:number;quiet:number}
export const newWanted=():Wanted=>({heat:0,quiet:0});
export function wantedLevel(w:Wanted):number{return w.heat<=0?0:Math.min(5,Math.ceil(w.heat/28));}
export function addWanted(w:Wanted,damage:number,police=false):void {w.heat=Math.min(140,w.heat+Math.max(0,damage)*(police?2:1));w.quiet=0;}
export function coolWanted(w:Wanted,dt:number,pursued:boolean):void {if(pursued){w.quiet=0;return;}w.quiet+=dt;if(w.quiet>10)w.heat=Math.max(0,w.heat-dt*3);}
export function pursuitDelay(level:number):number{return Math.max(5,19-level*3);}
