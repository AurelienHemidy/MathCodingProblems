import * as THREE from 'three';
import { lerp } from 'three/src/math/mathutils.js';
import Experience from '../Experience.js';

export default class CameraFollowPath {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.time = this.experience.time;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Camera');
    }

    // Resource
    this.resource = this.resources.items.cameraModel;

    this.debugObject = {
      lerpValue: 0,
    };

    this.lerpValue = 0;

    //     this.setGeometry();
    //     this.setTextures();
    //     this.setMaterial();
    //     this.setMesh();
    this.setCamera();
    this.setAnimation();
    this.setupEventListener();
  }

  setCamera() {
    this.model = this.resource.scene;
    this.scene.add(this.model);

    this.experience.camera.instance = this.model.getObjectByName('Camera');

    // console.log();
  }

  setAnimation() {
    this.animation = {};

    // Mixer
    this.animation.mixer = new THREE.AnimationMixer(this.model);

    // Actions
    this.animation.actions = {};

    this.animation.actions.camera = this.animation.mixer.clipAction(this.resource.animations[2]);

    this.animation.actions.current = this.animation.actions.camera;
    this.animation.actions.current.clampWhenFinished = true;

    this.animation.actions.current.play();
    this.animation.actions.current.timeScale = 0;

    this.debugFolder
      .add(this.debugObject, 'lerpValue')
      .min(-1)
      .max(1)
      .step(0.01)
      .onChange((e) => {
        this.animation.actions.camera.setEffectiveTimeScale(e);
      });
  }

  clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  setupEventListener() {
    window.addEventListener('wheel', (event) => {
      const signAnimationValue = Math.sign(event.deltaY);

      this.lerpValue += signAnimationValue * 0.1;

      this.lerpValue = this.clamp(this.lerpValue, -1, 1);

      // Make animation go forward within a range of (1, - 1) force
      this.animation.actions.camera.setEffectiveTimeScale(this.lerpValue);
    });
  }

  easingAnimation(lerpValue) {
    if (lerpValue > 0) {
      this.lerpValue -= this.lerpValue * 0.04;
      this.lerpValue = this.clamp(this.lerpValue, 0, 1);
      this.animation.actions.camera.setEffectiveTimeScale(this.lerpValue);
    }
    if (lerpValue < 0) {
      this.lerpValue += Math.abs(this.lerpValue) * 0.04;
      this.lerpValue = this.clamp(this.lerpValue, -1, 0);
      this.animation.actions.camera.setEffectiveTimeScale(this.lerpValue);
    }
  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.001);
    this.easingAnimation(this.lerpValue);
  }
}
