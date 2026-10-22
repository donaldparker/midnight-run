import { settings } from '../core/settings';
export class RideAudio {
 private ctx?:AudioContext; private engine?:OscillatorNode;private gain?:GainNode;
 unlock(){if(!settings.audio)return;this.ctx??=new AudioContext();void this.ctx.resume();if(!this.engine){this.engine=this.ctx.createOscillator();this.engine.type='sawtooth';this.gain=this.ctx.createGain();this.gain.gain.value=0;const filter=this.ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=240;this.engine.connect(filter);filter.connect(this.gain);this.gain.connect(this.ctx.destination);this.engine.start();}}
 update(speed:number,active:boolean){if(this.engine&&this.ctx&&this.gain){this.engine.frequency.setTargetAtTime(28+speed/170,this.ctx.currentTime,.1);this.gain.gain.setTargetAtTime(active && settings.audio ? .026 : 0,this.ctx.currentTime,.08);}}
 hit(heavy=false){if(!this.ctx||!settings.audio)return;const t=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type='square';o.frequency.setValueAtTime(heavy?110:230,t);o.frequency.exponentialRampToValueAtTime(35,t+.16);g.gain.setValueAtTime(.065,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);o.connect(g);g.connect(this.ctx.destination);o.start(t);o.stop(t+.2);o.onended=()=>{o.disconnect();g.disconnect();};}
}
export const rideAudio=new RideAudio();
