uniform vec2 uMouse;

varying vec2 vUv;
varying vec3 vNormal;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}


void main() {

    float distanceFromMouse = length(vUv - uMouse);

    float distStep = smoothstep(0.2, 0., distanceFromMouse);
    


    // float newColor = smoothstep(0.8, 1., vUv.x);
    float newColor = step(0.8, vUv.x) * map(vUv.x, 0.8, 1., 0., 1.);

    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    gl_FragColor = vec4(vUv, 1.0, 1.0);
    // gl_FragColor = vec4(newColor, newColor, newColor, 1.0);
}