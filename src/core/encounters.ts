/** Race competitors retain their positions. Fresh road gangs keep combat alive after passing them. */
export function encounterCount(playerDistance:number,lastSpawn:number,nearby:number):number {
 return playerDistance-lastSpawn>=7000&&nearby<3?Math.min(2,4-nearby):0;
}
export function carScale(cameraDistance:number,playerZ:number,textureWidth:number):number {
 return 132/textureWidth*Math.min(1.8,playerZ/Math.max(1,cameraDistance));
}
