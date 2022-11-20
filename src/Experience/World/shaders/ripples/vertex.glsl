uniform vec2 uMouse;
uniform float uProgress;
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vUv = uv;
    vNormal = normal;
}