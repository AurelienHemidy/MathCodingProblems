uniform vec2 uMouse;

varying vec2 vUv;
varying vec3 vNormal;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}


void main() {

    float distanceFromMouse = length(vUv - uMouse);

    gl_FragColor = vec4(distanceFromMouse, distanceFromMouse, distanceFromMouse, 1.0);

}