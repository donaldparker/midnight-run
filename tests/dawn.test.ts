import {it,expect} from 'vitest';
import {dawnAt,dawnPalette,mixColor} from '../src/core/dawn';
const bright=(c:number)=>(c>>16&255)+(c>>8&255)+(c&255);
it('starts at midnight and reaches dawn only at the finish',()=>{expect(dawnAt(0)).toBe(0);expect(dawnAt(.3)).toBe(0);expect(dawnAt(1)).toBe(1);for(let p=.3;p<1;p+=.05)expect(dawnAt(p+.05)).toBeGreaterThanOrEqual(dawnAt(p));});
it('brightens the sky steadily without jumping',()=>{const night={sky:0x101e3c,haze:0x4e6280,far:0x273c5b,near:0x172d3e,ground:0x27382e,light:0x314335,road:0x505568,road2:0x555b6c};let last=bright(night.sky);for(let p=0;p<=1.001;p+=.02){const c=bright(dawnPalette(night,dawnAt(p)).sky);expect(c).toBeGreaterThanOrEqual(last);expect(c-last).toBeLessThan(25);last=c;}expect(dawnPalette(night,0)).toEqual(night);});
it('mixes colors per channel',()=>{expect(mixColor(0x000000,0xffffff,.5)).toBe(0x808080);expect(mixColor(0x102030,0x102030,.7)).toBe(0x102030);});
