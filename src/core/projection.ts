import { CAMERA_DEPTH,VIEW_HEIGHT,VIEW_WIDTH } from '../game/config';
export interface ProjectedPoint { x:number;y:number;w:number;scale:number }
/** World coordinates in, low-resolution screen coordinates out. */
export function projectGround(x:number,y:number,z:number,cameraX:number,cameraY:number,cameraZ:number,roadWidth:number):ProjectedPoint {
 const scale=CAMERA_DEPTH/Math.max(.001,z-cameraZ);
 return {x:VIEW_WIDTH/2+scale*(x-cameraX)*VIEW_WIDTH/2,y:VIEW_HEIGHT/2-scale*(y-cameraY)*VIEW_HEIGHT/2,w:scale*roadWidth*VIEW_WIDTH/2,scale};
}
