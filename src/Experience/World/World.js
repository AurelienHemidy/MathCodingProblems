import Experience from '../Experience.js';
import Helper from '../Helper.js';
import Environment from './Environment.js';
import Floor from './Floor.js';
import Fox from './Fox.js';
import LocalToWord from './LocalToWorld.js';
import LookAtTrigger from './LookAtTrigger.js';
import RadialTrigger from './RadialTrigger.js';

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.helper = new Helper();

    // this.radialTrigger = new RadialTrigger();
    // this.lookAtTrigger = new LookAtTrigger();
    this.localToWorld = new LocalToWord();

    // Wait for resources
    this.resources.on('ready', () => {
      // Setup
      // this.floor = new Floor()
      // this.fox = new Fox()
      // this.environment = new Environment()
    });
  }

  update() {
    // if (this.fox) this.fox.update();
    if (this.radialTrigger) this.radialTrigger.update();
    if (this.lookAtTrigger) this.lookAtTrigger.update();
    if (this.localToWorld) this.localToWorld.update();
  }
}
