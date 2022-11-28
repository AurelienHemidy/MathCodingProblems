uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;

uniform sampler2D uTexture;

varying vec3 uPosition;


void main() {


    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vUv = uv;
    uPosition = position;
    vNormal = normal;
}