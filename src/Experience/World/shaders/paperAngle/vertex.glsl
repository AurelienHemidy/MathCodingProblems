uniform vec2 uMouse;
uniform float uProgress;
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;

#define PI radians(180.0)
  uniform mat4 uCenter;
  uniform mat4 uInvCenter;
  uniform float uRange;
  uniform float uRadius;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

mat4 rotZ(float angleInRadians) {
      float s = sin(angleInRadians);
      float c = cos(angleInRadians);

      return mat4(
        c,-s, 0, 0,
        s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1);
  }

  mat4 rotX(float angleInRadians) {
      float s = sin(angleInRadians);
      float c = cos(angleInRadians);

      return mat4( 
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1);  
  }

void main() {

    // float distanceFromMouse = length(uv - vec2(1));

    // float distStep = smoothstep(0.4, 0., distanceFromMouse);
    // float distStep2 = clamp((distanceFromMouse - 0.4) / (0. - 0.4), 0.0, 1.0);
    // float t = distStep2 * distStep2 * distStep2 * (3.0 - 2.0 * distStep2);

    // // float newZ = step(0.8, uv.x) * map(uv.x, 0.8, 1., 0., 1.) * 0.2;

    // // float newX = sin(uv.x * 3.15);


    // vec3 newPos = position;

    // newPos.z = uv.x * uv.x * uv.x;
    // // newPos.y += sin(uv.x * 10.) * 0.1;
    // // newPos.z += t * 0.1 * uProgress;

    // // newPos.xy -= vec2(0.3 * t) * sin(t) * uProgress;




    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    float curveAmount = uRange / uRadius;
    float invRange = uRange > 0.0 ? 1.0 / uRange : 0.0;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vec4 point = uInvCenter * mvPosition;
    float amountToApplyCurve = clamp(point.z * invRange, 0.0, 1.0);
    float s = sign(point.y);
    mat4 mat = rotX(curveAmount * amountToApplyCurve * s);
    point = uCenter * mat * (point + vec4(0, 0, -uRange * amountToApplyCurve, 0));
    vNormal = mat3(mat) * normalMatrix * normal;
    gl_Position = projectionMatrix * point;


    vUv = uv;
    vNormal = normal;
}