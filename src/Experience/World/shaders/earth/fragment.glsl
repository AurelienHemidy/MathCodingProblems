varying vec3 vPosition;
varying vec3 vNormal;

uniform float uTime;

void main() {

    vec3 newPos = vPosition + clamp(cos(uTime * 0.1), 0.5, 1.) * 0.4;
    gl_FragColor = vec4(newPos, 1.0);
}