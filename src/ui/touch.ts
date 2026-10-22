export const touchInput=new Set<string>();
const presses:string[]=[];
export function consumeTouchPress(){return presses.splice(0);}
export function clearTouch(){touchInput.clear();presses.length=0;}
export function mountTouchControls(){
 for(const b of document.querySelectorAll<HTMLButtonElement>('[data-hold],[data-attack]')){
   b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);if(b.dataset.hold)touchInput.add(b.dataset.hold);if(b.dataset.attack)presses.push(b.dataset.attack);});
   const release=()=>{if(b.dataset.hold)touchInput.delete(b.dataset.hold);};b.addEventListener('pointerup',release);b.addEventListener('pointercancel',release);b.addEventListener('lostpointercapture',release);
 }
 window.addEventListener('blur',clearTouch);
}
