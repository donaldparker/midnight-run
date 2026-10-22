import {afterEach,it,expect,vi} from 'vitest';
import {portraitGame,mountLandscapeGuard,prepareLandscape} from '../src/ui/orientation';
afterEach(()=>vi.unstubAllGlobals());
it('requires landscape on iPhone and Pixel portrait viewports',()=>{expect(portraitGame(393,852)).toBe(true);expect(portraitGame(448,998)).toBe(true);expect(portraitGame(852,393)).toBe(false);expect(portraitGame(998,448)).toBe(false);expect(portraitGame(1280,900)).toBe(false);});
it('pauses once on entering portrait and again after a later rotation',()=>{
 const win=Object.assign(new EventTarget(),{innerWidth:852,innerHeight:393}),doc=new EventTarget(),pause=vi.fn();vi.stubGlobal('window',win);vi.stubGlobal('document',doc);
 const cleanup=mountLandscapeGuard(pause);expect(pause).not.toHaveBeenCalled();
 win.innerWidth=393;win.innerHeight=852;win.dispatchEvent(new Event('resize'));win.dispatchEvent(new Event('orientationchange'));expect(pause).toHaveBeenCalledTimes(1);
 win.innerWidth=852;win.innerHeight=393;win.dispatchEvent(new Event('resize'));win.innerWidth=393;win.innerHeight=852;doc.dispatchEvent(new Event('fullscreenchange'));expect(pause).toHaveBeenCalledTimes(2);
 cleanup();win.dispatchEvent(new Event('resize'));expect(pause).toHaveBeenCalledTimes(2);
});
it('keeps the rotate fallback usable when fullscreen is rejected',async()=>{
 vi.stubGlobal('matchMedia',()=>({matches:true}));vi.stubGlobal('document',{fullscreenElement:null});const lock=vi.fn();vi.stubGlobal('screen',{orientation:{lock}});
 await expect(prepareLandscape({requestFullscreen:()=>Promise.reject(new Error('unsupported'))} as HTMLElement)).resolves.toBeUndefined();expect(lock).not.toHaveBeenCalled();
});
