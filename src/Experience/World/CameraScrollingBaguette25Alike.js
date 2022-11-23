import * as THREE from 'three';
import Experience from '../Experience.js';
import gsap from 'gsap';

import vertexShader from './shaders/cameraScrolling/vertex.glsl';
import fragmentShader from './shaders/cameraScrolling/fragment.glsl';

export default class CameraScrolingBehaviour {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.sizes = this.experience.sizes;
    this.camera = this.experience.camera.instance;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('CameraScrolingBehaviour');
    }
    this.settings = {
      numberOfWindows: 30,
      progress: 0,
    };

    this.isMouseDown = false;

    this.mouse = new THREE.Vector2(0, 0);
    this.prevMouse = new THREE.Vector2(0, 0);

    this.cameraTarget = new THREE.Vector3(0, 0, 0);
    this.roundedCameraTarget = new THREE.Vector3(this.camera.position.x, this.camera.position.y, 0);

    this.speed = 0;
    this.targetSpeed = 0;

    this.objectsToTest = [];
    this.raycaster = new THREE.Raycaster();

    this.setBackground();
    this.setWindows();
    // this.centerCameraOnPlane();

    this.mouseClickEvents();
    this.mouseMoveEvent();
  }

  setBackground() {
    this.planeGeometry = new THREE.PlaneGeometry(5, 6, 5, 6);
    this.planeMaterial = new THREE.ShaderMaterial({
      // wireframe: true,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {
          value: 0,
        },
        uProgress: {
          value: this.settings.progress,
        },
        uDirection: {
          value: 0,
        },
        uSpeed: {
          value: 0,
        },
        uMouse: {
          value: new THREE.Vector2(0, 0),
        },
        uResolution: {
          value: new THREE.Vector4(0, 0, 0),
        },
        uTexture: {
          value: new THREE.TextureLoader().load('/textures/dirt/building_windows.jpg'),
        },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.scene.add(this.plane);

    this.debugFolder.add(this.plane.rotation, 'y', -Math.PI, Math.PI, 0.01);

    this.objectsToTest.push(this.plane);
  }

  setWindows() {
    this.windowGeom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    this.windowMaterial = new THREE.MeshBasicMaterial({
      color: 0x808080,
    });

    this.windows = new THREE.InstancedMesh(this.windowGeom, this.windowMaterial, this.settings.numberOfWindows);

    this.scene.add(this.windows);

    this.dummy = new THREE.Object3D();

    let rows = 6;
    let cols = 5;

    for (let i = 0; i < this.windows.count; i++) {
      let col = Math.floor(i / (cols + 1));
      let row = Math.floor(i % rows);

      this.dummy.position.set(col, -row, 0);
      this.dummy.updateMatrix();
      this.windows.setMatrixAt(i, this.dummy.matrix);
    }

    // this.objectsToTest.push(this.windows);

    this.windows.position.set(-2, 2.5, 0);
  }

  centerCameraOnPlane() {
    const cameraDist = this.camera.position.z;
    const height = 2;

    this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (cameraDist * 2));

    // if (this.sizes.width / this.sizes.height > 1) {
    //   this.plane.scale.x = this.camera.aspect;
    // } else {
    //   this.plane.scale.y = 1 / this.camera.aspect;
    // }

    this.camera.updateProjectionMatrix();
  }

  raycast() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersect = this.raycaster.intersectObjects(this.objectsToTest);

    if (intersect.length > 0) {
      //   console.log(intersect[0]);
      this.planeMaterial.uniforms.uMouse.value = intersect[0].uv;
    }
  }

  mouseClickEvents() {
    window.addEventListener('mousedown', (event) => {
      this.isMouseDown = true;

      this.planeMaterial.uniforms.uDirection.value = 0;
      gsap.to(this.planeMaterial.uniforms.uProgress, {
        duration: 0.5,
        // ease: 'Power2.easeOut',
        value: 1,
      });
      gsap.to(this.plane.rotation, {
        duration: 0.5,
        // ease: 'Power2.easeOut',
        y: 0,
      });

      gsap.to(this.camera.position, {
        duration: 1,
        ease: 'Power2.easeOut',
        z: 6,
      });
    });

    window.addEventListener('mouseup', (event) => {
      this.isMouseDown = false;

      this.planeMaterial.uniforms.uDirection.value = 1;
      gsap.to(this.planeMaterial.uniforms.uProgress, {
        duration: 0.5,
        // ease: 'Power2.easeOut',
        value: 0,
      });
      gsap.to(this.camera.position, {
        duration: 1,
        ease: 'Power2.easeOut',
        z: 4,
      });
    });
  }

  mouseMoveEvent() {
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;

      const rotation = (event.clientX / this.sizes.width) * 0.1 - 0.05;
      console.log(rotation);

      if (!this.isMouseDown) {
        gsap.to(this.plane.rotation, {
          duration: 1,
          // ease: 'Power2.easeOut',
          y: Math.PI * rotation,
        });
      }

      this.prevMouse.x = this.mouse.x;
      this.prevMouse.y = this.mouse.y;

      this.raycast();
    });
  }

  getSpeed() {
    this.speed = Math.sqrt((this.prevMouse.x - this.mouse.x) ** 2 + (this.prevMouse.y - this.mouse.y) ** 2);

    this.targetSpeed += 0.1 * (this.speed - this.targetSpeed);

    // console.log(this.speed);
    this.planeMaterial.uniforms.uSpeed.value = this.targetSpeed;

    this.prevMouse.x = this.mouse.x;
    this.prevMouse.y = this.mouse.y;

    // console.log(this.targetSpeed);
  }

  update() {
    this.planeMaterial.uniforms.uTime.value = this.time.elapsed * 0.01;

    this.roundedCameraTarget = this.camera.position.clone().round();
    // this.roundedCameraTarget = new THREE.Vector3(this.camera.position.x );

    if (this.speed < 0.002 && this.roundedCameraTarget.distanceTo(this.camera.position) < 0.5)
      this.camera.position.lerp(
        new THREE.Vector3(this.roundedCameraTarget.x, this.roundedCameraTarget.y + 0.5, 4),
        0.01
      );
  }
}
