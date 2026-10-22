import type { ProjectedPoint } from './projection';
import { SEGMENT } from '../levels/build-level';
export interface RoadSample {index:number;p:ProjectedPoint;end:ProjectedPoint;clip:number}
/** Interpolate in perspective space; segment endpoints alone produce visible 200-unit jumps. */
export function sampleRoad(points:ReadonlyMap<number,RoadSample>,distance:number):RoadSample|undefined {
  const index=Math.floor(distance/SEGMENT),sample=points.get(index);
  if(!sample)return;
  const t=distance/SEGMENT-index,a=sample.p,b=sample.end;
  const u=t*a.scale/((1-t)*b.scale+t*a.scale);
  const lerp=(x:number,y:number)=>x+(y-x)*u;
  return {...sample,p:{x:lerp(a.x,b.x),y:lerp(a.y,b.y),w:lerp(a.w,b.w),scale:lerp(a.scale,b.scale)}};
}
/** The same world-size rider is the same screen size as Ian when riding alongside him. */
export function riderScale(cameraDistance:number,playerZ:number,playerHeight:number,textureHeight:number):number {
  return playerHeight/textureHeight*Math.min(1.25,playerZ/Math.max(1,cameraDistance));
}
export function passingOpacity(gap:number):number {return Math.max(0,Math.min(1,(gap+650)/650));}
