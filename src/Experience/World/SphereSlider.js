import * as THREE from 'three';
import Experience from '../Experience.js';
import gsap from 'gsap';

import vertexShader from './shaders/sphereSlider/vertex.glsl';
import fragmentShader from './shaders/sphereSlider/fragment.glsl';

export default class SphereSlider {
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
      this.debugFolder = this.debug.ui.addFolder('SphereSlider');
    }
    this.settings = {
      progress: 1,
      isTransitionFinished: true,
    };

    this.test = 0;

    this.debugFolder.add(this.settings, 'progress', 0, 1, 0.01);

    this.mouse = new THREE.Vector2(0, 0);
    this.prevMouse = new THREE.Vector2(0, 0);
    this.isMouseDown = false;

    this.speed = 0;
    this.targetSpeed = 0;

    this.scroll = 0;
    this.targetScroll = 0;
    this.currentScroll = 0;
    this.direction = 0;

    this.touchX = 0;
    this.lastTouchX = 0;

    this.objectsToTest = [];
    this.raycaster = new THREE.Raycaster();

    this.meshes = [];
    this.meshesProgresses = [];
    this.nbOfProjects = 10;

    this.setProjectsCards();
    this.centerCameraOnPlane();

    this.mouseClickEvents();
    this.mouseMoveEvent();

    // gsap.to(this.settings, {
    //   progress: 1,
    //   duration: 2,
    //   delay: 0.2,
    //   ease: 'cubic-bezier(1,.04,1,-0.92)',
    //   onComplete: () => {
    //     this.settings.isTransitionFinished = true;
    //   },
    // });
  }

  setProjectsCards() {
    this.planeGeometry = new THREE.PlaneGeometry(0.8, 1);
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

    for (let i = 0; i < this.nbOfProjects; i++) {
      const mesh = new THREE.Mesh(this.planeGeometry, this.planeMaterial);

      this.meshes.push(mesh);

      this.scene.add(mesh);
      this.objectsToTest.push(mesh);

      mesh.position.z = -i * 0.1;
      mesh.position.x = Math.sin(Math.PI * 2 * (i / this.nbOfProjects) * this.settings.progress) * 2.5;
      mesh.position.y = -2.5 + Math.cos(Math.PI * 2 * (i / this.nbOfProjects) * this.settings.progress) * 2.5;
      mesh.rotation.z = -Math.PI * 2 * (i / this.nbOfProjects) * this.settings.progress;
    }
  }

  setObject() {
    this.planeGeometry = new THREE.PlaneGeometry(0.8, 1);
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

    this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.scene.add(this.plane);

    this.objectsToTest.push(this.plane);
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
      this.isMouseDown = true;
      this.planeMaterial.uniforms.uDirection.value = 0;
      gsap.to(this.planeMaterial.uniforms.uProgress, {
        duration: 0.5,
        // ease: 'Power2.easeOut',
        value: 1,
      });
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
      this.planeMaterial.uniforms.uDirection.value = 1;
      gsap.to(this.planeMaterial.uniforms.uProgress, {
        duration: 0.5,
        // ease: 'Power2.easeOut',
        value: 0,
      });
    });

    window.addEventListener('wheel', (e) => {
      this.targetScroll += Math.sign(e.wheelDeltaY) * 0.05;
    });

    window.addEventListener('touchstart', (e) => {
      this.isMouseDown = true;
    });

    window.addEventListener('touchmove', (e) => {
      e.preventDefault();

      this.touchX = e.changedTouches[0].clientX;

      this.direction = Math.sign(this.lastTouchX - this.touchX);
      // this.targetScroll += this.direction * ((Math.PI * 2 * 2.5) / window.innerWidth);

      this.lastTouchX = this.touchX;
    });

    window.addEventListener('touchend', (e) => {
      this.isMouseDown = false;
    });
  }

  mouseMoveEvent() {
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;

      //   this.planeMaterial.uniforms.uMouse.value = this.mouse;

      this.touchX = event.clientX;
      this.direction = Math.sign(this.lastTouchX - this.touchX);
      this.lastTouchX = this.touchX;

      this.raycast();
    });
  }

  updateScroll() {
    if (this.isMouseDown) {
      this.targetScroll += this.direction * 0.05;
    }
  }

  getSpeed() {
    this.speed = Math.sqrt((this.prevMouse.x - this.mouse.x) ** 2 + (this.prevMouse.y - this.mouse.y) ** 2);

    this.targetSpeed += 0.1 * (this.speed - this.targetSpeed);

    // console.log(this.speed);
    this.planeMaterial.uniforms.uSpeed.value = this.targetSpeed;

    this.prevMouse.x = this.mouse.x;
    this.prevMouse.y = this.mouse.y;
  }

  roundToMultiple(number, mutliplier) {
    return Math.round(number / mutliplier) * mutliplier;
  }

  updateMeshes() {
    this.meshes.forEach((mesh, i) => {
      if (!this.settings.isTransitionFinished) {
        mesh.position.x = Math.sin(Math.PI * 2 * (i / this.nbOfProjects) * this.settings.progress) * 2.5;
        mesh.position.y = -2.2 + Math.cos(Math.PI * 2 * (i / this.nbOfProjects) * this.settings.progress) * 2.5;
        mesh.rotation.z = -Math.PI * 2 * (i / this.nbOfProjects) * this.settings.progress;
        return;
      }
      const stickPosition = this.roundToMultiple(this.currentScroll, (Math.PI * 2) / this.nbOfProjects);

      let diff = stickPosition - this.currentScroll;

      let diffEase = Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.0015;

      this.currentScroll += diffEase * 0.4;

      mesh.position.x = Math.sin(Math.PI * 2 * (i / this.nbOfProjects) - this.currentScroll) * 2.5;
      mesh.position.y = -2.2 + Math.cos(Math.PI * 2 * (i / this.nbOfProjects) - this.currentScroll) * 2.5;

      mesh.rotation.z = -Math.PI * 2 * (i / this.nbOfProjects) + this.currentScroll;
      //   if (i === 0) console.log(this.currentScroll);

      //   console.log(this.currentScroll);
    });
  }

  update() {
    this.planeMaterial.uniforms.uTime.value = this.time.elapsed * 0.01;
    this.getSpeed();

    this.updateScroll();

    this.scroll += (this.targetScroll - this.scroll) * 0.1;

    this.scroll *= 0.9;
    this.targetScroll *= 0.9;

    this.currentScroll += this.scroll * 0.3;

    this.updateMeshes();
  }
}
