import Phaser from 'phaser';
import type {Move} from '../../core/combat';
import {attackDuration,contactAt} from '../../actors/rider/poses';
/** Full sprite frames carry the motion; these are short contact accents only. */
export class WeaponView {
 private graphics:Phaser.GameObjects.Graphics;
 constructor(scene:Phaser.Scene){this.graphics=scene.add.graphics().setDepth(72);}
 draw({move,side,age}:{move:Move;side:number;age:number}){
  const g=this.graphics;g.clear();
  if(age<contactAt(move)||age>attackDuration(move))return;
  const fade=1-(age-contactAt(move))/(attackDuration(move)-contactAt(move));
  if(move==='chain'||move==='club'){
   g.lineStyle(1,move==='chain'?0xd1dce7:0xd2ab6e,fade*.35);
   g.strokePoints(Array.from({length:7},(_,i)=>({x:240+side*(24+i*4),y:move==='chain'?157+Math.sin(i*.4)*9:177+i*.6})),false);
  }
 }
}
