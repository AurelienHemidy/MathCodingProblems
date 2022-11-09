import * as THREE from 'three';
import Experience from '../Experience.js';

export default class SteeringBehaviour {
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
      this.debugFolder = this.debug.ui.addFolder('SteeringBehaviour');
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

    // Vehicle
    this.desired = new THREE.Vector3(0, 0, 0);
    this.steer = new THREE.Vector3(0, 0, 0);
    this.acceleration = new THREE.Vector3(0, 0, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.startPosition = new THREE.Vector3(0, 0, 0);
    this.target = new THREE.Vector3(0, 0, 0);

    this.maxSpeed = 0.2;
    this.maxForce = 0.1;

    this.setPlane();
    this.setVehicle();

    this.setupEventListener();
    this.setArrowHelpers();
  }

  setPlane() {
    this.planeGeometry = new THREE.PlaneGeometry(30, 30);
    this.planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.scene.add(this.plane);

    this.plane.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);

    this.objectsToTest.push(this.plane);
  }

  setVehicle() {
    this.vehicleGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.vehicleMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
    });

    this.vehicle = new THREE.Mesh(this.vehicleGeometry, this.vehicleMaterial);
    this.scene.add(this.vehicle);
  }

  seek(target) {
    this.desired.subVectors(target, this.vehicle.position);

    this.desired.normalize();
    this.desired.multiplyScalar(this.maxSpeed);

    this.steer.subVectors(this.desired, this.velocity);
    this.steer.clampScalar(-this.maxForce, this.maxForce);

    this.applyForce(this.steer);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  raycast() {
    this.raycaster.setFromCamera(this.mouse, this.camera.instance);

    const intersect = this.raycaster.intersectObjects(this.objectsToTest);

    // console.log(intersect[0]);

    if (intersect[0]) {
      this.seek(intersect[0].point);

      this.target.copy(intersect[0].point);
      // console.log('blalba');
    }
  }

  setArrowHelpers() {
    this.arrowHelperVelocity = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), this.vehicle.position, 3, 0xff00ff);
    this.scene.add(this.arrowHelperVelocity);

    this.arrowHelperAcceleration = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      this.vehicle.position,
      3,
      0xff0000
    );
    this.scene.add(this.arrowHelperAcceleration);
  }

  setupEventListener() {
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;

      this.raycast();
    });

    window.addEventListener('mousedown', (event) => {
      this.isMouseDown = true;
      this.maxSpeed = 0.5;
    });
    window.addEventListener('mouseup', (event) => {
      this.isMouseDown = false;
      this.maxSpeed = 0.2;
    });
  }

  updateVehicle() {
    this.velocity.add(this.acceleration);
    this.velocity.clampScalar(-this.maxSpeed, this.maxSpeed);

    // this.arrowHelperAcceleration.setDirection(this.acceleration.clone().normalize());
    // this.arrowHelperVelocity.setDirection(this.velocity.clone().normalize());
    // this.arrowHelperAcceleration.position.copy(this.vehicle.position);
    // this.arrowHelperVelocity.position.copy(this.vehicle.position);

    this.vehicle.position.add(this.velocity);
    this.acceleration.multiplyScalar(0);
  }

  draw() {
    // this.vehicle.position.copy(this.position)
    this.vehicle.lookAt(this.target);
  }

  update() {
    if (this.target.distanceTo(this.vehicle.position) > 0) this.seek(this.target);
    this.updateVehicle();
    this.draw();
  }
}
