export const MAX_VISIBLE_ENEMIES=4;
interface RoadEnemy {distance:number}
export function visibleRivals<T extends RoadEnemy>(rivals:readonly T[],playerDistance:number,policeDistance?:number):T[]{
 const inView=(d:number)=>d-playerDistance> -500&&d-playerDistance<26000;
 const policeVisible=policeDistance!==undefined&&inView(policeDistance);
 return rivals.filter(r=>inView(r.distance)).sort((a,b)=>Math.abs(a.distance-playerDistance)-Math.abs(b.distance-playerDistance)).slice(0,MAX_VISIBLE_ENEMIES-Number(policeVisible));
}
