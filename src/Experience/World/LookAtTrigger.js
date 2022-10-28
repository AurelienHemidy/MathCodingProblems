import * as THREE from 'three';
import Experience from '../Experience.js';

export default class LookAtTrigger {
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
      this.debugFolder = this.debug.ui.addFolder('RadialTrigger');
    }
    this.debugObject = {
      circleScale: 1,
    };

    this.setCube();
    this.setLookAtTarget();
    this.setVectors();
    // this.setCircle();
  }

  setCube() {
    this.cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.circleMaterial = new THREE.MeshBasicMaterial({
      color: '#0000ff',
    });

    this.cube = new THREE.Mesh(this.cubeGeometry, this.circleMaterial);
    this.scene.add(this.cube);

    this.cube.position.set(-3, -3, 0);

    if (!this.debug.active) return;
    this.debugFolder.add(this.cube.position, 'x').min(-5).max(5).step(0.1);
    this.debugFolder.add(this.cube.position, 'y').min(-5).max(5).step(0.1);

    this.debugFolder.add(this.cube.rotation, 'z').min(-5).max(5).step(0.1);
  }

  setLookAtTarget() {
    this.lookAtTargetGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.lookAtTargetMaterial = new THREE.MeshBasicMaterial({
      color: '#0000ff',
    });

    this.lookAtTarget = new THREE.Mesh(this.lookAtTargetGeometry, this.lookAtTargetMaterial);
    this.scene.add(this.lookAtTarget);

    this.lookAtTarget.position.set(3, 3, 0);

    if (!this.debug.active) return;
    // this.debugFolder.add(this.cube.position, 'x').min(-5).max(5).step(0.1);
    // this.debugFolder.add(this.cube.position, 'y').min(-5).max(5).step(0.1);
  }

  setVectors() {
    this.arrowHelperCube = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), this.cube.position.clone(), 2, 0xffff00);
    this.scene.add(this.arrowHelperCube);

    this.arrowHelperlookAtTrigger = new THREE.ArrowHelper(
      this.lookAtTarget.position.clone().sub(this.cube.position.clone()).normalize(),
      this.cube.position.clone().normalize(),
      2,
      0xff00ff
    );
    this.scene.add(this.arrowHelperlookAtTrigger);
  }

  update() {
    const playerLookDir = new THREE.Vector3(1, 0, 0);
    playerLookDir.applyQuaternion(this.cube.quaternion);

    this.arrowHelperCube.position.copy(this.cube.position);
    this.arrowHelperCube.setDirection(playerLookDir.normalize());

    this.arrowHelperlookAtTrigger.position.copy(this.cube.position);
    this.arrowHelperlookAtTrigger.setDirection(
      this.lookAtTarget.position.clone().sub(this.cube.position.clone()).normalize()
    );

    this.vecToUse.copy(this.lookAtTarget.position.clone().sub(this.cube.position.clone())).normalize();
    this.vecToUse2.copy(playerLookDir).normalize();

    // console.log(
    //   this.vecToUse.dot(this.vecToUse2) > 0.5 && this.vecToUse.dot(this.vecToUse2) <= 1
    //     ? 'Looking at the target'
    //     : 'Looking away from the target'
    // );

    const isLooking = this.vecToUse.dot(this.vecToUse2) > 0.5 && this.vecToUse.dot(this.vecToUse2) <= 1;

    this.cube.material.color = new THREE.Color(isLooking ? 0x00ff00 : 0xff0000);

    // console.log(this.vecToUse.dot(this.vecToUse2));
  }
}
