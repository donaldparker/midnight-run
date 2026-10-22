import Phaser from 'phaser';
import {makeRoad,random,SEGMENT,type Segment} from '../levels/build-level';
import {MIDNIGHT,type LevelDefinition} from '../levels/types';
import {MOVES,strike,weaponAfterAttack,gearAttack,attackSide,type Move,type HeldWeapon} from '../core/combat';
import {newRacer,stepPlayer,rank} from '../core/race';
import {encounterCount,carScale} from '../core/encounters';
import {newWanted,addWanted,coolWanted,wantedLevel,pursuitDelay} from '../core/wanted';
import {rivalFight,interruptRival,type Fighter} from '../actors/rival/behavior';
import {policeTexture} from '../actors/police/poses';
import {PoliceView} from './views/police-view';
import {FinishView} from './views/finish-view';
import {visibleRivals} from '../core/visible-enemies';
import {bakeRivalArt} from '../actors/rival/art';
import {rivalTexture} from '../actors/rival/poses';
import {combatDifficulty} from '../core/difficulty';
import {settings} from '../core/settings';
import {IAN,type RiderDefinition} from '../riders';
import {WeaponView} from './views/weapon-view';
import {EndingView} from './views/ending-view';
import {ANIMATION_ART,riderTexture,contactAt,duration,OUTRO_TIMES} from '../actors/rider/poses';
import {bakeAnimationArt} from '../actors/rider/animation-art';
import {createArt} from '../actors/rider/art';
import {newPolice,stepPolice,interruptPolice,newPoliceFight,policeHitDamage,registerPoliceHit,type Police} from '../actors/police/behavior';
import {drawSky,THEMES} from '../scenery/sky';
import {dawnAt} from '../core/dawn';
import {itemKind,heal} from '../core/health';
import {PLAYER_Z,RENDER_SCALE,RIDER_HEIGHT,RIDER_TEXTURE_HEIGHT} from './config';
import {RoadView} from './views/road-view';
import {riderScale,passingOpacity} from '../core/actor-projection';
import {ActorsView,type SpriteItem} from './views/actors-view';
import {Hud,type HudState} from './hud';
import {PlayerInput} from './input';
import {rideAudio} from './audio';
interface Rival extends Fighter {texture:string;flashUntil:number;role:'race'|'road'}
interface Item {distance:number;lane:number;kind:'chain'|'health'|'car';taken:boolean;speed:number}
export interface RunResult {won:boolean;rank:number;score:number;time:number;seed:string;distance:number;reason?:'finish'|'armor'|'busted'}
interface SceneOptions {level?:LevelDefinition;rider?:RiderDefinition;onReady?:()=>void;onHud?:(s:HudState)=>void;onEnd:(r:RunResult)=>void}
export class MidnightScene extends Phaser.Scene {
 readonly rider:RiderDefinition;readonly level:LevelDefinition;
 road:Segment[]=[];player=newRacer('ian');rivals:Rival[]=[];cop:Police|null=null;
 seed='';elapsed=0;score=0;combo=0;comboUntil=0;charges={chain:0};weapon:HeldWeapon='club';
 status:'home'|'riding'|'paused'|'ending'|'arresting'|'finished'='home';
 private combat=combatDifficulty(2);private policeFight=newPoliceFight();wanted=newWanted();private arrestAge=0;private policeView!:PoliceView;private finishView!:FinishView;
 private items:Item[]=[];private world!:Phaser.GameObjects.Graphics;private effects!:Phaser.GameObjects.Graphics;
 private roadView!:RoadView;private actors!:ActorsView;private hud!:Hud;private controls!:PlayerInput;
 private weaponView!:WeaponView;private ending!:EndingView;private playerSprite!:Phaser.GameObjects.Image;
 private cooldown=0;private invulnerable=0;private attackStarted=-10;private attackSide=1;private attackMove:Move='club';
 private pendingAttack:{move:Move;at:number;side:number}|null=null;
 private message='';private messageUntil=0;private decayAt=12;private pan=0;private rng=()=>.5;
 private lastRoadGang=0;private roadGangId=0;private nextPoliceAt=18;private endingAge=0;private result:RunResult|null=null;
 constructor(private options:SceneOptions){super('Midnight');this.rider=options.rider??IAN;this.level=options.level??MIDNIGHT;}
 preload(){
  this.load.image('ian-source','/assets/ian-rear-patches.png');this.load.image('police-source','/assets/police.png');
  for(const [name,url] of Object.entries(ANIMATION_ART))this.load.image(`sheet-${name}`,url);
 }
 create(){
  this.cameras.main.setZoom(RENDER_SCALE).centerOn(240,135);createArt(this);bakeAnimationArt(this);bakeRivalArt(this);
  this.world=this.add.graphics();this.effects=this.add.graphics().setDepth(70);this.roadView=new RoadView(this.world);
  this.actors=new ActorsView(this);this.hud=new Hud(this,this.options.onHud);this.controls=new PlayerInput(this.input.keyboard!);
  this.policeView=new PoliceView(this);this.finishView=new FinishView(this);this.weaponView=new WeaponView(this);this.ending=new EndingView(this);
  this.playerSprite=this.add.image(240,239,this.rider.texture).setOrigin(.5,1).setDepth(43.9).setScale(RIDER_HEIGHT/RIDER_TEXTURE_HEIGHT);
  this.startRun('preview');this.status='home';this.options.onReady?.();
 }
 startRun(seed?:string){
  this.combat=combatDifficulty(settings.difficulty);
  this.seed=seed||settings.seed||crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase();
  this.rng=random(this.seed+'actors');this.road=makeRoad(this.seed,this.level.segments);
  this.player=newRacer('ian',PLAYER_Z,.32,3600);this.player.armor=this.rider.stats.maxArmor;
  this.rivals=Array.from({length:7},(_,i)=>({...newRacer(`rival-${i}`,PLAYER_Z+1400+i*1750,[-.5,.65,-.3,.35][i%4],6900+this.rng()*3100),texture:['red','blue','white'][i%3],flashUntil:0,attackAt:2+i,role:'race',armor:this.combat.armor,strikeAt:0,strikeSide:1}));
  this.items=[];
  for(let d=6500;d<this.level.segments*SEGMENT-10000;d+=7000+this.rng()*6000){
   const kind=itemKind(this.rng(),this.combat.kits);
   const oncoming=this.rng()>.45;
   this.items.push({distance:d,lane:kind==='car'?(oncoming?-.58:.6):(this.rng()-.5)*1.5,kind,taken:false,speed:kind==='car'?(oncoming?-2800:4500):0});
  }
  this.pan=0;this.decayAt=12;this.elapsed=0;this.score=0;this.combo=0;this.comboUntil=0;this.cooldown=0;this.invulnerable=0;
  this.attackStarted=-10;this.pendingAttack=null;this.charges={chain:0};this.weapon='club';this.cop=null;
  this.wanted=newWanted();this.policeFight=newPoliceFight();this.arrestAge=0;this.lastRoadGang=0;this.roadGangId=0;this.nextPoliceAt=0;this.endingAge=0;this.result=null;
  this.ending?.hide();this.playerSprite?.setVisible(true);this.status='riding';
  this.message=matchMedia('(pointer:coarse), (max-width:950px)').matches?'HOLD GAS TO THROTTLE':'HOLD W TO THROTTLE';this.messageUntil=4;this.controls?.clear();
 }
 pauseRide(){if(this.status==='riding'){this.status='paused';this.controls.clear();rideAudio.update(0,false);}}
 resumeRide(){if(this.status==='paused'){this.status='riding';this.controls.clear();}}
 goHome(){this.status='home';this.controls.clear();this.ending.hide();rideAudio.update(0,false);}
 private raceRank(){return rank(this.player,this.rivals.filter(r=>r.role==='race'));}
 private visibleRivals(){return visibleRivals(this.rivals,this.player.distance,this.cop?.active?this.cop.distance:undefined);}
 private targets(){return [...this.visibleRivals().filter(r=>r.armor>0&&this.elapsed>=r.downUntil),...(this.cop?.active?[this.cop]:[])];}
 update(_time:number,delta:number){
  const dt=Math.min(delta/1000,.05);
  if(this.status==='arresting'){
   this.elapsed+=dt;this.arrestAge+=dt;this.player.speed=Math.max(0,this.player.speed-9000*dt);this.player.distance=Math.min(this.level.segments*SEGMENT-800,this.player.distance+this.player.speed*dt);
   this.player.lane+=Math.max(-.8*dt,Math.min(.8*dt,1.12-this.player.lane));
   if(this.cop){this.cop.distance=this.player.distance+160;this.cop.lane=this.player.lane-.38;this.cop.pursuitAge+=dt;}
   this.message='BUSTED — PULL OVER';this.messageUntil=this.elapsed+1;this.renderWorld();
   if(this.arrestAge>=2.8)this.finish(false,'busted');return;
  }
  if(this.status==='ending'){
   this.endingAge+=dt;this.ending.draw(this.endingAge);
   if(this.endingAge>=duration(OUTRO_TIMES)&&this.result){this.status='finished';this.options.onEnd(this.result);}return;
  }
  if(this.status==='riding'){
   this.elapsed+=dt;const before=this.player.distance;
   const segment=this.road[Math.min(this.road.length-1,Math.floor(this.player.distance/SEGMENT))];
   stepPlayer(this.player,this.controls.driveHeld(),this.controls.steerHeld(),segment.curve,dt,this.rider);
   this.pan+=segment.curve*this.player.speed*dt*.00003;
   if(this.elapsed>this.comboUntil)this.combo=0;
   if(this.elapsed>=this.decayAt){this.charges.chain=Math.max(0,this.charges.chain-1);this.decayAt+=12;}
   if(this.weapon==='chain'&&this.charges.chain<1)this.weapon='club';
   coolWanted(this.wanted,dt,!!this.cop?.active);
   const activeRivals=new Set(this.visibleRivals());
   for(const r of this.rivals){
    if(r.armor<=0){r.speed=Math.max(0,r.speed-5000*dt);r.distance+=r.speed*dt;continue;}
    if(this.elapsed<r.downUntil)r.speed=Math.max(1200,r.speed-3500*dt);
    else {const target=r.role==='race'?7800+Number(r.id.slice(-1))*230:6200+Number(r.id.slice(-1))%4*180;r.speed+=Math.max(-900*dt,Math.min(900*dt,target-r.speed));}
    r.distance+=r.speed*dt;
    if(!activeRivals.has(r)&&r.strikeAt)interruptRival(r,this.elapsed);
    if(activeRivals.has(r)&&rivalFight(r,this.player,this.elapsed,dt,this.combat))this.hurt(r.strikeMove==='kick'?10:8,`RIVAL ${(r.strikeMove??'punch').toUpperCase()}`,.96);
   }
   this.keepRoadAlive();this.updatePolice(dt);
   if(this.status!=='riding')return;
   for(const move of this.controls.attacksPressed())this.attack(move==='equipped'?gearAttack(this.weapon,this.charges):move);
   if(this.pendingAttack&&this.elapsed>=this.pendingAttack.at){const pending=this.pendingAttack;this.pendingAttack=null;this.resolveStrike(pending.move,pending.side);}
   for(const item of this.items){
    if(item.taken)continue;const previousGap=item.distance-before;item.distance+=item.speed*dt;const gap=item.distance-this.player.distance;
    const crossed=(previousGap>=0&&gap<=0)||Math.abs(gap)<160;
    if(!crossed||Math.abs(item.lane-this.player.lane)>(item.kind==='car'?.34:.24))continue;
    item.taken=true;
    if(item.kind==='health'){const before=this.player.armor;this.player.armor=heal(before,this.combat.kitHeal,this.rider.stats.maxArmor);this.callout(this.player.armor>before?`PATCHED UP +${Math.round(this.player.armor-before)}`:'ARMOR FULL +100');if(this.player.armor===before)this.score+=100;rideAudio.hit();}
    else if(item.kind==='chain'){this.charges.chain+=4;this.weapon='chain';this.callout('CHAIN +4');rideAudio.hit();}
    else if(this.hurt(19,'TRAFFIC COLLISION',.48))addWanted(this.wanted,14);
   }
   if(this.player.armor<=0)this.finish(false,'armor');
   else if(this.player.distance>=this.level.segments*SEGMENT-SEGMENT*12)this.finish(true,'finish');
   rideAudio.update(this.player.speed,this.status==='riding');
  }
  this.renderWorld();
 }
 private keepRoadAlive(){
  this.rivals=this.rivals.filter(r=>r.role==='race'||r.distance>this.player.distance-3000);
  const nearby=this.rivals.filter(r=>r.armor>0&&r.distance>this.player.distance-500&&r.distance<this.player.distance+22000).length;
  const count=encounterCount(this.player.distance,this.lastRoadGang,nearby);
  if(!count)return;this.lastRoadGang=this.player.distance;
  for(let i=0;i<count;i++){const serial=this.roadGangId++;this.rivals.push({...newRacer(`road-${serial}`,this.player.distance+7500+i*3800,[-.6,.6,-.25,.3][serial%4],6000+this.rng()*800),role:'road',texture:['red','blue','white'][serial%3],flashUntil:0,attackAt:this.elapsed+3,armor:this.combat.armor,strikeAt:0,strikeSide:1});}
 }
 private updatePolice(dt:number){
  if(wantedLevel(this.wanted)>0&&(!this.cop||!this.cop.active)&&this.elapsed>=this.nextPoliceAt){this.cop=newPolice(this.player,this.combat.armor+14);this.callout('POLICE! THROTTLE TO ESCAPE');}
  if(!this.cop?.active)return;
  const outcome=stepPolice(this.cop,this.player,dt,wantedLevel(this.wanted));
  if(this.cop.kickAt>0)this.callout('COP WINDING UP — DODGE OR STRIKE!');
  if(outcome==='kick'){
   const landed=this.hurt(policeHitDamage(this.player.armor),'POLICE KICK',.95);
   if(registerPoliceHit(this.policeFight,landed)){this.status='arresting';this.arrestAge=0;this.pendingAttack=null;this.controls.clear();rideAudio.update(0,false);}
   else if(landed)this.callout(`COP HIT ${this.policeFight.hits}/5 — FIGHT BACK!`);
  }
  else if(outcome==='escaped'){this.score+=350;this.wanted.heat=Math.max(0,this.wanted.heat-28);this.wanted.quiet=0;this.nextPoliceAt=this.elapsed+pursuitDelay(wantedLevel(this.wanted));this.callout('POLICE EVADED +350');}
 }
 private callout(message:string){this.message=message;this.messageUntil=this.elapsed+2;}
 private hurt(damage:number,message:string,multiplier:number){
  if(this.elapsed<this.invulnerable)return false;
  this.invulnerable=this.elapsed+1.2;this.player.armor=Math.max(0,this.player.armor-damage);this.player.speed*=multiplier;this.combo=0;this.callout(message);
  rideAudio.hit(true);if(settings.shake)this.cameras.main.shake(110,.008);return true;
 }
 private attack(move:Move){
  if(this.elapsed<this.cooldown)return;
  if(move==='chain'&&this.charges.chain<1){this.callout('FIND A CHAIN PICKUP');return;}
  this.cooldown=this.elapsed+MOVES[move].cooldown;
  if(move==='chain')this.charges.chain--;
  this.attackMove=move;this.attackStarted=this.elapsed;
  this.attackSide=attackSide(this.player,this.targets(),move,this.controls.steerHeld());
  this.weapon=weaponAfterAttack(this.weapon,move,this.charges);
  this.pendingAttack={move,at:this.elapsed+contactAt(move),side:this.attackSide};
 }
 private resolveStrike(move:Move,side:number){
  const target=this.targets().filter(r=>strike(move,r.distance-this.player.distance,r.lane-this.player.lane,side))
   .sort((a,b)=>Math.abs(a.distance-this.player.distance)-Math.abs(b.distance-this.player.distance))[0];
  if(!target)return;
  if(target.id==='police'&&this.cop)interruptPolice(this.cop);
  else interruptRival(target as Rival,this.elapsed);
  const spec=MOVES[move];const damage=Math.min(target.armor,spec.damage);target.armor-=spec.damage;addWanted(this.wanted,damage,target.id==='police');target.distance-=spec.knock;target.speed*=.93;target.flashUntil=this.elapsed+.15;
  this.combo=this.elapsed<this.comboUntil?Math.min(8,this.combo+1):1;this.comboUntil=this.elapsed+1.7;this.score+=75*this.combo;
  if(target.armor<=0){
   target.downUntil=Infinity;target.armor=0;target.speed=1500;this.score+=500;const healed=heal(this.player.armor,this.combat.koHeal,this.rider.stats.maxArmor)-this.player.armor;this.player.armor+=healed;this.callout(healed>0?`KNOCKDOWN +500 · ARMOR +${healed}`:'KNOCKDOWN +500');
   if(this.cop&&target.id==='police'){this.cop.active=false;this.nextPoliceAt=this.elapsed+pursuitDelay(wantedLevel(this.wanted));this.callout('PATROL SHAKEN OFF +500');}
   if(settings.shake)this.cameras.main.shake(90,.005);
  }else this.callout(`${move==='club'?'SHILLELAGH':move.toUpperCase()}! +${75*this.combo}`);
  rideAudio.hit(move==='kick');
 }
 private finish(won:boolean,reason:RunResult['reason']){
  if(this.status!=='riding'&&this.status!=='arresting')return;this.pendingAttack=null;this.controls.clear();rideAudio.update(0,false);
  this.result={won,reason,rank:this.raceRank(),score:this.score,time:this.elapsed,seed:this.seed,distance:this.player.distance};
  if(won){this.status='ending';this.endingAge=0;this.playerSprite.setVisible(false);this.ending.draw(0);}
  else{this.status='finished';this.options.onEnd(this.result);}
 }
 /** Development-only controls for checking every frame and the ending without racing a whole route. */
 previewAction(move:Move,side?:number){if(!import.meta.env.DEV)return;if(this.status!=='riding')this.startRun();this.charges.chain=8;this.cooldown=0;this.attack(move);if(side){this.attackSide=side;if(this.pendingAttack)this.pendingAttack.side=side;}}
 previewPolice(){if(!import.meta.env.DEV)return;if(this.status!=='riding')this.startRun();addWanted(this.wanted,35);this.cop=newPolice(this.player,this.combat.armor+14);this.cop.distance=this.player.distance+500;this.callout('POLICE PURSUIT');}
 previewPolicePose(side:number){if(!import.meta.env.DEV)return;if(this.status!=='riding')this.startRun();this.cop=newPolice(this.player,this.combat.armor+14);this.cop.distance=this.player.distance+60;this.cop.lane=this.player.lane-side*.32;this.cop.kickSide=side;this.cop.attackStarted=0;this.cop.pursuitAge=1.1;this.cop.kickUntil=1.7;this.status='paused';this.controls.clear();this.callout('POLICE KICK — SPRITE PREVIEW');}
 previewRivalPose(){if(!import.meta.env.DEV)return;if(this.status!=='riding')this.startRun();this.rivals[0]={...this.rivals[0],distance:this.player.distance+60,lane:this.player.lane-.32,strikeSide:1,strikeMove:'punch',strikeStarted:this.elapsed-.7,strikeAt:0,strikeUntil:this.elapsed+.3};this.status='paused';this.controls.clear();this.callout('RIVAL PUNCH — SPRITE PREVIEW');}
 previewTraffic(){if(!import.meta.env.DEV)return;if(this.status!=='riding')this.startRun();this.items.push({distance:this.player.distance+2000,lane:-.58,kind:'car',taken:false,speed:0});}
 previewEnding(){if(!import.meta.env.DEV)return;if(this.status!=='riding')this.startRun();this.player.distance=this.level.segments*SEGMENT;this.finish(true,'finish');}
 previewFinishLine(){if(!import.meta.env.DEV)return;if(this.status!=='riding')this.startRun();this.player.distance=this.level.segments*SEGMENT-17000;this.player.speed=3600;this.cop=null;this.wanted=newWanted();}
 private renderWorld(){
  if(!this.road.length||this.status==='ending')return;
  const distance=Math.max(0,this.player.distance-PLAYER_Z),base=Math.floor(distance/SEGMENT),zone=this.road[Math.min(base,this.road.length-1)].zone;
  const dawn=dawnAt(this.player.distance/(this.level.segments*SEGMENT));
  this.world.clear();drawSky(this.world,zone,this.pan,dawn);this.roadView.draw(this.road,distance,this.player.lane,dawn);
  const objects:SpriteItem[]=[];
  for(const point of this.roadView.points.values()){
   const s=this.road[point.index],p=point.p;
   if(s.index%7===0)objects.push({texture:s.index%49===0?'sign':s.zone===1?'rock':s.zone===2?'palm':'tree',x:p.x+p.w*s.side*(1.45+s.decor*.8),y:p.y,scale:p.w/90,clip:point.clip});
  }
  const place=(worldDistance:number,lane:number,texture:string,flash=false,angle=0,rider=false)=>{
   const point=this.roadView.sample(worldDistance);if(!point)return;const p=point.p,gap=worldDistance-this.player.distance;
   const scale=rider?riderScale(worldDistance-distance,PLAYER_Z,RIDER_HEIGHT,texture.startsWith('rival-anim-')?160:RIDER_TEXTURE_HEIGHT):texture.startsWith('car')?carScale(worldDistance-distance,PLAYER_Z,160):Math.min(3,p.w/210);
   objects.push({texture,x:p.x+p.w*lane,y:p.y,scale,clip:Math.min(point.clip,244),angle,flash,alpha:rider?passingOpacity(gap):1});
  };
  for(const item of this.items)if(!item.taken)place(item.distance,item.lane,item.kind==='car'&&item.speed>0?'car-rear':item.kind);
  for(const r of this.visibleRivals())place(r.distance,r.lane,rivalTexture(r,r.texture,this.elapsed),this.elapsed<r.flashUntil,r.armor<=0?75:Math.sin(this.elapsed+r.distance*.0001)*3,true);
  const showCop=this.cop?.active&&this.cop.distance-this.player.distance> -500&&this.cop.distance-this.player.distance<26000;
  if(showCop&&this.cop)place(this.cop.distance,this.cop.lane,policeTexture(this.cop),this.elapsed<this.cop.flashUntil,0,true);
  objects.sort((a,b)=>a.y-b.y);this.actors.begin();for(const item of objects)this.actors.draw(item);this.actors.end();
  const steer=this.status==='riding'?this.controls.steerHeld():0,bob=this.status==='riding'&&this.player.speed>500?Math.sin(this.elapsed*24)*.65:0;
  const age=this.elapsed-this.attackStarted,pose=riderTexture(this.weapon,this.attackMove,age,this.attackSide);
  if(this.playerSprite.texture.key!==pose&&this.textures.exists(pose))this.playerSprite.setTexture(pose);
  this.playerSprite.setVisible(true).setPosition(240,239+bob).setAngle(-steer*7).setAlpha(1);
  this.effects.clear();
  if(this.elapsed<this.invulnerable)this.effects.lineStyle(1,0xf2c70d,.35).strokeEllipse(240,238,52,8);
  const cp=showCop&&this.cop?this.roadView.sample(this.cop.distance):null;
  if(cp&&this.cop){const scale=riderScale(this.cop.distance-distance,PLAYER_Z,RIDER_HEIGHT,RIDER_TEXTURE_HEIGHT);this.policeView.draw(this.cop,cp.p.x+cp.p.w*this.cop.lane,cp.p.y,320*scale,Math.min(cp.clip,244),passingOpacity(this.cop.distance-this.player.distance));}else this.policeView.draw(null);
  this.finishView.draw(this.roadView.sample(this.level.segments*SEGMENT-SEGMENT*12));
  this.weaponView.draw({move:this.attackMove,side:this.attackSide,age});
  this.hud.update({speed:this.player.speed,rank:this.raceRank(),checkpoint:Math.min(8,1+Math.floor(this.player.distance/(this.level.segments*SEGMENT/8))),armor:this.player.armor,combo:this.combo,score:this.score,weapon:this.weapon==='club'?'SHILLELAGH':'CHAIN',charges:this.weapon==='chain'?this.charges.chain:0,progress:Math.min(1,this.player.distance/(this.level.segments*SEGMENT)),seed:this.seed,zone:THEMES[zone].name,time:this.elapsed,wanted:wantedLevel(this.wanted),police:this.cop?.active?{gap:this.cop.distance-this.player.distance,bust:this.cop.bust,hits:this.policeFight.hits}:null,message:this.elapsed<this.messageUntil?this.message:this.targets().some(r=>Math.abs(r.distance-this.player.distance)<900&&Math.abs(r.lane-this.player.lane)<.7)?'RIVAL IN RANGE - STRIKE!':''});
 }
}
