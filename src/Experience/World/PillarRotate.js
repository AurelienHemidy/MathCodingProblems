import * as THREE from 'three';
import Experience from '../Experience.js';
import gsap from 'gsap';

import vertexShader from './shaders/pillarRotate/vertex.glsl';
import fragmentShader from './shaders/pillarRotate/fragment.glsl';

export default class PillarRotate {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.sizes = this.experience.sizes;
    this.camera = this.experience.camera.instance;

    this.numberOfImages = 5;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('PillarRotate');
    }
    this.settings = {
      progress: 0,
      move: 0,
    };

    this.mouse = new THREE.Vector2(0, 0);
    this.prevMouse = new THREE.Vector2(0, 0);

    this.speed = 0;
    this.targetSpeed = 0;

    this.scroll = 0;
    this.scrollTarget = 0;
    this.currentScroll = 0;

    this.objectsToTest = [];
    this.raycaster = new THREE.Raycaster();

    this.setObject();
    this.centerCameraOnPlane();

    this.mouseClickEvents();
    this.mouseMoveEvent();
  }

  setObject() {
    this.planeGeometry = new THREE.PlaneGeometry(2, 1);
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
          value: new THREE.TextureLoader().load('/textures/dirt/stars.jpg'),
        },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    // this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.meshes = [];

    for (let i = 0; i < this.numberOfImages; i++) {
      const mesh = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
      this.meshes.push(mesh);
      this.scene.add(mesh);

      //   mesh.position.x += 1.1 * i;

      mesh.position.x = Math.sin(Math.PI * 2 * (i / this.numberOfImages) + this.settings.move) * 2;
      mesh.position.z = Math.cos(Math.PI * 2 * (i / this.numberOfImages) + this.settings.move) * 2;

      mesh.rotation.y += Math.PI * 2 * (i / this.numberOfImages);
    }

    this.debugFolder.add(this.settings, 'move', -5, 5, 0.01).onChange((e) => {
      this.meshes.forEach((mesh, i) => {
        mesh.position.x = Math.sin(Math.PI * 2 * (i / this.numberOfImages) + e) * 2;
        mesh.position.z = Math.cos(Math.PI * 2 * (i / this.numberOfImages) + e) * 2;
      });
    });
    // this.scene.add(this.plane);

    // this.objectsToTest.push(this.plane);
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

    document.addEventListener('mousewheel', (e) => {
      this.scrollTarget += Math.sign(e.deltaY) * 0.1;
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

  updateMeshes() {
    this.meshes.forEach((mesh, i) => {
      mesh.position.y = (-Math.PI * 2 * (i / this.numberOfImages) + this.currentScroll) * 2;
      mesh.position.x = Math.sin(Math.PI * 2 * (i / this.numberOfImages) - this.currentScroll) * 2;
      mesh.position.z = Math.cos(Math.PI * 2 * (i / this.numberOfImages) - this.currentScroll) * 2;
      mesh.rotation.y = Math.PI * 2 * (i / this.numberOfImages) - this.currentScroll;
      //   if (i === 2) console.log(mesh.position.y);
    });
  }

  // Arrondir au float le plus prhce d'un mutliple de 2.5

  update() {
    this.planeMaterial.uniforms.uTime.value = this.time.elapsed * 0.01;
    this.getSpeed();

    this.scroll += (this.scrollTarget - this.scroll) * 0.1;

    this.scroll *= 0.9;
    this.scrollTarget *= 0.9;

    this.currentScroll += this.scroll * 0.3;

    this.updateMeshes();
  }
}
