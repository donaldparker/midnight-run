import Phaser from 'phaser';
export const THEMES=[
 {name:'PINE RIDGE',sky:0x101e3c,haze:0x4e6280,far:0x273c5b,near:0x172d3e,ground:0x27382e,light:0x314335,road:0x505568,road2:0x555b6c},
 {name:'DEVIL’S PASS',sky:0x493254,haze:0xe0a264,far:0x9a655f,near:0x684854,ground:0x956b50,light:0xa47754,road:0x55535f,road2:0x5d5964},
 {name:'COAST HIGHWAY',sky:0x101c3c,haze:0x3d617c,far:0x293956,near:0x18283e,ground:0x273e38,light:0x304a3c,road:0x4d5363,road2:0x555b6b}
];
export function drawSky(g:Phaser.GameObjects.Graphics,zone:number,pan:number){
 const t=THEMES[zone];g.fillStyle(t.sky).fillRect(0,0,480,270);
 g.fillStyle(t.haze,.25).fillRect(0,55,480,90);g.fillStyle(t.haze,.45).fillRect(0,90,480,50);g.fillStyle(t.haze,.65).fillRect(0,115,480,38);
 if(zone!==1){g.fillStyle(0x96b3c8);for(let i=0;i<35;i++)g.fillRect((i*97+21)%480,(i*29+5)%65,1,1);}
 g.fillStyle(zone===1?0xffd589:0xf4e9c0).fillRect(365,40,13,17).fillRect(363,43,17,11);g.fillStyle(zone===1?0xffc87c:0xc5c6a3).fillRect(367,43,3,4).fillRect(373,49,4,3);
 for(let layer=0;layer<2;layer++){
  const pts:number[]=[-5,170];const offset=pan*(layer?13:5);
  for(let x=-5;x<=485;x+=4){const sx=x+offset;const h=Math.sin(sx*.012+layer*2)*16+Math.sin(sx*.033+layer)*10+Math.sin(sx*.071)*4;pts.push(x,Math.round(100+layer*14+h));}pts.push(485,180);
  g.fillStyle(layer?t.near:t.far).fillPoints(Array.from({length:pts.length/2},(_,i)=>({x:pts[i*2],y:pts[i*2+1]})),true);
 }
 if(zone===2){g.fillStyle(0x23445c).fillRect(280,140,200,65);g.fillStyle(0x7194a5);for(let i=0;i<10;i++)g.fillRect(340-i*5,145+i*5,13+i*9,1);}
}
