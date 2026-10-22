import Phaser from 'phaser';
import type {Police} from '../../actors/police/behavior';
/** Emergency lamps share the bike's projection, depth and hill clip. */
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
 }
}
