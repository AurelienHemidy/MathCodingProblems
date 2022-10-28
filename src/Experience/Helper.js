import * as THREE from 'three';
import Experience from './Experience.js';

export default class Helper {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.axesHelper = new THREE.AxesHelper(5);

    this.scene.add(this.axesHelper);
  }
}
