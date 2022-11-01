import * as THREE from 'three';
import Experience from '../Experience.js';

export default class RaycastPlaceElementOnSphere {
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
      this.debugFolder = this.debug.ui.addFolder('RaycastPlaceElementOnSphere');
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
    this.setupEventListener();
    this.setArrowHelpers();
    this.setBoat();
  }

  setSphere() {
    this.sphereGeometry = new THREE.SphereGeometry(50, 20, 20);
    this.sphereMaterial = new THREE.MeshBasicMaterial({
      color: '#0000ff',
      wireframe: true,
      side: THREE.BackSide,
    });

    this.sphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
    this.scene.add(this.sphere);

    this.objectsToTest.push(this.sphere);

    if (!this.debug.active) return;
    this.debugFolder.add(this.sphere.position, 'x').min(-5).max(5).step(0.1);
    this.debugFolder.add(this.sphere.position, 'y').min(-5).max(5).step(0.1);
  }

  setBoat() {
    this.BoatGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.BoatMaterial = new THREE.MeshBasicMaterial({
      color: '#ff0000',
    });

    this.boat = new THREE.Mesh(this.BoatGeometry, this.BoatMaterial);
    this.scene.add(this.boat);

    this.boat.position.set(0, -50, 0);
    this.experience.camera.instance.position.set(0, -50, 30);
    // this.experience.camera.instance.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.6);
    // this.experience.camera.instance.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), 1.5);
  }

  raycast() {
    this.raycaster.setFromCamera(this.mouse, this.camera.instance);

    const intersect = this.raycaster.intersectObjects(this.objectsToTest);

    console.log(intersect[0]);
    if (intersect[0]) {
      const spherePoint = intersect[0].point;
      const sphereNegateNormal = intersect[0].face.normal.negate();

      // Camera

      // const dir = spherePoint;

      // this.arrowHelper.position.copy(spherePoint);
      // this.arrowHelper.setDirection(sphereNegateNormal);

      // this.boat.position.copy(intersect[0].point);
      this.direction.copy(spherePoint);
      // this.boat.up.copy(intersect[0].face.normal.negate());
      console.log(this.direction.clone().normalize());
      this.targetVector = this.direction.clone().sub(this.boat.position).normalize();

      this.arrowHelper.position.copy(this.boat.position);
      // this.arrowHelper.setDirection(targetVector);
    }
  }

  setArrowHelpers() {
    this.arrowHelper = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), this.sphere.position.clone(), 3, 0xffff00);
    this.scene.add(this.arrowHelper);
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

  update() {
    if (this.boat.position.distanceTo(this.direction) > 1) this.boat.position.add(this.targetVector);
    // this.experience.camera.instance.lookAt(this.boat.position);
    // this.experience.camera.instance.position.lerp(this.boat.position.clone().multiplyScalar(0.5), 0.1);
    // if (this.direction.distanceTo(this.boat.position) === 0) this.boat.position.add(this.direction.normalize());
    // this.raycaster.setFromCamera(this.mouse, this.experience.camera);
    // this.boat.position.add(new THREE.Vector3(this.direction.normalize().x, this.direction.normalize().y, 0));
  }
}
