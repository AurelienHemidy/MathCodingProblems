import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import Experience from '../Experience.js';
import gsap from 'gsap';

import vertexShader from './shaders/objectSampling/vertexParticle.glsl';
import fragmentShader from './shaders/objectSampling/fragment.glsl';

export default class ObjectSampling {
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
      this.debugFolder = this.debug.ui.addFolder('ObjectSampling');
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

    // Resource
    this.resource = this.resources.items.bookModel;

    this.colors = ['#a67c00', '#ffbf00', '#ffd447', '#ffe878', '#bf9b30'];

    this.setObject();
    this.setModel();
    // this.centerCameraOnPlane();

    this.mouseClickEvents();
    this.mouseMoveEvent();
  }

  setModel() {
    this.model = this.resource.scene.children[0].children[0].children[0].children[0].children[0];
    this.model2 = this.resource.scene.children[0].children[0].children[0].children[1].children[0];
    // this.model.scale.set(1, 1, 1);
    // this.scene.add(this.model);

    console.log(this.resource.scene.children[0].children[0].children[0].children[1].children[0]);

    // this.model.traverse((child) => {
    //   if (child instanceof THREE.Mesh) {
    //     child.material = new THREE.MeshMatcapMaterial({
    //       matcap: new THREE.TextureLoader().load('/textures/dirt/matcap1.png'),
    //       color: 0x000000,
    //     });
    //     // child.material = new THREE.MeshNormalMaterial({});
    //   }
    // });

    this.backgroundVersion = new THREE.Mesh(
      this.model.geometry.clone(),
      new THREE.MeshMatcapMaterial({
        matcap: new THREE.TextureLoader().load('/textures/dirt/matcap3.jpg'),
        color: 0x201e1e,
      })
    );
    this.backgroundVersion2 = new THREE.Mesh(
      this.model2.geometry.clone(),
      new THREE.MeshMatcapMaterial({
        matcap: new THREE.TextureLoader().load('/textures/dirt/matcap1.png'),
        color: 0x201e1e,
      })
    );

    this.scene.add(this.backgroundVersion);
    // this.scene.add(this.backgroundVersion2);

    const sampler = new MeshSurfaceSampler(this.model).setWeightAttribute('uv').build();
    let number = 10000;
    var geometry = new THREE.BufferGeometry();

    //Attribute part
    let pointPos = new Float32Array(number * 3);
    let normals = new Float32Array(number * 3);
    let colors = new Float32Array(number * 3);
    let sizes = new Float32Array(number);

    for (let i = 0; i < number; i++) {
      let _position = new THREE.Vector3(0, 0, 0);
      let _normal = new THREE.Vector3(0, 0, 0);
      sampler.sample(_position, _normal);
      pointPos.set([_position.x, _position.y, _position.z], 3 * i);
      normals.set([_normal.x, _normal.y, _normal.z], 3 * i);
      let randomColor = new THREE.Color(this.colors[Math.floor(Math.random() * 5)]);
      colors.set([randomColor.r, randomColor.g, randomColor.b], 3 * i);

      let randomSize = Math.floor(Math.random() * 10);
      sizes.set([randomSize], i);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(pointPos, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Creating particles

    let points = new THREE.Points(geometry, this.planeMaterial);
    this.scene.add(points);

    //Buffer geom auquel j'ajoute des attributs
    // un new THREE.Points
  }

  setObject() {
    this.planeGeometry = new THREE.PlaneGeometry(1, 1);
    this.planeMaterial = new THREE.ShaderMaterial({
      //   wireframe: true,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
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
    // this.scene.add(this.plane);

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
    // this.getSpeed();
  }
}
