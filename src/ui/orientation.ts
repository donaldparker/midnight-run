/** Browsers without native orientation lock enforce landscape with the rotate screen. */
export function portraitGame(width:number,height:number):boolean{return width<=950&&height>width;}
export function mountLandscapeGuard(onPortrait:()=>void):()=>void {
 let wasPortrait=false;
 const check=()=>{const portrait=portraitGame(window.innerWidth,window.innerHeight);if(portrait&&!wasPortrait)onPortrait();wasPortrait=portrait;};
 window.addEventListener('resize',check);window.addEventListener('orientationchange',check);document.addEventListener('fullscreenchange',check);check();
 return ()=>{window.removeEventListener('resize',check);window.removeEventListener('orientationchange',check);document.removeEventListener('fullscreenchange',check);};
}
export async function prepareLandscape(stage:HTMLElement):Promise<void> {
 if(!matchMedia('(any-pointer:coarse)').matches)return;
 try {
  if(!document.fullscreenElement&&stage.requestFullscreen)await stage.requestFullscreen();
  const orientation=screen.orientation as ScreenOrientation&{lock?:(mode:string)=>Promise<void>};
  if(orientation?.lock)await orientation.lock('landscape');
 }catch { /* The rotate screen remains until the phone is physically in landscape. */ }
}
