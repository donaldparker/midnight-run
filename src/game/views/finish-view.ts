import Phaser from 'phaser';
import type {RoadSample} from '../../core/actor-projection';
export class FinishView {
 private g:Phaser.GameObjects.Graphics;private text:Phaser.GameObjects.Text;
 constructor(scene:Phaser.Scene){this.g=scene.add.graphics();this.text=scene.add.text(0,0,'FINISH',{fontFamily:'monospace',fontSize:'12px',fontStyle:'bold',color:'#f2c70d',resolution:2}).setOrigin(.5);}
 draw(point:RoadSample|null|undefined){
  const g=this.g;g.clear();this.text.setVisible(false);if(!point)return;
  const {p,clip}=point;if(p.y>clip+1||p.w<3)return;
  const h=p.w*.55,top=p.y-h,thickness=Math.max(1,p.w*.025);g.setDepth(20+p.y*.1);
  g.lineStyle(thickness,0xf2c70d).lineBetween(p.x-p.w*1.07,p.y,p.x-p.w*1.07,top).lineBetween(p.x+p.w*1.07,p.y,p.x+p.w*1.07,top);
  g.fillStyle(0x090f17).fillRect(p.x-p.w*1.09,top-p.w*.09,p.w*2.18,p.w*.18);
  for(let i=0;i<20;i++)g.fillStyle(i%2?0x10151c:0xeae8d9).fillRect(p.x-p.w+i*p.w*.1,top+p.w*.09,p.w*.1,p.w*.035);
  this.text.setVisible(true).setPosition(p.x,top).setScale(p.w/125).setDepth(20+p.y*.1+.01);
 }
}
