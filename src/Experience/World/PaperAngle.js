import * as THREE from 'three';
import Experience from '../Experience.js';
import gsap from 'gsap';

import vertexShader from './shaders/paperAngle/vertex.glsl';
import fragmentShader from './shaders/paperAngle/fragment.glsl';

export default class PaperAngle {
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
      this.debugFolder = this.debug.ui.addFolder('PaperAngle');
    }
    this.settings = {
      progress: 0,
    };

    this.mouse = new THREE.Vector2(0, 0);
    this.prevMouse = new THREE.Vector2(0, 0);

    this.speed = 0;
    this.targetSpeed = 0;

    this.objectsToTest = [];
    this.raycaster = new THREE.Raycaster();

    this.setObject();
    this.setRotationSphere();
    this.centerCameraOnPlane();

    this.mouseClickEvents();
    this.mouseMoveEvent();
  }

  setObject() {
    this.planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 100);
    this.planeMaterial = new THREE.ShaderMaterial({
      //   wireframe: true,
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
        uCenter: {
          value: new THREE.Matrix4(),
        },
        uInvCenter: {
          value: new THREE.Matrix4(),
        },
        uRange: {
          value: 0.2,
        },
        uRadius: {
          value: 0.05,
        },
        uMouse: {
          value: new THREE.Vector2(0, 0),
        },
        uResolution: {
          value: new THREE.Vector4(0, 0, 0),
        },
        uTexture: {
          value: new THREE.TextureLoader().load('/textures/dirt/planeTex.jpg'),
        },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.scene.add(this.plane);

    this.objectsToTest.push(this.plane);

    this.debugFolder.add(this.planeMaterial.uniforms.uRadius, 'value', 0, 100, 0.01).name('radius');
    this.debugFolder.add(this.planeMaterial.uniforms.uRange, 'value', 0, 300, 0.01).name('range');
  }

  setRotationSphere() {
    this.rotationSphereGeom = new THREE.IcosahedronGeometry(0.1, 10);
    this.rotationSphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
    });

    this.sphereRotation = new THREE.Mesh(this.rotationSphereGeom, this.rotationSphereMaterial);
    this.scene.add(this.sphereRotation);

    this.sphereRotation.position.z = 0.1;

    this.sphereRotation.rotateOnAxis(new THREE.Vector3(-1, 0, 0), 1.5);
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

    // console.log(intersect[0]);
    if (intersect.length > 0) {
      // console.log(intersect[0]);

      this.sphereRotation.position.x = intersect[0].point.x;
      this.sphereRotation.position.y = intersect[0].point.y;

      this.planeMaterial.uniforms.uMouse.value = intersect[0].uv;
    }
  }

  mouseClickEvents() {
    window.addEventListener('mousedown', () => {
      this.planeMaterial.uniforms.uDirection.value = 0;
      gsap.to(this.planeMaterial.uniforms.uProgress, {
        duration: 0.5,
        // ease: 'Power2.easeOut',
        value: 1,
      });
    });

    window.addEventListener('mouseup', () => {
      this.planeMaterial.uniforms.uDirection.value = 1;
      gsap.to(this.planeMaterial.uniforms.uProgress, {
        duration: 0.5,
        // ease: 'Power2.easeOut',
        value: 0,
      });
    });
  }

  mouseMoveEvent() {
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;

      this.planeMaterial.uniforms.uMouse.value = this.mouse;

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
  }

  update() {
    this.planeMaterial.uniforms.uTime.value = this.time.elapsed * 0.01;

    this.sphereRotation.updateMatrixWorld();

    this.planeMaterial.uniforms.uCenter.value.multiplyMatrices(
      this.camera.matrixWorldInverse,
      this.sphereRotation.matrixWorld
    );
    // this.planeMaterial.uniforms.uInvCenter.value.getInverse(this.planeMaterial.uniforms.uCenter.value);
    this.planeMaterial.uniforms.uInvCenter.value.copy(this.planeMaterial.uniforms.uCenter.value).invert();
    // this.getSpeed();
  }
}
