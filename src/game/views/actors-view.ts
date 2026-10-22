import Phaser from 'phaser';
export interface SpriteItem {texture:string;x:number;y:number;scale:number;clip:number;angle?:number;alpha?:number;flash?:boolean}
/** Pooled sprites, matching Leona's separate model/view pattern. */
export class ActorsView {
 private pool:Phaser.GameObjects.Image[]=[];private used=0;
 constructor(private scene:Phaser.Scene){}
 begin(){this.used=0;}
 draw(item:SpriteItem){
  if(item.scale<=0||(item.alpha??1)<=0||item.x< -200||item.x>680)return;
  const frame=this.scene.textures.getFrame(item.texture);
  const height=frame.height*item.scale,top=item.y-height;
  const visibleHeight=Math.min(height,item.clip-top);
  if(visibleHeight<=0||item.y<0)return;
  const sprite=this.pool[this.used]??(this.pool[this.used]=this.scene.add.image(0,0,item.texture).setOrigin(.5,1));
  sprite.setTexture(item.texture).setCrop(0,0,frame.width,Math.min(frame.height,visibleHeight/item.scale)).setVisible(true)
    .setPosition(item.x,item.y).setScale(item.scale).setAngle(item.angle??0).setDepth(20+item.y*.1).setAlpha(item.alpha??1);
  sprite.clearTint();if(item.flash)sprite.setTintFill(0xffce60);this.used++;
 }
 end(){for(let j=this.used;j<this.pool.length;j++)this.pool[j].setVisible(false);}
}
