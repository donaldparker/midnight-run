export interface Settings {audio:boolean;shake:boolean;seed:string}
export const settings:Settings={audio:true,shake:true,seed:''};
try{const s=JSON.parse(localStorage.getItem('midnight-run-settings')??'{}');if(typeof s.audio==='boolean')settings.audio=s.audio;if(typeof s.shake==='boolean')settings.shake=s.shake;if(typeof s.seed==='string')settings.seed=s.seed.slice(0,24);}catch{/* Session defaults. */}
export function saveSettings(){try{localStorage.setItem('midnight-run-settings',JSON.stringify(settings));}catch{/* Session settings still work. */}}
