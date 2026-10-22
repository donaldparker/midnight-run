import Phaser from 'phaser';
import {drawSky} from '../../scenery/sky';
import {frameAt,OUTRO_TIMES} from '../../actors/rider/poses';
export class EndingView {
 private g:Phaser.GameObjects.Graphics;private sprite:Phaser.GameObjects.Image;private title:Phaser.GameObjects.Text;
 constructor(scene:Phaser.Scene){
  this.g=scene.add.graphics().setDepth(100).setVisible(false);
  this.sprite=scene.add.image(240,244,'outro-0').setOrigin(.5,1).setScale(.52).setDepth(101).setVisible(false);
  this.title=scene.add.text(240,14,'MIDNIGHT RUN',{fontFamily:'monospace',fontSize:'15px',fontStyle:'bold',color:'#f2c70d',resolution:2}).setOrigin(.5,0).setDepth(102).setVisible(false);
 }
 hide(){this.g.setVisible(false);this.sprite.setVisible(false);this.title.setVisible(false);}
 draw(age:number){
  const g=this.g;g.setVisible(true).clear();drawSky(g,0,0);
  g.fillStyle(0x353a43).fillRect(0,190,480,80);g.fillStyle(0x62604b).fillRect(0,191,480,2);
  g.fillStyle(0x080d12).fillRect(0,0,480,6).fillRect(0,258,480,12);
  g.fillStyle(0x080d12,.3).fillEllipse(240,244,190,10);
  const frame=frameAt(age,OUTRO_TIMES);
  this.sprite.setVisible(true).setTexture(`outro-${frame}`);
  this.title.setVisible(true).setText(frame<3?'END OF THE ROAD':'MIDNIGHT RUN');
 }
}
