import * as THREE from 'three';
import Experience from '../Experience.js';
import gsap from 'gsap';

import vertexShader from './shaders/PlaneDistortion/vertex.glsl';
import fragmentShader from './shaders/PlaneDistortion/fragment.glsl';

export default class PlaneDistortion {
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
      this.debugFolder = this.debug.ui.addFolder('PlaneDistortion');
    }
    this.settings = {
      progress: 0,
    };

    this.setObject();
    this.centerCameraOnPlane();

    this.mouseClickEvents();
  }

  setObject() {
    this.planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 100);
    this.planeMaterial = new THREE.ShaderMaterial({
      wireframe: true,
      uniforms: {
        uTime: {
          value: 0,
        },
        uProgress: {
          value: this.settings.progress,
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
  }

  centerCameraOnPlane() {
    const cameraDist = this.camera.position.z;
    const height = 1;

    this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (cameraDist * 2));

    if (this.sizes.width / this.sizes.height > 1) {
      this.plane.scale.x = this.camera.aspect;
    } else {
      this.plane.scale.y = 1 / this.camera.aspect;
    }

    this.camera.updateProjectionMatrix();
  }

  mouseClickEvents() {
    window.addEventListener('mousedown', () => {
      gsap.to(this.planeMaterial.uniforms.uProgress, {
        duration: 1,
        // ease: 'Power2.easeOut',
        value: 1,
      });
    });

    window.addEventListener('mouseup', () => {
      gsap.to(this.planeMaterial.uniforms.uProgress, {
        duration: 1,
        // ease: 'Power2.easeOut',
        value: 0,
      });
    });
  }

  mouseMoveEvent() {
    window.addEventListener('mousemove', () => {});
  }

  update() {
    this.planeMaterial.uniforms.uTime.value = this.time.elapsed * 0.01;
  }
}
