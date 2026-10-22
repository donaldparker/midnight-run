import Phaser from 'phaser';
/** Reuse the established rider motion with each gang's patch palette at half resolution. */
export function bakeRivalArt(scene:Phaser.Scene){
 for(const [palette,color] of Object.entries({red:[207,73,57],blue:[119,150,203],white:[196,198,181]}))
 for(const move of ['punch','kick'])for(const side of ['left','right'])for(let frame=0;frame<6;frame++){
  const source=scene.textures.get(`anim-${move}-${side}-${frame}`).getSourceImage() as HTMLCanvasElement;
  const canvas=document.createElement('canvas');canvas.width=320;canvas.height=224;const c=canvas.getContext('2d')!;
  c.imageSmoothingQuality='high';c.drawImage(source,0,0,320,224);const image=c.getImageData(0,0,320,224);
  for(let i=0;i<image.data.length;i+=4){const [r,g,b]=image.data.subarray(i,i+3);if(r>130&&g>85&&g<r*.98&&b<g*.65){const light=(r+g)/450;image.data[i]=color[0]*light;image.data[i+1]=color[1]*light;image.data[i+2]=color[2]*light;}}
  c.putImageData(image,0,0);scene.textures.addCanvas(`rival-anim-${palette}-${move}-${side}-${frame}`,canvas);
 }
}
