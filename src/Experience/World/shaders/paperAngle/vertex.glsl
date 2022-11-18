uniform vec2 uMouse;
uniform float uProgress;

varying vec2 vUv;
varying vec3 vNormal;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {

    float distanceFromMouse = length(uv - vec2(1));

    float distStep = smoothstep(0.4, 0., distanceFromMouse);
    float distStep2 = clamp((distanceFromMouse - 0.4) / (0. - 0.4), 0.0, 1.0);
    float t = distStep2 * distStep2 * distStep2 * (3.0 - 2.0 * distStep2);

    // float newZ = step(0.8, uv.x) * map(uv.x, 0.8, 1., 0., 1.) * 0.2;

    // float newX = sin(uv.x * 3.15);

    vec3 newPos = position;

    // newPos.z += newZ;

    newPos.z += t * 0.1 * uProgress;

    newPos.xy -= vec2(0.3 * t) * sin(t) * uProgress;




    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);


    vUv = uv;
    vNormal = normal;
}