varying vec2 vUv;
varying vec3 vNormal;

uniform float uTime;
uniform float uDiff;
uniform float uProgress;

void main() {

    float dist = length(uv - vec2(0.5));
    

    vec3 newpos = position;

    newpos.z += sin(dist * 10. + uTime / 2.) * 0.2 * uProgress;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);

    vUv = uv;
    vNormal = normal;
}