export interface SpriteBounds {left:number;top:number;right:number;bottom:number;wheelX:number}
export interface IsolatedSprite {pixels:Uint8ClampedArray;bounds:SpriteBounds}
/** Find connected silhouettes instead of chopping off a cane that crosses a nominal grid line. */
export function splitSpriteRow(data:Uint8ClampedArray,width:number,height:number):IsolatedSprite[]{
 const labels=new Int32Array(width*height);labels.fill(-1);
 const regions:Array<{area:number;left:number;right:number;top:number;bottom:number;id:number}>=[];
 const queue=new Int32Array(width*height);
 for(let start=0;start<labels.length;start++){
  if(labels[start]>=0||data[start*4+3]<25)continue;
  const region={area:0,left:width,right:0,top:height,bottom:0,id:regions.length};
  let head=0,tail=1;queue[0]=start;labels[start]=region.id;
  while(head<tail){const p=queue[head++],x=p%width,y=Math.floor(p/width);region.area++;region.left=Math.min(region.left,x);region.right=Math.max(region.right,x);region.top=Math.min(region.top,y);region.bottom=Math.max(region.bottom,y);
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx<0||nx>=width||ny<0||ny>=height)continue;const n=ny*width+nx;if(labels[n]<0&&data[n*4+3]>=25){labels[n]=region.id;queue[tail++]=n;}}
  }
  regions.push(region);
 }
 const main=[...regions].sort((a,b)=>b.area-a.area).slice(0,3).sort((a,b)=>a.left-b.left);
 const assignment=new Map<number,number>();
 for(const r of regions){const own=main.findIndex(m=>m.id===r.id);if(own>=0){assignment.set(r.id,own);continue;}let best=0,score=Infinity;for(let i=0;i<main.length;i++){const m=main[i],dx=Math.max(0,m.left-r.right,r.left-m.right),dy=Math.max(0,m.top-r.bottom,r.top-m.bottom),distance=dx*dx+dy*dy;if(distance<score){score=distance;best=i;}}assignment.set(r.id,best);}
 return main.map((m,i)=>{
  const pixels=new Uint8ClampedArray(data.length);let left=width,right=0,top=height,bottom=0,sum=0,count=0;
  for(let p=0;p<labels.length;p++)if(labels[p]>=0&&assignment.get(labels[p])===i){pixels.set(data.subarray(p*4,p*4+4),p*4);const x=p%width,y=Math.floor(p/width);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
  for(let y=Math.floor(m.bottom-(m.bottom-m.top)*.06);y<=m.bottom;y++)for(let x=m.left;x<=m.right;x++)if(labels[y*width+x]===m.id){sum+=x;count++;}
  return {pixels,bounds:{left,right,top,bottom,wheelX:count?sum/count:(m.left+m.right)/2}};
 });
}
