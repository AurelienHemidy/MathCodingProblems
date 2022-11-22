import * as THREE from 'three';
import Experience from './Experience.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Camera');
    }

    this.settings = {
      enableOrbitControls: true,
    };

    this.setInstance();
    this.setControls();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100);
    this.instance.position.set(0, 0, 10);
    this.scene.add(this.instance);

    this.debugFolder.add(this.instance.position, 'x', -10, 10, 0.01);
    this.debugFolder.add(this.instance.position, 'y', -10, 10, 0.01);
    this.debugFolder.add(this.instance.position, 'z', -10, 30, 0.01);
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;

    this.debugFolder
      .add(this.settings, 'enableOrbitControls')
      .onChange((isEnable) => (this.controls.enabled = isEnable));
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
