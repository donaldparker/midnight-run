import Phaser from 'phaser';
import {dawnPalette,mixColor} from '../core/dawn';
export const THEMES=[
 {name:'PINE RIDGE',sky:0x101e3c,haze:0x4e6280,far:0x273c5b,near:0x172d3e,ground:0x27382e,light:0x314335,road:0x505568,road2:0x555b6c},
 {name:'DEVIL’S PASS',sky:0x161230,haze:0x4a3a66,far:0x352a4a,near:0x241c34,ground:0x3a2f2c,light:0x463830,road:0x4c4a58,road2:0x54515f},
 {name:'COAST HIGHWAY',sky:0x101c3c,haze:0x3d617c,far:0x293956,near:0x18283e,ground:0x273e38,light:0x304a3c,road:0x4d5363,road2:0x555b6b}
];
export function skyTheme(zone:number,dawn:number){return dawnPalette(THEMES[zone],dawn);}
export function drawSky(g:Phaser.GameObjects.Graphics,zone:number,pan:number,dawn=0){
 const t=skyTheme(zone,dawn);g.fillStyle(t.sky).fillRect(0,0,480,270);
 // Upper sky stays deeper than the horizon as light comes up.
 g.fillStyle(mixColor(t.sky,0x0a1028,.55*(1-dawn*.4))).fillRect(0,0,480,30);g.fillStyle(mixColor(t.sky,0x0a1028,.3*(1-dawn*.4))).fillRect(0,30,480,25);
 g.fillStyle(t.haze,.25).fillRect(0,55,480,90);g.fillStyle(t.haze,.45).fillRect(0,90,480,50);g.fillStyle(t.haze,.65).fillRect(0,115,480,38);
 {const stars=Math.max(0,1-dawn*1.5);if(stars>0){g.fillStyle(0x96b3c8,stars);for(let i=0;i<35;i++)g.fillRect((i*97+21)%480,(i*29+5)%65,1,1);}}
 // The moon sinks and pales; the sun's glow rises on the far side of the horizon.
 const moonY=Math.round(40+dawn*55),moon=1-dawn*.75;
 if(dawn>.45){const sun=(dawn-.45)/.55;g.fillStyle(0xffb46a,.18*sun).fillCircle(110,125,70);g.fillStyle(0xffd08a,.3*sun).fillCircle(110,125,34);g.fillStyle(0xffe6b0,.9*sun).fillCircle(110,133-sun*14,9);}
 g.fillStyle(0xf4e9c0,moon).fillRect(365,moonY,13,17).fillRect(363,moonY+3,17,11);g.fillStyle(0xc5c6a3,moon).fillRect(367,moonY+3,3,4).fillRect(373,moonY+9,4,3);
 for(let layer=0;layer<2;layer++){
  const pts:number[]=[-5,170];const offset=pan*(layer?13:5);
  for(let x=-5;x<=485;x+=4){const sx=x+offset;const h=Math.sin(sx*.012+layer*2)*16+Math.sin(sx*.033+layer)*10+Math.sin(sx*.071)*4;pts.push(x,Math.round(100+layer*14+h));}pts.push(485,180);
  g.fillStyle(layer?t.near:t.far).fillPoints(Array.from({length:pts.length/2},(_,i)=>({x:pts[i*2],y:pts[i*2+1]})),true);
 }
 if(zone===2){g.fillStyle(mixColor(0x23445c,0x5d7c9a,dawn*.8)).fillRect(280,140,200,65);g.fillStyle(0x7194a5);for(let i=0;i<10;i++)g.fillRect(340-i*5,145+i*5,13+i*9,1);}
}
