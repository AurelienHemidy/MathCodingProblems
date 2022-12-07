const float PI = 3.141592653589793;

varying vec2 vUv;
varying vec3 vNormal;

uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uDisplacement;


void main() {
    vec4 disp = texture2D(uDisplacement, uv);

    vec3 newpos = position;

    newpos += disp.xyz * 0.1;




    gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);

    vUv = uv;
    vNormal = normal;
}