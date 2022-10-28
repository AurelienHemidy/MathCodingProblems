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

    this.setVectors();
  }

  setCube() {
    this.cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.cubeMaterial = new THREE.MeshBasicMaterial({
      color: '#0000ff',
    });

    this.cube = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial);
    this.scene.add(this.cube);

    this.cube.position.set(2, 3, 0);
    this.cube.rotation.z = 0.5;

    if (!this.debug.active) return;
    this.debugFolder.add(this.cube.position, 'x').min(-5).max(10).step(0.1);
    this.debugFolder.add(this.cube.position, 'y').min(-5).max(10).step(0.1);

    this.debugFolder.add(this.cube.rotation, 'z').min(-5).max(5).step(0.1);
  }

  setChild() {
    this.childGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.childMaterial = new THREE.MeshBasicMaterial({
      color: '#00ff00',
      transparent: true,
    });

    this.child = new THREE.Mesh(this.childGeometry, this.childMaterial);
    this.cube.add(this.child);

    this.child.position.set(3, 1, 0);

    if (!this.debug.active) return;
    this.debugFolder.add(this.child.material, 'opacity').min(0).max(1).step(0.01);
  }

  setVectors() {
    this.arrowHelperCubeX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), this.cube.position.clone(), 2, 0xffff00);
    this.scene.add(this.arrowHelperCubeX);
    this.arrowHelperCubeY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), this.cube.position.clone(), 2, 0xffff00);
    this.scene.add(this.arrowHelperCubeY);

    this.arrowHelperCubeLocalPositionFromZeroX = new THREE.ArrowHelper(
      new THREE.Vector3(1, 1, 0),
      new THREE.Vector3(0, 0, 0),
      2,
      0xff0000
    );
    this.scene.add(this.arrowHelperCubeLocalPositionFromZeroX);

    this.arrowHelperCubeLocalPositionFromZeroY = new THREE.ArrowHelper(
      new THREE.Vector3(1, 1, 0),
      new THREE.Vector3(0, 0, 0),
      2,
      0x00ff00
    );
    this.scene.add(this.arrowHelperCubeLocalPositionFromZeroY);

    this.arrowHelperCubeLocalPositionFromZero = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 0),
      this.cube.position,
      2,
      0x0000ff
    );
    this.scene.add(this.arrowHelperCubeLocalPositionFromZero);
  }

  getWorldPosition() {
    const basisX = new THREE.Vector3(1, 0, 0);
    basisX.applyQuaternion(this.cube.quaternion);

    const basisY = new THREE.Vector3(0, 1, 0);
    basisY.applyQuaternion(this.cube.quaternion);

    this.arrowHelperCubeX.setDirection(basisX);
    this.arrowHelperCubeY.setDirection(basisY);
    this.arrowHelperCubeLocalPositionFromZeroX.setDirection(basisX.clone().multiply(this.child.position));
    this.arrowHelperCubeLocalPositionFromZeroX.setLength(this.child.position.x);

    this.arrowHelperCubeLocalPositionFromZeroY.setDirection(basisY.clone().multiply(this.child.position));
    this.arrowHelperCubeLocalPositionFromZeroY.setLength(this.child.position.y);

    this.arrowHelperCubeLocalPositionFromZero.setDirection(
      basisX.clone().multiply(this.child.position).add(basisY.clone().multiply(this.child.position)).normalize()
    );
    this.arrowHelperCubeLocalPositionFromZero.setLength(
      basisX.clone().multiply(this.child.position).add(basisY.clone().multiply(this.child.position)).length()
    );

    this.childGeometry2 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    this.childMaterial2 = new THREE.MeshBasicMaterial({
      color: '#00ffff',
    });

    this.child2 = new THREE.Mesh(this.childGeometry2, this.childMaterial2);
    this.scene.add(this.child2);

    const x = basisX
      .clone()
      .multiply(this.child.position)
      .add(basisY.clone().multiply(this.child.position))
      .add(this.cube.position).x;

    const y = basisX
      .clone()
      .multiply(this.child.position)
      .add(basisY.clone().multiply(this.child.position))
      .add(this.cube.position).y;

    const finalvector = new THREE.Vector3(
      basisX.clone().multiply(this.child.position).x,
      basisX.clone().multiply(this.child.position).multiplyScalar(this.child.position.x).y,
      0
    ).add(new THREE.Vector3(basisY.clone().x, basisY.clone().multiply(this.child.position).y, 0));

    finalvector.add(this.cube.position);
    this.child2.position.set(finalvector.x, finalvector.y, 0);

    console.log(finalvector);

    const answer = new THREE.Vector3(0, 0, 0);
    this.child.getWorldPosition(answer);
    console.log('real answer', answer);

    const answer2 = new THREE.Vector3(0, 0, 0);
    this.cube.getWorldPosition(answer2);
    console.log('real answer2', answer2);
  }

  update() {}
}
