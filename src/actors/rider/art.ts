import Phaser from 'phaser';
export function createArt(scene:Phaser.Scene) {
  const make=(key:string,w:number,h:number,draw:(r:(x:number,y:number,w:number,h:number,c:string)=>void,c:CanvasRenderingContext2D)=>void)=>{
    const cv=document.createElement('canvas');cv.width=w;cv.height=h;
    const c=cv.getContext('2d')!; c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    draw((x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h);},c);
    scene.textures.addCanvas(key,cv);
  };
  // All poses share a rear-wheel anchor and body-height calibration. Wide
  // transparent margins give the arms and chain room without shrinking the bike.
  const bakeRider=(sourceKey:string,targetKey:string,patch?:string)=>{
    if(!scene.textures.exists(sourceKey))return false;
    const source=scene.textures.get(sourceKey).getSourceImage() as HTMLImageElement;
    const scan=document.createElement('canvas');scan.width=source.width;scan.height=source.height;
    const sc=scan.getContext('2d')!;sc.drawImage(source,0,0);
    const data=sc.getImageData(0,0,scan.width,scan.height).data;
    let top=scan.height,bottom=0;
    for(let y=0;y<scan.height;y++)for(let x=0;x<scan.width;x++)if(data[(y*scan.width+x)*4+3]>40){top=Math.min(top,y);bottom=Math.max(bottom,y);}
    let sum=0,count=0;
    for(let y=Math.floor(bottom-(bottom-top)*.06);y<=bottom;y++)for(let x=0;x<scan.width;x++)if(data[(y*scan.width+x)*4+3]>40){sum+=x;count++;}
    const wheelX=count?sum/count:scan.width/2,scale=320/(bottom-top+1);
    make(targetKey,512,320,(_r,c)=>{
      c.drawImage(source,256-wheelX*scale,-top*scale,source.width*scale,source.height*scale);
      if(patch){const d=c.getImageData(0,0,512,320),rgb=patch.match(/[a-f0-9]{2}/gi)!.map(h=>parseInt(h,16));for(let i=0;i<d.data.length;i+=4){const r=d.data[i],g=d.data[i+1],b=d.data[i+2];if(r>130&&g>85&&g<r*.98&&b<g*.65){const light=(r+g)/450;d.data[i]=rgb[0]*light;d.data[i+1]=rgb[1]*light;d.data[i+2]=rgb[2]*light;}}c.putImageData(d,0,0);}
    });return true;
  };
  for(const [name,patch] of [['ian','#f2c70d'],['red','#cf4939'],['blue','#7796cb'],['white','#c4c6b5']] as const){
    if(bakeRider('ian-source',name,name==='ian'?undefined:patch))continue;
    make(name,48,64,(r)=>{
      r(18,48,12,16,'#080b11');r(20,50,3,12,'#353b48');r(27,52,2,10,'#171b25');
      r(8,36,32,17,'#171d29');r(6,38,10,15,'#080c13');r(32,38,10,15,'#080c13');r(7,39,8,2,'#697080');r(33,39,8,2,'#697080');r(8,51,7,2,'#424652');r(33,51,7,2,'#424652');
      r(14,32,20,17,'#292c35');r(16,42,16,7,'#111620');r(16,44,5,3,'#f34235');r(27,44,5,3,'#f34235');r(22,43,4,3,'#ffb24c');r(19,48,10,3,'#dad1b4');
      r(11,29,5,11,'#333441');r(32,29,5,11,'#333441');r(11,38,5,4,'#080b10');r(32,38,5,4,'#080b10');
      r(13,13,22,22,'#0a0d14');r(16,14,16,2,patch);r(15,16,18,2,patch);r(17,29,14,3,patch);r(19,23,10,4,patch);r(21,21,6,7,patch);r(23,21,2,2,'#0a0d14');
      r(9,15,5,12,'#b37854');r(7,20,5,7,'#d5a074');r(34,15,5,12,'#b37854');r(37,20,5,7,'#d5a074');r(6,25,9,3,'#141a24');r(33,25,9,3,'#141a24');
      r(3,18,5,3,'#a1b2c4');r(40,18,5,3,'#a1b2c4');r(5,21,2,5,'#2c3139');r(41,21,2,5,'#2c3139');
      r(19,3,10,10,'#ad7850');r(18,5,12,6,'#774a32');r(19,2,10,5,'#6e4e36');r(20,1,7,3,'#a7824f');r(21,3,2,3,'#c69d65');r(18,9,3,4,'#c99568');r(27,9,3,4,'#c99568');r(21,11,6,3,'#583e2c');
    });
  }
  bakeRider('police-source','police');
  make('tree',48,96,(r)=>{r(22,60,5,36,'#302d28');r(22,62,2,31,'#66513a');for(let tier=0;tier<5;tier++){const top=tier*13;for(let y=0;y<23;y++){const width=2+Math.floor((y/23)*(12+tier*8)/2)*2; r(24-width/2,top+y,width,1,y<5?'#294d43':'#17372f');if(y%5<2&&width>8)r(24-width/2+2,top+y,Math.floor(width*.4),1,'#345943');}}});
  make('palm',62,90,(r,c)=>{r(29,28,5,62,'#524332');r(30,32,2,54,'#88704a');c.fillStyle='#274b3e';for(let i=0;i<7;i++){c.beginPath();c.moveTo(31,27);c.lineTo(31+Math.cos(i*.9)*31,26+Math.sin(i*.9)*18);c.lineTo(31+Math.cos(i*.9)*23,32+Math.sin(i*.9)*19);c.fill();}});
  make('rock',50,32,(r)=>{r(5,14,42,17,'#615863');r(12,5,25,25,'#877b7a');r(19,0,13,25,'#988b82');r(3,25,45,6,'#484752');r(14,9,6,8,'#b5a28d');});
  make('sign',26,58,(r)=>{r(12,18,3,40,'#9c9e8e');r(1,1,24,23,'#f2c70d');r(4,4,18,17,'#1c211d');r(11,6,6,4,'#f2c70d');r(7,10,6,4,'#f2c70d');r(11,14,6,4,'#f2c70d');});
  for(const rear of [false,true])make(rear?'car-rear':'car',160,90,(r,c)=>{
    r(12,57,22,32,'#0a0e15');r(126,57,22,32,'#0a0e15');
    c.fillStyle=rear?'#566d73':'#ad4b38';c.beginPath();c.moveTo(32,8);c.lineTo(126,8);c.lineTo(139,34);c.lineTo(150,45);c.lineTo(150,78);c.lineTo(10,78);c.lineTo(10,45);c.lineTo(23,34);c.closePath();c.fill();
    c.fillStyle=rear?'#8aa1a5':'#d46c4d';c.fillRect(14,45,132,22);
    c.fillStyle='#273c4b';c.beginPath();c.moveTo(36,12);c.lineTo(122,12);c.lineTo(132,36);c.lineTo(26,36);c.closePath();c.fill();
    r(38,14,35,3,'#95b3ba');r(39,17,9,15,'#5b7a88');r(15,48,130,2,rear?'#b2c6c5':'#e6a181');
    if(rear){r(19,56,29,10,'#f04d38');r(112,56,29,10,'#f04d38');r(63,65,34,9,'#d5cfb5');}
    else{r(20,55,29,11,'#fbe4b6');r(111,55,29,11,'#fbe4b6');r(56,57,48,12,'#111c24');for(let x=60;x<104;x+=6)r(x,59,2,8,'#687b83');}
    r(14,74,132,6,'#29323a');r(20,75,120,2,'#9caaa6');r(8,39,11,7,'#1c2932');r(141,39,11,7,'#1c2932');
  });
  make('oil',32,14,(r)=>{r(5,3,21,10,'#101622');r(1,6,30,5,'#101622');r(8,5,11,2,'#46445a');r(21,8,6,2,'#3e4160');});
  for(const [k,col] of [['chain','#9ac6df']] as const)make(k,20,23,(r)=>{r(3,2,14,18,'#151c24');r(1,5,18,12,col);r(4,2,12,18,col);r(5,6,10,10,'#151c24');r(7,5,3,5,col);r(10,10,3,6,col);});
}
