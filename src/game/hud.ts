import Phaser from 'phaser';
export interface HudState {speed:number;rank:number;checkpoint:number;armor:number;combo:number;score:number;weapon:string;charges:number;progress:number;seed:string;zone:string;time:number;message:string;wanted:number;police:{gap:number;bust:number;hits:number}|null}
export class Hud {
 private texts:Phaser.GameObjects.Text[]=[];private g:Phaser.GameObjects.Graphics;
 constructor(scene:Phaser.Scene,private onUpdate?:(s:HudState)=>void){this.g=scene.add.graphics().setDepth(90);for(let i=0;i<14;i++)this.texts.push(scene.add.text(0,0,'',{fontFamily:'monospace',fontSize:'9px',fontStyle:'bold',color:'#f2c70d',resolution:2}).setDepth(91));}
 update(s:HudState){this.onUpdate?.(s);const g=this.g;g.clear();const portrait=matchMedia('(max-width:700px) and (orientation:portrait)').matches&&!matchMedia('(any-pointer:coarse)').matches;for(const text of this.texts)text.setVisible(!portrait);if(portrait)return;g.fillStyle(0x080d12,.94).fillRect(0,0,480,29).fillRect(0,244,480,26);g.fillStyle(0xf2c70d).fillRect(0,29,480,1).fillRect(0,243,480,1);g.fillStyle(0x080d12,.8).fillRect(9,37,98,16);
 const label=(i:number,x:number,y:number,text:string,size=9,col='#f2c70d')=>this.texts[i].setPosition(x,y).setFontSize(size).setColor(col).setText(text);
 label(0,10,5,'MIDNIGHT RUN',12);label(1,10,18,`${s.zone}  /  ${s.checkpoint}/8`,7,'#b1b6a1');label(2,383,5,`${s.rank} / 8`,13);label(3,383,19,`${Math.floor(s.time/60)}:${(s.time%60).toFixed(1).padStart(4,'0')}`,7,'#c1c4b3');
 label(4,11,38,`${Math.round(s.speed/100)} MPH`,12);label(5,10,251,'ARMOR',7);for(let j=0;j<10;j++)g.fillStyle(j<s.armor/10?0xf2c70d:0x343a35).fillRect(43+j*6,251,4,10);
 label(6,118,250,s.weapon.toUpperCase(),8);label(7,118,260,s.charges?`${Math.ceil(s.charges)} CHARGES`:'ALWAYS READY',6,'#969d8d');label(8,252,251,`${s.score.toString().padStart(5,'0')} PTS`,9);
 label(9,368,251,`ROAD ${s.seed.slice(0,10)}`,7,'#b1b6a1');label(10,175,44,s.message,9,'#fff1b5');label(11,199,201,s.combo>=2?`${s.combo}x COMBO`:'',13);
 label(13,165,20,s.wanted?'WANTED '+Array.from({length:5},(_,i)=>i<s.wanted?'★':'☆').join(''):'WANTED  —',8,s.wanted?'#f2c70d':'#68737e');
 label(12,175,58,s.police?`POLICE ${s.police.gap>0?'AHEAD':'BEHIND'} · ${Math.round(Math.abs(s.police.gap)/100)}m · HITS ${s.police.hits}/5`:'',8,'#ffb45b');
 g.fillStyle(0x394031).fillRect(165,13,183,3);g.fillStyle(0xf2c70d).fillRect(165,13,183*s.progress,3);
 }
}
