import Phaser from 'phaser';
import { touchInput,consumeTouchPress,clearTouch } from '../ui/touch';
import type {Move} from '../core/combat';
export class PlayerInput {
 private presses:Move[]=[];
 private keys:Record<string,Phaser.Input.Keyboard.Key>;
 constructor(private keyboard:Phaser.Input.Keyboard.KeyboardPlugin){this.keys=keyboard.addKeys('UP,DOWN,LEFT,RIGHT,W,A,S,D,J,K,L,H') as Record<string,Phaser.Input.Keyboard.Key>;keyboard.addCapture(['UP','DOWN','LEFT','RIGHT']);for(const [key,move] of Object.entries({J:'punch',K:'kick',L:'club',H:'chain'}))this.keys[key].on('down',()=>this.presses.push(move as Move));}
 driveHeld(){return Number(this.keys.UP.isDown||this.keys.W.isDown||touchInput.has('ArrowUp'))-Number(this.keys.DOWN.isDown||this.keys.S.isDown||touchInput.has('ArrowDown'));}
 steerHeld(){return Number(this.keys.RIGHT.isDown||this.keys.D.isDown||touchInput.has('ArrowRight'))-Number(this.keys.LEFT.isDown||this.keys.A.isDown||touchInput.has('ArrowLeft'));}
 attacksPressed():Array<Move|'equipped'>{return [...this.presses.splice(0),...consumeTouchPress()] as Array<Move|'equipped'>;}
 clear(){this.presses.length=0;this.keyboard.resetKeys();clearTouch();}
}
