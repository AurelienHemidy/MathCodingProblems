import Experience from '../Experience.js';
import Helper from '../Helper.js';
import CameraFollowPath from './CameraFollowPath.js';
import CameraScrolingBehaviour from './CameraScrollingBaguette25Alike.js';
import CanvasTextureGenerator from './CanvasTextureGenerator.js';
import ElementAroundSphere from './ElementAroundSphere.js';
import Environment from './Environment.js';
import Fire from './Fire.js';
import Floor from './Floor.js';
import Fox from './Fox.js';
import LocalToWord from './LocalToWorld.js';
import LookAtTrigger from './LookAtTrigger.js';
import MirrorRenderTarget from './MirrorRenderTarget.js';
import ObjectSampling from './ObjectSampling.js';
import PaperAngle from './PaperAngle.js';
import PillarRotate from './PillarRotate.js';
import PlaneDistortion from './PlaneDistortion.js';
import RadialTrigger from './RadialTrigger.js';
import RaycastPlaceElementOnSphere from './RaycastPlaceElementOnSphere.js';
import Ripples from './Ripples.js';
import Sand from './Sand.js';
import Shaders from './Shaders.js';
import SteeringBehaviour from './SteeringBehaviour.js';
import TrailTexture from './TrailTexture.js';
import Vinyl from './Vinyl.js';
import Water from './Water.js';

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.helper = new Helper();

    // this.radialTrigger = new RadialTrigger();
    // this.lookAtTrigger = new LookAtTrigger();
    // this.localToWorld = new LocalToWord();
    // this.raycastPlaceElementOnSphere = new RaycastPlaceElementOnSphere();
    // this.steeringBehaviour = new SteeringBehaviour();
    // this.shaders = new Shaders();
    // this.planeDistortion = new PlaneDistortion();
    // this.paperAngle = new PaperAngle();
    // this.ripples = new Ripples();
    // this.water = new Water();

    // this.cameraScrolling = new CameraScrolingBehaviour();
    // this.mirrorRenderTarget = new MirrorRenderTarget();
    this.sand = new Sand();
    // this.trailTexture = new TrailTexture();

    // this.elementAroundSphere = new ElementAroundSphere();

    // this.canvasTextureGenerator = new CanvasTextureGenerator();

    // this.pillarRotate = new PillarRotate();

    // this.fire = new Fire();

    // Wait for resources
    this.resources.on('ready', () => {
      // this.vinyl = new Vinyl();
      // this.objectSampling = new ObjectSampling();
      // this.cameraFollowPath = new CameraFollowPath();
      // Setup
      // this.floor = new Floor()
      // this.fox = new Fox()
      this.environment = new Environment();
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
    if (this.ripples) this.ripples.update();
    if (this.water) this.water.update();
    if (this.cameraScrolling) this.cameraScrolling.update();
    if (this.mirrorRenderTarget) this.mirrorRenderTarget.update();
    if (this.trailTexture) this.trailTexture.update();
    if (this.objectSampling) this.objectSampling.update();
    if (this.canvasTextureGenerator) this.canvasTextureGenerator.update();
    if (this.pillarRotate) this.pillarRotate.update();
    if (this.vinyl) this.vinyl.update();
    if (this.fire) this.fire.update();
    if (this.sand) this.sand.update();
  }
}
