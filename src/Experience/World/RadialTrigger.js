import * as THREE from 'three';
import Experience from '../Experience.js';

export default class RadialTrigger {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('RadialTrigger');
    }
    this.debugObject = {
      circleScale: 1,
    };

    this.setCube();
    this.setCircle();
  }

  setCube() {
    this.cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.circleMaterial = new THREE.MeshBasicMaterial({
      color: '#0000ff',
    });

    this.cube = new THREE.Mesh(this.cubeGeometry, this.circleMaterial);
    this.scene.add(this.cube);

    this.cube.position.set(3, 3, 0);

    if (!this.debug.active) return;
    this.debugFolder.add(this.cube.position, 'x').min(-5).max(5).step(0.1);
    this.debugFolder.add(this.cube.position, 'y').min(-5).max(5).step(0.1);
  }

  setCircle() {
    this.circleGeometry = new THREE.CircleGeometry(2, 50);
    this.circleMaterial = new THREE.MeshBasicMaterial({
      color: '#00ff00',
    });

    this.circle = new THREE.Mesh(this.circleGeometry, this.circleMaterial);
    this.scene.add(this.circle);

    if (!this.debug.active) return;
    this.debugFolder.add(this.circle.position, 'x').min(-5).max(5).step(0.1);
    this.debugFolder.add(this.circle.position, 'y').min(-5).max(5).step(0.1);
    this.debugFolder
      .add(this.debugObject, 'circleScale')
      .min(1)
      .max(5)
      .step(0.01)
      .onChange((v) => this.circle.scale.set(v, v, v));
  }

  update() {
    const isInside = this.cube.position.distanceTo(this.circle.position) < this.circle.scale.length();

    this.circle.material.color = new THREE.Color(isInside ? '#ff0000' : '#00ff00');
  }
}
