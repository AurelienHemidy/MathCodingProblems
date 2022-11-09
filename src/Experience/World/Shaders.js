import * as THREE from 'three';
import Experience from '../Experience.js';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import { Mesh } from 'three';

export default class Shaders {
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
      this.debugFolder = this.debug.ui.addFolder('Shaders');
    }
    this.debugObject = {
      circleScale: 1,
      startColor: '#0000ff',
      endColor: '#e7a0ad',
      minRange: 0,
      maxRange: 1,
    };

    this.objectsToTest = [];
    this.raycaster = new THREE.Raycaster();

    this.direction = new THREE.Vector3(0, -50, 0);

    this.texture = new THREE.TextureLoader().load('/textures/dirt/color.jpg');

    /**
     * Mouse
     */
    this.mouse = new THREE.Vector2();

    this.setSphere();
    this.setSecondSphere();

    this.raycast();
  }

  setSphere() {
    this.sphereGeometry = new THREE.CylinderGeometry(1, 1, 3, 64);
    this.sphereMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthFunc: THREE.NeverDepth,
      uniforms: {
        uTime: {
          value: 0,
        },
        uTexture: { value: this.texture },
        uColorStart: {
          value: new THREE.Color(this.debugObject.startColor),
        },
        uColorEnd: {
          value: new THREE.Color(this.debugObject.endColor),
        },
        uMinRange: {
          value: this.debugObject.minRange,
        },
        uMaxRange: {
          value: this.debugObject.maxRange,
        },
      },
    });

    this.sphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
    this.scene.add(this.sphere);

    this.objectsToTest.push(this.sphere);

    if (!this.debug.active) return;
    this.debugFolder.add(this.sphere.position, 'x').min(-5).max(5).step(0.1);
    this.debugFolder.add(this.sphere.position, 'y').min(-5).max(5).step(0.1);
    this.debugFolder.addColor(this.debugObject, 'startColor').onChange(() => {
      this.sphereMaterial.uniforms.uColorStart.value.set(this.debugObject.startColor);
    });
    this.debugFolder.addColor(this.debugObject, 'endColor').onChange(() => {
      this.sphereMaterial.uniforms.uColorEnd.value.set(this.debugObject.endColor);
    });

    this.debugFolder.add(this.sphereMaterial.uniforms.uMinRange, 'value').min(0).max(1).step(0.01);
    this.debugFolder.add(this.sphereMaterial.uniforms.uMaxRange, 'value').min(0).max(1).step(0.01);
  }

  setSecondSphere() {
    this.geom = new THREE.SphereGeometry(0.8, 20, 20);

    this.mat = new THREE.MeshBasicMaterial({
      color: 0xff0000,
    });

    this.secondSphere = new Mesh(this.geom, this.mat);

    this.scene.add(this.secondSphere);
  }

  raycast() {
    this.raycaster.setFromCamera(this.mouse, this.camera.instance);

    const intersect = this.raycaster.intersectObjects(this.objectsToTest);

    // console.log(intersect[0]);
    if (intersect[0]) {
    }
  }

  setupEventListener() {
    window.addEventListener('mousedown', (event) => {
      this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;

      this.raycast();
      //   console.log(this.mouse);
    });

    // window.addEventListener('mousemove', (event) => {
    //   this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
    //   this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;

    //   this.raycast();
    //   //   console.log(this.mouse);
    // });
  }

  update() {
    this.sphereMaterial.uniforms.uTime.value = this.experience.time.elapsed * 0.01;
    // console.log(this.experience.time.elapsed);
  }
}
