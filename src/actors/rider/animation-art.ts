import Phaser from 'phaser';
import {ANIMATION_ART} from './poses';
import {splitSpriteRow,type IsolatedSprite} from './atlas';
export function bakeAnimationArt(scene:Phaser.Scene){
 for(const name of Object.keys(ANIMATION_ART)){
  const sourceKey=`sheet-${name}`;if(!scene.textures.exists(sourceKey))continue;
  const image=scene.textures.get(sourceKey).getSourceImage() as HTMLImageElement;
  const row=document.createElement('canvas');row.width=image.width;row.height=Math.floor(image.height/2);const rc=row.getContext('2d')!;
  const frames:IsolatedSprite[]=[];
  if(name==='outro'){
   const cw=Math.floor(image.width/3),ch=Math.floor(image.height/2);
   for(let f=0;f<6;f++){
    const cv=document.createElement('canvas');cv.width=cw;cv.height=ch;const c=cv.getContext('2d')!;
    c.drawImage(image,f%3*cw,Math.floor(f/3)*ch,cw,ch,0,0,cw,ch);const d=c.getImageData(0,0,cw,ch).data;
    let top=ch,bottom=0;for(let y=0;y<ch;y++)for(let x=0;x<cw;x++)if(d[(y*cw+x)*4+3]>25){top=Math.min(top,y);bottom=Math.max(bottom,y);}
    frames.push({pixels:d,bounds:{left:0,right:cw-1,top,bottom,wheelX:cw/2}});
   }
   const first=frames[0].bounds,scale=320/Math.max(1,first.bottom-first.top+1);
   for(let f=0;f<6;f++){const cv=document.createElement('canvas');cv.width=512;cv.height=512;const c=cv.getContext('2d')!;c.imageSmoothingQuality='high';c.drawImage(image,f%3*cw,Math.floor(f/3)*ch,cw,ch,256-first.wheelX*scale,512-(first.bottom+1)*scale,cw*scale,ch*scale);scene.textures.addCanvas(`outro-${f}`,cv);}
  }else{
   for(let r=0;r<2;r++){rc.clearRect(0,0,row.width,row.height);rc.drawImage(image,0,r*row.height,row.width,row.height,0,0,row.width,row.height);frames.push(...splitSpriteRow(rc.getImageData(0,0,row.width,row.height).data,row.width,row.height));}
   if(frames.length!==6)throw new Error(`Animation ${name} needs six separate rider silhouettes`);
   const first=frames[0].bounds,scale=320/Math.max(1,first.bottom-first.top+1);
   for(let f=0;f<6;f++){
    const b=frames[f].bounds,raw=document.createElement('canvas');raw.width=row.width;raw.height=row.height;raw.getContext('2d')!.putImageData(new ImageData(new Uint8ClampedArray(frames[f].pixels),row.width,row.height),0,0);
    const cv=document.createElement('canvas');cv.width=640;cv.height=448;const c=cv.getContext('2d')!;c.imageSmoothingQuality='high';c.drawImage(raw,320-b.wheelX*scale,448-(b.bottom+1)*scale,row.width*scale,row.height*scale);
    scene.textures.addCanvas(`anim-${name}-${f}`,cv);
   }
  }
  scene.textures.remove(sourceKey);
 }
}
