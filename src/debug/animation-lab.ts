import type {MidnightScene} from '../game/midnight-scene';
import type {Move} from '../core/combat';
export function mountAnimationLab(scene:MidnightScene,stage:HTMLElement,start:()=>void){
 const bar=document.createElement('div');bar.style.cssText='position:absolute;z-index:150;top:8%;left:10%;display:flex;gap:3px;flex-wrap:wrap;max-width:80%;';
 const add=(label:string,fn:()=>void)=>{const b=document.createElement('button');b.textContent=label;b.style.cssText='font:12px monospace;padding:5px;color:#f2c70d;background:#101820;border:1px solid #f2c70d;';b.onclick=()=>{if(scene.status!=='riding')start();fn();};bar.append(b);};
 for(const move of ['punch','kick','club','chain'] as Move[])for(const side of [-1,1])add(`${move} ${side<0?'L':'R'}`,()=>scene.previewAction(move,side));
 add('Police',()=>{bar.remove();scene.previewPolice();});add('Finish line',()=>{bar.remove();scene.previewFinishLine();});add('Traffic',()=>scene.previewTraffic());add('Finish',()=>{bar.remove();scene.previewEnding();});stage.append(bar);
}
