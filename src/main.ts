import Phaser from 'phaser';
import { MidnightScene } from './game/midnight-scene';
import { VIEW_WIDTH,VIEW_HEIGHT,RENDER_SCALE } from './game/config';
import { rideAudio } from './game/audio';
import { mountShell,el } from './ui/shell';
import { mountTouchControls } from './ui/touch';
import { registerOfflineSupport } from './ui/pwa';
import { prepareLandscape,mountLandscapeGuard,portraitGame } from './ui/orientation';
import './ui/style.css';
let ready=false;
const scene=new MidnightScene({onReady:()=>{ready=true;el<HTMLButtonElement>('start').disabled=false;if(import.meta.env.DEV&&new URLSearchParams(location.search).has('lab'))void import('./debug/animation-lab').then(m=>m.mountAnimationLab(scene,el('stage'),()=>{scene.startRun();page.start();}));},onHud:s=>page.updateHud(s),onEnd:r=>page.result(r)});
function start(){if(!ready||portraitGame(window.innerWidth,window.innerHeight))return;void prepareLandscape(el('stage'));rideAudio.unlock();scene.startRun();page.start();}
function home(){if(!ready)return;scene.goHome();page.home();}
function resume(){rideAudio.unlock();scene.resumeRide();page.pause(false);}
const page=mountShell({start,home,resume,pause:pauseIfRiding});mountTouchControls();registerOfflineSupport();
const startButton=el<HTMLButtonElement>('start');startButton.disabled=true;
const game=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:VIEW_WIDTH*RENDER_SCALE,height:VIEW_HEIGHT*RENDER_SCALE,backgroundColor:'#101e3c',pixelArt:false,roundPixels:false,antialias:true,render:{antialias:true,roundPixels:false,powerPreference:'high-performance'},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[scene]});
window.addEventListener('keydown',e=>{
 if(!ready||e.target instanceof HTMLInputElement)return;
 if(e.code==='Escape'){if(!el('settings-panel').hidden){el('close-settings').click();return;}home();return;}
 if(!el('settings-panel').hidden)return;
 if(e.code==='KeyR'&&scene.status!=='home'){e.preventDefault();start();}
 if(e.code==='KeyP'&&(scene.status==='riding'||scene.status==='paused')){if(scene.status==='paused')resume();else{scene.pauseRide();page.pause(true);}}
});
function pauseIfRiding(){if(ready&&scene.status==='riding'){scene.pauseRide();page.pause(true);}}
window.addEventListener('blur',pauseIfRiding);document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseIfRiding();});
mountLandscapeGuard(pauseIfRiding);
el('rotate-lock').addEventListener('click',()=>void prepareLandscape(el('stage')));
window.addEventListener('pagehide',()=>rideAudio.update(0,false));
// Expose a read-only snapshot for browser QA without changing the simulation.
if(import.meta.env.DEV)Object.defineProperty(window,'midnightSnapshot',{value:()=>({status:scene.status,seed:scene.seed,speed:scene.player.speed,distance:scene.player.distance,lane:scene.player.lane,armor:scene.player.armor,rank:1+scene.rivals.filter(r=>r.role==='race'&&r.distance>scene.player.distance).length,score:scene.score,combo:scene.combo,charges:{...scene.charges},elapsed:scene.elapsed,renderer:game.renderer.type})});
