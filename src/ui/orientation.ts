/** Native lock where available; the CSS-rotated landscape layout is the universal fallback. */
export async function prepareLandscape(stage:HTMLElement):Promise<void> {
  if(!matchMedia('(any-pointer:coarse)').matches)return;
  try {
    if(!document.fullscreenElement&&stage.requestFullscreen)await stage.requestFullscreen();
    const orientation=screen.orientation as ScreenOrientation&{lock?:(mode:string)=>Promise<void>};
    if(orientation?.lock)await orientation.lock('landscape');
  } catch { /* Safari and embedded browsers still get the landscape CSS layout. */ }
}
