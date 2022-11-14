import * as THREE from 'three';
import { Mesh } from 'three';
import { lerp } from 'three/src/math/mathutils.js';
import Experience from '../Experience.js';

export default class ElementAroundSphere {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.time = this.experience.time;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('ElementAroundSphere');
    }

    // Resource
    this.resource = this.resources.items.cameraModel;

    this.debugObject = {};

    this.setEarth();
    this.setMoon();
  }

  setEarth() {
    this.earthGeometry = new THREE.SphereGeometry(2, 50, 50);
    this.earthMaterial = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
    });

    this.earth = new Mesh(this.earthGeometry, this.earthMaterial);
    this.scene.add(this.earth);
  }

  setMoon() {
    this.moonGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    this.moonaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
    });

    this.moon = new Mesh(this.moonGeometry, this.moonaterial);
    this.scene.add(this.moon);
  }

  update() {
    this.moon.position.x = Math.cos(this.time.elapsed * 0.0005) * 3;
    this.moon.position.z = Math.sin(this.time.elapsed * 0.0005) * 3;
    // this.moon.position.y = Math.sin(this.time.elapsed * 0.0005) * 5;
    // this.moon.position.y = 5;
    this.moon.lookAt(this.earth.position);
    // this.moon.position.z = Math.sin(this.time.elapsed * 0.005) * 3;
  }
}
