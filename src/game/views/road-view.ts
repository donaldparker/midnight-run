import Phaser from 'phaser';
import { SEGMENT,ROAD_WIDTH,type Segment } from '../../levels/build-level';
import { projectGround,type ProjectedPoint } from '../../core/projection';
import { DRAW_DISTANCE,CAMERA_HEIGHT,PLAYER_Z } from '../config';
import { skyTheme } from '../../scenery/sky';
import { sampleRoad,type RoadSample } from '../../core/actor-projection';
export type RoadPoint=RoadSample;
export class RoadView {
 points=new Map<number,RoadPoint>();pan=0;
 constructor(private g:Phaser.GameObjects.Graphics){}
 draw(road:Segment[],distance:number,lane:number,dawn=0){
  const g=this.g;const base=Math.floor(distance/SEGMENT);const pct=distance/SEGMENT-base;
  const a=road[Math.min(base,road.length-1)];
  const at=(distance+PLAYER_Z)/SEGMENT,pi=Math.min(road.length-2,Math.floor(at)),pt=at-Math.floor(at);
  const cameraY=road[pi].y+(road[pi+1].y-road[pi].y)*pt+CAMERA_HEIGHT;
  const t=skyTheme(a.zone,dawn);let x=0,dx=-a.curve*pct,maxY=270;
  this.points.clear();this.pan=distance*.00003+lane*.3;
  for(let n=1;n<DRAW_DISTANCE;n++){
   const i=base+n;if(i>=road.length-1)break;const s=road[i],next=road[i+1];
   let p1=projectGround(x,s.y,i*SEGMENT,lane*ROAD_WIDTH,cameraY,distance,ROAD_WIDTH);
   const p2=projectGround(x+dx,next.y,(i+1)*SEGMENT,lane*ROAD_WIDTH,cameraY,distance,ROAD_WIDTH);
   x+=dx;dx+=s.curve;
   const clip=maxY;
   this.points.set(i,{index:i,p:p1,end:p2,clip});
   if(p2.y>=p1.y||p2.y>=maxY)continue;
   if(p1.y>maxY){const t=(maxY-p2.y)/(p1.y-p2.y);p1={x:p2.x+(p1.x-p2.x)*t,y:maxY,w:p2.w+(p1.w-p2.w)*t,scale:p1.scale};}
   const top=Math.max(0,p2.y),bot=Math.min(270,p1.y);
   if(bot<=top)continue;
   g.fillStyle(Math.floor(i/3)%2?t.light:t.ground).fillRect(0,top,480,bot-top);
   this.quad(p1,p2,1.08,Math.floor(i/3)%2?0xa9a89b:0x464a4f);
   this.quad(p1,p2,1,Math.floor(i/3)%2?t.road:t.road2);
   for(const side of [-1,1])this.strip(p1,p2,side*.96,.012,0xc4c5b1);
   if(Math.floor(i/4)%2===0){this.strip(p1,p2,-.018,.008,0xf2c70d);this.strip(p1,p2,.018,.008,0xf2c70d);}
   if(i>=road.length-12&&i<road.length-9){for(let cell=0;cell<16;cell++)this.strip(p1,p2,-1+(cell+.5)/8,1/16,(cell+i)%2?0x10151c:0xf2f0da);}
   if(i%5===0){for(const side of [-1,1]){this.strip(p1,p2,side*1.17,.015,0x8c98a0,-Math.max(1,p1.w*.045));g.fillStyle(0xe9ae43).fillRect(p1.x+side*p1.w*1.17,Math.max(0,p1.y-p1.w*.07),Math.max(1,p1.w*.012),Math.max(1,p1.w*.025));}}
   maxY=p2.y;
  }
 }
 sample(distance:number){return sampleRoad(this.points,distance);}
 private quad(a:ProjectedPoint,b:ProjectedPoint,w:number,c:number){this.g.fillStyle(c);this.g.fillPoints([{x:a.x-a.w*w,y:a.y},{x:a.x+a.w*w,y:a.y},{x:b.x+b.w*w,y:b.y},{x:b.x-b.w*w,y:b.y}],true);}
 private strip(a:ProjectedPoint,b:ProjectedPoint,offset:number,width:number,c:number,dy=0){this.g.fillStyle(c).fillPoints([{x:a.x+a.w*(offset-width),y:a.y+dy},{x:a.x+a.w*(offset+width),y:a.y+dy},{x:b.x+b.w*(offset+width),y:b.y+dy},{x:b.x+b.w*(offset-width),y:b.y+dy}],true);}
}
