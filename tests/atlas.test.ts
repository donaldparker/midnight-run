import {it,expect} from 'vitest';
import {splitSpriteRow} from '../src/actors/rider/atlas';
it('keeps a weapon extending across a nominal cell boundary attached to its rider',()=>{
 const width=60,height=20,data=new Uint8ClampedArray(width*height*4);
 const rect=(l:number,t:number,r:number,b:number)=>{for(let y=t;y<=b;y++)for(let x=l;x<=r;x++)data[(y*width+x)*4+3]=255;};
 rect(5,7,14,18);rect(26,7,35,18);rect(47,7,56,18);rect(13,5,23,8);
 const sprites=splitSpriteRow(data,width,height);expect(sprites).toHaveLength(3);expect(sprites[0].bounds.right).toBe(23);expect(sprites[1].bounds.left).toBe(26);expect(sprites[2].bounds.left).toBe(47);expect(sprites[0].bounds.wheelX).toBeCloseTo(9.5);
});
