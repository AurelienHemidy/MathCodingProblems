import * as THREE from 'three';
import Experience from '../Experience.js';
import gsap from 'gsap';

import vertexShader from './shaders/mirrorRenderTarget/vertex.glsl';
import fragmentShader from './shaders/mirrorRenderTarget/fragment.glsl';

export default class MirrorRenderTarget {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.sizes = this.experience.sizes;
    this.camera = this.experience.camera.instance;
    this.renderer = this.experience.renderer.instance;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('MirrorRenderTarget');
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
    this.centerCameraOnPlane();
    this.setSecondScene();
    this.setBackground();

    this.mouseClickEvents();
    this.mouseMoveEvent();
  }

  setSecondScene() {
    this.rtWidth = 512;
    this.rtHeight = 512;
    this.renderTarget = new THREE.WebGLRenderTarget(this.rtWidth, this.rtHeight);

    this.rtFov = 75;
    this.rtAspect = this.rtWidth / this.rtHeight;
    this.rtNear = 0.1;
    this.rtFar = 10;
    this.rtCamera = new THREE.PerspectiveCamera(this.rtFov, this.rtAspect, this.rtNear, this.rtFar);

    this.scene.add(this.rtCamera);

    this.rtCamera.lookAt(this.mesh.position);
    // this.rtCamera.position.z = 3;
    // this.rtCamera.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI);

    this.cameraHelper = new THREE.CameraHelper(this.rtCamera);
    // this.scene.add(this.cameraHelper);
  }

  setBackground() {
    this.planeGeometry2 = new THREE.PlaneGeometry(10, 5);
    this.planeMaterial2 = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('/textures/dirt/stars.jpg'),
    });

    this.plane2 = new THREE.Mesh(this.planeGeometry2, this.planeMaterial2);

    this.plane2.position.z = -5;
    this.plane2.position.y = 2.5;
    this.scene.add(this.plane2);
  }

  setObject() {
    this.planeGeometry = new THREE.PlaneGeometry(20, 20, 100, 100);
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
        uMouse: {
          value: new THREE.Vector2(0, 0),
        },
        uResolution: {
          value: new THREE.Vector4(0, 0, 0),
        },
        uTexture: {
          value: new THREE.TextureLoader().load('/textures/dirt/water.jpg'),
        },
        uDisplacement: {
          value: new THREE.TextureLoader().load('/textures/dirt/water3.jpg'),
        },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.scene.add(this.plane);

    this.plane.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);

    this.objectsToTest.push(this.plane);

    const geom = new THREE.SphereGeometry(0.5, 50, 50);
    const mat = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('/textures/dirt/water.jpg'),
    });
    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.position.z = -3;
    this.mesh.position.y = 1;
    this.scene.add(this.mesh);

    this.debugFolder.add(this.mesh.position, 'x', -2, 2, 0.01).name('mirrorMeshX');
    this.debugFolder.add(this.mesh.position, 'y', -2, 2, 0.01).name('mirrorMeshX');
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

      //   this.planeMaterial.uniforms.uMouse.value = this.mouse;

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
    this.getSpeed();

    // draw render target scene to render target
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(this.scene, this.rtCamera);
    this.renderer.setRenderTarget(null);
    this.planeMaterial.uniforms.uTexture.value = this.renderTarget.texture;

    this.mesh.rotation.x = this.time.elapsed * 0.0001;
    this.mesh.rotation.y = this.time.elapsed * 0.0001;

    this.cameraHelper.update();
  }
}
