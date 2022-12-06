varying vec2 vUv;
varying vec3 vNormal;

uniform vec2 uMouse;
uniform float uProgress;


void main() {

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 10. * (1. / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}