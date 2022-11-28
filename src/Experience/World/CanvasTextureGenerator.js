import * as THREE from 'three';
import Experience from '../Experience.js';
import gsap from 'gsap';

import vertexShader from './shaders/canvasTextureGenerator/vertex.glsl';
import fragmentShader from './shaders/canvasTextureGenerator/fragment.glsl';

export default class CanvasTextureGenerator {
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
      this.debugFolder = this.debug.ui.addFolder('CanvasTextureGenerator');
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

    this.initCanvas();
    this.draw();

    this.setObject();
    this.centerCameraOnPlane();

    this.mouseClickEvents();
    this.mouseMoveEvent();
  }

  initCanvas() {
    this.canvas = document.getElementById('canvas-texture');
    this.ctx = this.canvas.getContext('2d');

    this.canvas.width = this.sizes.width * 0.335;
    this.canvas.height = this.sizes.height * 0.5;

    this.texture = new THREE.Texture(this.canvas);
    console.log(this.texture);
    // this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    // this.ctx.fillRect(0, 0, this.sizes.width, this.sizes.height);
  }

  draw(x, y) {
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, 20, 20, Math.PI / 4, 0, 2 * Math.PI);
    this.ctx.fill();
    // this.ctx.lineWidth = 50;
    // this.ctx.beginPath();
    // this.ctx.moveTo(x, y - 20);
    // this.ctx.lineTo(x + 50, y + 200);
    // this.ctx.moveTo(x, y - 20);
    // this.ctx.lineTo(x - 50, y + 200);
    // this.ctx.fill(path);
    // this.ctx.stroke();
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
        uMouse: {
          value: new THREE.Vector2(0, 0),
        },
        uResolution: {
          value: new THREE.Vector4(0, 0, 0),
        },
        uTexture: {
          value: new THREE.TextureLoader().load('/textures/dirt/stars.jpg'),
        },
        uTexture2: {
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

    // var vFOV = this.camera.fov * Math.PI / 180;;
    // const aspect = window.innerWidth / window.innerHeight;
    // const heightObject = 2 * Math.tan(vFOV / 2) * this.camera.position.z;
    // const widthObject = heightObject * aspect;
  }

  raycast() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersect = this.raycaster.intersectObjects(this.objectsToTest);

    if (intersect.length > 0) {
      this.planeMaterial.uniforms.uMouse.value = intersect[0].uv;

      const width = intersect[0].uv.x * this.sizes.width * 0.335;
      const height = (1 - intersect[0].uv.y) * this.sizes.height * 0.5;

      this.draw(width, height);
      //   console.log(this.canvas.width);
      //   console.log(1 - intersect[0].uv.y);
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
  }

  mouseMoveEvent() {
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;

      //   this.planeMaterial.uniforms.uMouse.value = this.mouse;
      //   console.log(event.clientX, event.clientY);

      //   this.draw(event.clientX, event.clientY);

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
    this.planeMaterial.uniforms.uTexture.value = this.texture;

    this.ctx.fillStyle = 'rgba(0, 0, 0, .02)';
    // this.ctx.globalCompositeOperation = 'screen';
    this.ctx.fillRect(0, 0, this.sizes.width, this.sizes.height);

    this.texture.needsUpdate = true;
    this.getSpeed();
    if (this.speed < 0.001) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    }
  }
}
