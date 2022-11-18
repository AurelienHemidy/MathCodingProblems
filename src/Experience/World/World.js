import Experience from '../Experience.js';
import Helper from '../Helper.js';
import CameraFollowPath from './CameraFollowPath.js';
import ElementAroundSphere from './ElementAroundSphere.js';
import Environment from './Environment.js';
import Floor from './Floor.js';
import Fox from './Fox.js';
import LocalToWord from './LocalToWorld.js';
import LookAtTrigger from './LookAtTrigger.js';
import PaperAngle from './PaperAngle.js';
import PlaneDistortion from './PlaneDistortion.js';
import RadialTrigger from './RadialTrigger.js';
import RaycastPlaceElementOnSphere from './RaycastPlaceElementOnSphere.js';
import Shaders from './Shaders.js';
import SteeringBehaviour from './SteeringBehaviour.js';

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    // this.helper = new Helper();

    // this.radialTrigger = new RadialTrigger();
    // this.lookAtTrigger = new LookAtTrigger();
    // this.localToWorld = new LocalToWord();
    // this.raycastPlaceElementOnSphere = new RaycastPlaceElementOnSphere();
    // this.steeringBehaviour = new SteeringBehaviour();
    // this.shaders = new Shaders();
    // this.planeDistortion = new PlaneDistortion();
    this.paperAngle = new PaperAngle();
    // this.elementAroundSphere = new ElementAroundSphere();

    // Wait for resources
    this.resources.on('ready', () => {
      // this.cameraFollowPath = new CameraFollowPath();
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
    if (this.raycastPlaceElementOnSphere) this.raycastPlaceElementOnSphere.update();
    if (this.steeringBehaviour) this.steeringBehaviour.update();
    if (this.shaders) this.shaders.update();
    if (this.cameraFollowPath) this.cameraFollowPath.update();
    if (this.elementAroundSphere) this.elementAroundSphere.update();
    if (this.planeDistortion) this.planeDistortion.update();
    if (this.paperAngle) this.paperAngle.update();
  }
}
