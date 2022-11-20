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

    float distStep = smoothstep(0.5, 0., distanceFromMouse);

    float newZ = step(0.8, vUv.x) *  map(vUv.x, 0.8, 1.0, 0., 1.0);
    
    float centeredLength = step( 0.2, length( vUv - vec2(0.5)) / 2.); 

    distStep *= centeredLength;

    // float newColor = smoothstep(0.8, 1., vUv.x) + smoothstep(0.8, 1., 1. - vUv.x) + smoothstep(0.8, 1., vUv.y) + smoothstep(0.8, 1., 1. - vUv.y);
    // float newColor = ;

    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    float newX = step(0.8, vUv.x) + 1. - step(0.2, vUv.x);

    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    // gl_FragColor = vec4(vUv.x, vUv.x, vUv.x, 1.0);
    gl_FragColor = vec4(vUv, 1.0, 1.0);
    // gl_FragColor = vec4(newColor, newColor, newColor, 1.0);
    // gl_FragColor = vec4(corner, corner, corner, 1.0);
    // gl_FragColor = vec4(distStep, distStep, distStep, 1.0);
}