varying vec2 vUv;
varying vec3 vNormal;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uMouse;

void main() {

    vec4 tex = texture2D(uTexture, uv);

    vec3 newpos = position;

    // newpos.z += sin(length(uv - vec2(0.5)) * 10. - uTime * 0.4)* 0.05;

    // float dist = smoothstep(.2, 0., length(uv - uMouse));

    // newpos.z += sin(length(uv - uMouse) * 10. - uTime * 0.7) * 0.05  * tex.r * 2.;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);

    vUv = uv;
    vNormal = normal;
}