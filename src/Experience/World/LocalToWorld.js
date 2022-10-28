import * as THREE from 'three';
import Experience from '../Experience.js';

export default class LocalToWord {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    this.vecToUse = new THREE.Vector3();
    this.vecToUse2 = new THREE.Vector3();

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('LocalToWord');
    }

    this.debugObject = {
      getWorldPosition: () => this.getWorldPosition(),
    };

    this.debugFolder.add(this.debugObject, 'getWorldPosition');

    this.setCube();
    this.setChild();
  }

  setCube() {
    this.cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.cubeMaterial = new THREE.MeshBasicMaterial({
      color: '#0000ff',
    });

    this.cube = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial);
    this.scene.add(this.cube);

    this.cube.position.set(4, 6, 0);
    // this.cube.rotation.z = 1.2;

    if (!this.debug.active) return;
    this.debugFolder.add(this.cube.position, 'x').min(-5).max(10).step(0.1);
    this.debugFolder.add(this.cube.position, 'y').min(-5).max(10).step(0.1);

    this.debugFolder.add(this.cube.rotation, 'z').min(-5).max(5).step(0.1);
  }

  setChild() {
    this.childGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.childMaterial = new THREE.MeshBasicMaterial({
      color: '#00ff00',
    });

    this.child = new THREE.Mesh(this.childGeometry, this.childMaterial);
    this.cube.add(this.child);

    this.child.position.set(4, 2, 0);
  }

  getWorldPosition() {
    console.log();
    const worldPosition = this.cube.position.clone().add(this.child.position);

    // worldPosition.applyQuaternion(this.cube.quaternion);

    console.log(worldPosition);

    const answer = new THREE.Vector3(0, 0, 0);
    this.child.getWorldPosition(answer);
    console.log(answer);
  }

  update() {}
}
