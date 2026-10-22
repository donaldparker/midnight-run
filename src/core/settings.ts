import {clampDifficulty,DEFAULT_DIFFICULTY} from './difficulty';
export interface Settings {audio:boolean;shake:boolean;seed:string;difficulty:number}
export const settings:Settings={audio:true,shake:true,seed:'',difficulty:DEFAULT_DIFFICULTY};
try{const s=JSON.parse(localStorage.getItem('midnight-run-settings')??'{}');if(typeof s.audio==='boolean')settings.audio=s.audio;if(typeof s.shake==='boolean')settings.shake=s.shake;if(typeof s.difficulty==='number')settings.difficulty=clampDifficulty(s.difficulty);if(typeof s.seed==='string')settings.seed=s.seed.slice(0,24);}catch{/* Session defaults. */}
export function saveSettings(){try{localStorage.setItem('midnight-run-settings',JSON.stringify(settings));}catch{/* Session settings still work. */}}
