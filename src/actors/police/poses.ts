import type {Police} from './behavior';
import {POLICE_WINDUP,POLICE_RECOVERY} from './behavior';
import {frameAt} from '../rider/poses';
export function policeTexture(cop:Police):string {
 const age=cop.pursuitAge-cop.attackStarted;
 if(age<0||age>=POLICE_WINDUP+POLICE_RECOVERY)return 'police';
 const frame=frameAt(age,[.18,.37,.5,.22,.24,.19]);
 return `anim-police-kick-${cop.kickSide<0?'left':'right'}-${frame}`;
}
