import * as THREE from 'three';
import Experience from '../Experience.js';
import gsap from 'gsap';

import vertexShader from './shaders/starsBackground/vertex.glsl';
import fragmentShader from './shaders/starsBackground/fragment.glsl';

export default class StarsBackground {
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
      this.debugFolder = this.debug.ui.addFolder('StarsBackground');
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

    // this.colors = ['#a67c00', '#ffbf00', '#ffd447', '#ffe878', '#bf9b30'];
    this.colors = ['#9cafc9', '#668caf', '#306598', '#1d4179'];

    // this.setStars();
    this.setPlaneBackground();
    this.centerCameraOnPlane();

    this.mouseClickEvents();
    this.mouseMoveEvent();
  }

  setStars() {
    const numberOfParticles = 5000;

    const particlesPosition = new Float32Array(numberOfParticles * 3);
    const particlesDir = new Float32Array(numberOfParticles * 3);
    const particlesColor = new Float32Array(numberOfParticles * 3);

    this.particleGeometry = new THREE.BufferGeometry();
    this.particleMaterial = new THREE.ShaderMaterial({
      //   wireframe: true,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      //   depthTest: false,
      //   depthWrite: false,
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
        uHover: {
          value: 0,
        },
        uMouse: {
          value: new THREE.Vector3(0, 0, 0),
        },
        uMouseBehind: {
          value: new THREE.Vector3(0, 0, 0),
        },
        uCameraPos: {
          value: new THREE.Vector3(0, 0, 0),
        },
        uResolution: {
          value: new THREE.Vector4(window.innerWidth, window.innerHeight, 0),
        },
        uTexture: {
          value: new THREE.TextureLoader().load('/textures/dirt/stars.jpg'),
        },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    for (let i = 0; i < numberOfParticles; i++) {
      particlesPosition.set([Math.random() * 5 - 2.5, Math.random() * 5 - 2.5, -2], i * 3);
      particlesDir.set([Math.random() * 2 - 1, Math.random() * 2 - 1, 0], i * 3);
      let randomColor = new THREE.Color(this.colors[Math.floor(Math.random() * 4)]);
      particlesColor.set([randomColor.r, randomColor.g, randomColor.b], 3 * i);
    }

    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPosition, 3));
    this.particleGeometry.setAttribute('aDirection', new THREE.BufferAttribute(particlesDir, 3));
    this.particleGeometry.setAttribute('aColor', new THREE.BufferAttribute(particlesColor, 3));

    this.particles = new THREE.Points(this.particleGeometry, this.particleMaterial);

    // this.objectsToTest.push(this.particles);

    this.scene.add(this.particles);
  }

  setPlaneBackground() {
    this.planeGeometry = new THREE.PlaneGeometry(4, 3);
    this.planeMaterial = new THREE.ShaderMaterial({
      //   wireframe: true,
      //   depthTest: false,
      //   depthWrite: false,
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
          value: new THREE.Vector4(window.innerWidth, window.innerHeight, 0),
        },
        uTexture: {
          value: new THREE.TextureLoader().load('/textures/dirt/stars.jpg'),
        },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.plane.position.z = -4;
    this.plane.position.y = 0.5;
    this.plane.renderOrder = -1;
    this.scene.add(this.plane);

    this.objectsToTest.push(this.plane);
  }

  centerCameraOnPlane() {
    // const cameraDist = this.camera.position.z;
    // const height = 1;

    // this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (cameraDist * 2));

    if (this.sizes.width / this.sizes.height > 1) {
      this.plane.scale.x = this.camera.aspect;
    } else {
      this.plane.scale.y = 1 / this.camera.aspect;
    }

    // this.camera.updateProjectionMatrix();
  }

  raycast() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersect = this.raycaster.intersectObjects(this.objectsToTest);

    if (intersect.length > 0) {
      this.planeMaterial.uniforms.uMouse.value = intersect[0].uv;
    }
  }

  mouseClickEvents() {
    // window.addEventListener('mousedown', () => {
    //   this.planeMaterial.uniforms.uDirection.value = 0;
    //   gsap.to(this.planeMaterial.uniforms.uProgress, {
    //     duration: 0.5,
    //     // ease: 'Power2.easeOut',
    //     value: 1,
    //   });
    // });
    // window.addEventListener('mouseup', () => {
    //   this.planeMaterial.uniforms.uDirection.value = 1;
    //   gsap.to(this.planeMaterial.uniforms.uProgress, {
    //     duration: 0.5,
    //     // ease: 'Power2.easeOut',
    //     value: 0,
    //   });
    // });
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
    // this.particleMaterial.uniforms.uTime.value = this.time.elapsed * 0.01;
    this.planeMaterial.uniforms.uTime.value = this.time.elapsed * 0.01;
    // this.getSpeed();
  }
}
