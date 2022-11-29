uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;

uniform sampler2D uDisplacement;

varying vec3 uPosition;


void main() {

    vec4 disp = texture2D(uDisplacement, uv);

    vec3 newpos = position;

    newpos += disp.xyz * 20.;


    gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);

    vUv = uv;
    uPosition = position;
    vNormal = normal;
}