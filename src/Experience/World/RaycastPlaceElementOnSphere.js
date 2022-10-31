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

    /**
     * Mouse
     */
    this.mouse = new THREE.Vector2();

    this.setSphere();
    this.setupEventListener();
    this.setArrowHelpers();
  }

  setSphere() {
    this.sphereGeometry = new THREE.SphereGeometry(50, 20, 20);
    this.sphereMaterial = new THREE.MeshBasicMaterial({
      color: '#0000ff',
      wireframe: true,
      side: THREE.DoubleSide,
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
      this.arrowHelper.position.copy(intersect[0].point);
      this.arrowHelper.setDirection(intersect[0].face.normal.negate());
    }
  }

  setArrowHelpers() {
    this.arrowHelper = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), this.sphere.position.clone(), 10, 0xffff00);
    this.scene.add(this.arrowHelper);
  }

  setupEventListener() {
    window.addEventListener('click', (event) => {
      this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;

      this.raycast();
      //   console.log(this.mouse);
    });

    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;

      this.raycast();
      //   console.log(this.mouse);
    });
  }

  update() {
    // this.raycaster.setFromCamera(this.mouse, this.experience.camera);
  }
}
