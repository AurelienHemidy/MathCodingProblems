import * as THREE from 'three';
import Experience from '../Experience.js';
import gsap from 'gsap';

import vertexShader from './shaders/water/vertex.glsl';
import fragmentShader from './shaders/water/fragment.glsl';

export default class Water {
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
      this.debugFolder = this.debug.ui.addFolder('Water');
    }
    this.settings = {
      progress: 0,
    };

    this.mouse = new THREE.Vector2(0, 0);
    this.prevMouse = new THREE.Vector2(0, 0);

    this.currentWave = 0;

    this.speed = 0;
    this.targetSpeed = 0;

    this.objectsToTest = [];
    this.raycaster = new THREE.Raycaster();

    this.sceneTexture = new THREE.Scene();

    this.waveTexture = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    });

    this.setInitialTrail();
    this.setObject();
    this.centerCameraOnPlane();

    this.mouseClickEvents();
    this.mouseMoveEvent();
  }

  setInitialTrail() {
    this.numberOfWave = 50;
    let geometry = new THREE.PlaneGeometry(100, 100, 1, 1);

    this.meshes = [];

    for (let i = 0; i < this.numberOfWave; i++) {
      let mat = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('/textures/dirt/brush9.png'),
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      let mesh = new THREE.Mesh(geometry, mat);

      mesh.visible = false;

      // mesh.rotation.z = Math.PI * 2 * Math.random();

      this.meshes.push(mesh);
      this.sceneTexture.add(mesh);
    }
  }

  setObject() {
    this.planeGeometry = new THREE.PlaneGeometry(this.sizes.width, this.sizes.height, 1000, 1000);
    this.planeMaterial = new THREE.ShaderMaterial({
      // wireframe: true,
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {
          value: 0,
        },
        uProgress: {
          value: this.settings.progress,
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
          value: new THREE.TextureLoader().load('/textures/dirt/planeTex.jpg'),
        },
        uDisplacement: {
          value: null,
        },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);

    this.scene.add(this.plane);

    this.objectsToTest.push(this.plane);

    this.newgeom = new THREE.BoxGeometry(100, 50, 50);
    this.newmat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.mesh2 = new THREE.Mesh(this.newgeom, this.newmat);
    this.scene.add(this.mesh2);
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
      // this.planeMaterial.uniforms.uDirection.value = 0;
      // gsap.to(this.planeMaterial.uniforms.uProgress, {
      //   duration: 0.5,
      //   // ease: 'Power2.easeOut',
      //   value: 1,
      // });
    });

    window.addEventListener('mouseup', () => {
      // this.planeMaterial.uniforms.uDirection.value = 1;
      // gsap.to(this.planeMaterial.uniforms.uProgress, {
      //   duration: 0.5,
      //   // ease: 'Power2.easeOut',
      //   value: 0,
      // });
    });
  }

  mouseMoveEvent() {
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = event.clientX - this.sizes.width / 2;
      this.mouse.y = -(event.clientY - this.sizes.height / 2);

      // this.createMesh((event.clientX / this.sizes.width), -(event.clientY / this.sizes.height), )

      // for (let i = 0; i < this.meshes.length; i++) {
      //   this.meshes[i].position.x = event.clientX;
      //   this.meshes[i].position.y = -event.clientY;
      // }

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

  setNewWave(x, y, index) {
    const mesh = this.meshes[index];
    mesh.material.opacity = 1;
    mesh.visible = true;
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.scale.y = 2;
    mesh.scale.x = 3;
    mesh.rotation.z = Math.atan2(this.prevMouse.y - this.mouse.y, this.prevMouse.x - this.mouse.x);
    // console.log(Math.atan2(this.prevMouse.y - this.mouse.y, this.prevMouse.x - this.mouse.x));
  }

  trackMousePos() {
    const isMouseNotMoving =
      Math.abs(this.mouse.x - this.prevMouse.x) < 4 && Math.abs(this.mouse.y - this.prevMouse.y) < 4;

    if (isMouseNotMoving) return;

    this.currentWave = (this.currentWave + 1) % this.numberOfWave;

    this.setNewWave(this.mouse.x, this.mouse.y, this.currentWave);

    this.mesh2.position.x = this.mouse.x;
    this.mesh2.position.y = this.mouse.y;
    this.mesh2.rotation.z = Math.atan2(this.prevMouse.y - this.mouse.y, this.prevMouse.x - this.mouse.x);

    this.prevMouse.x = this.mouse.x;
    this.prevMouse.y = this.mouse.y;
  }

  update() {
    this.trackMousePos();
    this.meshes.forEach((mesh) => {
      if (!mesh.visible) return;
      mesh.material.opacity *= 0.92;
      // mesh.scale.y = 1.05 * mesh.scale.y + 0.1;
      mesh.scale.y *= 1.02;
      mesh.scale.x *= 1.005;
      // mesh.scale.x = 1.01 * mesh.scale.x + 0.05;
      // mesh.rotation.z += 0.02;

      // const
      // mesh.rotation.z = rotation;
      // console.log(rotation);

      const isOpacityTooSmall = mesh.material.opacity < 0.02;
      if (isOpacityTooSmall) mesh.visible = false;
    });

    this.renderer.setRenderTarget(this.waveTexture);
    this.renderer.render(this.sceneTexture, this.camera);
    this.planeMaterial.uniforms.uDisplacement.value = this.waveTexture.texture;
    this.renderer.setRenderTarget(null);

    // this.renderer.
    // this.renderer.render(this.sceneTexture, this.camera);

    this.planeMaterial.uniforms.uTime.value = this.time.elapsed * 0.01;
    // this.getSpeed();
  }
}
