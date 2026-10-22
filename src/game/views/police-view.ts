import Phaser from 'phaser';
import type {Police} from '../../actors/police/behavior';
/** Emergency lamps and kicking leg share the bike's projection, depth and hill clip. */
export class PoliceView {
 private g:Phaser.GameObjects.Graphics;
 constructor(scene:Phaser.Scene){this.g=scene.add.graphics();}
 draw(cop:Police|null,x=0,y=0,height=0,clip=270,alpha=1){
  const g=this.g;g.clear();if(!cop?.active||!height||alpha<=0)return;
  g.setDepth(20+y*.1+.01).setAlpha(alpha);
  const lampY=y-height*.565,spread=height*.063;
  if(lampY<clip){
   const phase=Math.floor(cop.pursuitAge*8)%2;
   for(const side of [-1,1]){const on=side===(phase?1:-1),color=side<0?0xff352e:0x479eff;
    g.fillStyle(color,on?.23:.04).fillCircle(x+side*spread,lampY,height*.065);
    g.fillStyle(on?color:0x142034).fillRect(x+side*spread-height*.027,lampY-height*.02,height*.054,height*.04);
    if(on)g.fillStyle(0xffffff,.85).fillRect(x+side*spread-height*.015,lampY-height*.006,height*.03,height*.012);
   }
  }
  const windup=cop.kickAt>0,extended=cop.pursuitAge<cop.kickUntil;
  if(!windup&&!extended)return;
  const side=cop.kickSide,hip={x:x+side*height*.13,y:y-height*.54},knee={x:x+side*height*(extended?.32:.22),y:y-height*(extended?.49:.63)},foot={x:x+side*height*(extended?.51:.27),y:y-height*(extended?.51:.54)};
  if(foot.y>clip)return;
  for(const [width,col] of [[.105,0x161b23],[.072,0x8e8266]] as const){g.lineStyle(height*width,col).strokePoints([hip,knee,foot],false);}
  g.lineStyle(height*.065,0x151b23).lineBetween(foot.x,foot.y,foot.x+side*height*.08,foot.y-height*.015);
 }
}
