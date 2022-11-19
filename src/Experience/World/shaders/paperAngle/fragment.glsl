uniform vec2 uMouse;

varying vec2 vUv;
varying vec3 vNormal;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}


void main() {

    float distanceFromMouse = length(vUv - uMouse);

    float distanceFromRightTopCorner = length(vUv - vec2(1));

    float corner = (vUv.x - vUv.y - 0.6);

    float distStep = smoothstep(0.2, 0., distanceFromMouse);
    


    // float newColor = smoothstep(0.8, 1., vUv.x);
    // float newColor = ;

    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    gl_FragColor = vec4(vUv.x, vUv.x, vUv.x, 1.0);
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    // gl_FragColor = vec4(newColor, newColor, newColor, 1.0);
    // gl_FragColor = vec4(corner, corner, corner, 1.0);
}