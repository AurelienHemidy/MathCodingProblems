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
      enableOrbitControlsZoom: false,
      checkCameraPosition: () => console.log(this.instance.position),
    };

    this.cameraMaxClamp = new THREE.Vector3(2, 2.5, 5);
    this.cameraMinClamp = new THREE.Vector3(-2, -2.5, 4);

    this.setInstancePerspective();
    // this.setInstanceOrtho();
    this.setControls();
    // this.setGridCamera();
  }

  setInstancePerspective() {
    this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100);
    this.instance.position.set(0, 0, 10);
    this.scene.add(this.instance);

    this.debugFolder.add(this.instance.position, 'x', -10, 10, 0.01);
    this.debugFolder.add(this.instance.position, 'y', -10, 10, 0.01);
    this.debugFolder.add(this.instance.position, 'z', -10, 30, 0.01);
    this.debugFolder.add(this.settings, 'checkCameraPosition');
  }

  setInstanceOrtho() {
    let frustrumSize = this.sizes.height;
    let aspect = this.sizes.width / this.sizes.height;
    this.instance = new THREE.OrthographicCamera(
      (frustrumSize * aspect) / -2,
      (frustrumSize * aspect) / 2,
      frustrumSize / 2,
      frustrumSize / -2,
      -1000,
      1000
    );
    this.instance.position.set(0, 0, 2);
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enabled = false;

    this.debugFolder
      .add(this.settings, 'enableOrbitControls')
      .onChange((isEnable) => (this.controls.enabled = isEnable));
    this.debugFolder
      .add(this.settings, 'enableOrbitControlsZoom')
      .onChange((isEnable) => (this.controls.enableZoom = isEnable));
  }

  setGridCamera() {
    this.controls.autoRotate = false;
    this.controls.enableRotate = false;
    this.controls.enableZoom = false;

    this.controls.enableDamping = true;
    this.controls.minPolarAngle = 0;
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
    };

    this.controls.dampingFactor = 0.05;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    if (this.controls) this.controls.update();

    // this.instance.position.clamp(this.cameraMinClamp, this.cameraMaxClamp);
    // this.instance.rotation.set(0, 0, 0);
  }
}
