varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uMouse;

uniform float uTime;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {

    vUv = uv;
    vPosition = position;

    // float distanceFromMouse = length(vPosition - uMouse);

    // vec2 directionFromMouse = normalize(vPosition.xy - uMouse.xy);

    // vec2 zoomedUV = vUv + directionFromMouse * 0.02;

    // float proximity = clamp(1. - map( distanceFromMouse, 0., 0.5, 0.,1.), 0., 1.0);

    
    // // Paper that you have to explore with light on it ?
    // vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // modelPosition.z = cos(proximity) * 0.2 * + sin(proximity) * 0.2;

    // vec4 viewPosition = viewMatrix * modelPosition;
    // vec4 projectedPosition = projectionMatrix * viewPosition;

    // gl_Position = projectedPosition;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    
}