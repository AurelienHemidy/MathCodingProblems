import * as THREE from 'three';
import Experience from '../Experience.js';
import gsap from 'gsap';

import vertexShader from './shaders/sand/vertexParticle.glsl';
import fragmentShader from './shaders/sand/fragment.glsl';

export default class Sand {
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
      this.debugFolder = this.debug.ui.addFolder('Sand');
    }
    this.settings = {
      progress: 0,
    };

    this.mouse = new THREE.Vector2(0, 0);
    this.prevMouse = new THREE.Vector2(0, 0);

    this.temp = new THREE.Vector3(0, 0, 0);

    this.speed = 0;
    this.targetSpeed = 0;

    this.objectsToTest = [];
    this.raycaster = new THREE.Raycaster();

    // this.setObject();
    this.setRaycastSpere();
    this.setObjects();
    this.centerCameraOnPlane();

    this.mouseClickEvents();
    this.mouseMoveEvent();
  }

  setObject() {
    this.planeGeometry = new THREE.PlaneGeometry(1, 1, 25, 25);
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

    this.plane = new THREE.Points(this.planeGeometry, this.planeMaterial);
    this.scene.add(this.plane);

    this.objectsToTest.push(this.plane);
  }

  setRaycastSpere() {
    this.raycastSphereGeometry = new THREE.SphereGeometry(0.8, 50, 50);
    this.raycastSphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });

    this.raycastSphere = new THREE.Mesh(this.raycastSphereGeometry, this.raycastSphereMaterial);

    this.objectsToTest.push(this.raycastSphere);

    this.scene.add(this.raycastSphere);
  }

  setObjects() {
    const numberOfParticles = 100000;

    const particlesPosition = new Float32Array(numberOfParticles * 3);
    const particlesDir = new Float32Array(numberOfParticles * 3);

    this.particleGeometry = new THREE.BufferGeometry();
    this.particleMaterial = new THREE.ShaderMaterial({
      //   wireframe: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
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
      particlesPosition.set([Math.random(), Math.random(), Math.random()], i * 3);
      particlesDir.set([Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2], i * 3);
    }

    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPosition, 3));
    this.particleGeometry.setAttribute('aDirection', new THREE.BufferAttribute(particlesDir, 3));

    this.particles = new THREE.Points(this.particleGeometry, this.particleMaterial);

    // this.objectsToTest.push(this.particles);

    this.scene.add(this.particles);
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

    const intersect = this.raycaster.intersectObjects(this.objectsToTest, true);

    if (intersect.length > 0) {
      this.particleMaterial.uniforms.uMouse.value = intersect[0].point;
      this.particleMaterial.uniforms.uMouseBehind.value = intersect[1].point;
      this.particleMaterial.uniforms.uCameraPos.value = this.camera.getWorldDirection(this.temp);
      gsap.to(this.particleMaterial.uniforms.uHover, {
        duration: 1.5,
        // ease: 'Power2.easeOut',
        value: 1,
      });
    } else {
      gsap.to(this.particleMaterial.uniforms.uHover, {
        duration: 1.5,
        // ease: 'Power2.easeOut',
        value: 0,
      });
    }
  }

  mouseClickEvents() {
    window.addEventListener('mousedown', () => {
      this.particleMaterial.uniforms.uDirection.value = 0;
      gsap.to(this.particleMaterial.uniforms.uProgress, {
        duration: 1.5,
        // ease: 'Power2.easeOut',
        value: 1,
      });
      // gsap.to(this.particles.rotation, {
      //   duration: 1.5,
      //   // ease: 'Power2.easeOut',
      //   x: 1.5,
      // });
      // gsap.to(this.raycastSphere.rotation, {
      //   duration: 1.5,
      //   // ease: 'Power2.easeOut',
      //   y: 1.5,
      // });
    });
    window.addEventListener('mouseup', () => {
      this.particleMaterial.uniforms.uDirection.value = 1;
      gsap.to(this.particleMaterial.uniforms.uProgress, {
        duration: 1.5,
        // ease: 'Power2.easeOut',
        value: 0,
      });
      // gsap.to(this.particles.rotation, {
      //   duration: 1.5,
      //   // ease: 'Power2.easeOut',
      //   x: 0,
      // });
      // gsap.to(this.raycastSphere.rotation, {
      //   duration: 1.5,
      //   // ease: 'Power2.easeOut',
      //   y: 0,
      // });
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
    // this.planeMaterial.uniforms.uSpeed.value = this.targetSpeed;

    this.prevMouse.x = this.mouse.x;
    this.prevMouse.y = this.mouse.y;
  }

  update() {
    // this.planeMaterial.uniforms.uTime.value = this.time.elapsed * 0.01;
    this.particleMaterial.uniforms.uTime.value = this.time.elapsed * 0.01;
    this.getSpeed();
  }
}
