import * as THREE from 'three';
import Experience from '../Experience.js';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

export default class Shaders {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.sizes = this.experience.sizes;
    this.camera = this.experience.camera;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Shaders');
    }
    this.debugObject = {
      circleScale: 1,
    };

    this.objectsToTest = [];
    this.raycaster = new THREE.Raycaster();

    this.direction = new THREE.Vector3(0, -50, 0);

    /**
     * Mouse
     */
    this.mouse = new THREE.Vector2();

    this.setSphere();

    this.raycast();
  }

  setSphere() {
    this.sphereGeometry = new THREE.SphereGeometry(5, 20, 20);
    this.sphereMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    this.sphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
    this.scene.add(this.sphere);

    this.objectsToTest.push(this.sphere);

    if (!this.debug.active) return;
    this.debugFolder.add(this.sphere.position, 'x').min(-5).max(5).step(0.1);
    this.debugFolder.add(this.sphere.position, 'y').min(-5).max(5).step(0.1);
  }

  raycast() {
    this.raycaster.setFromCamera(this.mouse, this.camera.instance);

    const intersect = this.raycaster.intersectObjects(this.objectsToTest);

    console.log(intersect[0]);
    if (intersect[0]) {
    }
  }

  setupEventListener() {
    window.addEventListener('mousedown', (event) => {
      this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;

      this.raycast();
      //   console.log(this.mouse);
    });

    // window.addEventListener('mousemove', (event) => {
    //   this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
    //   this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;

    //   this.raycast();
    //   //   console.log(this.mouse);
    // });
  }

  update() {}
}
