uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;

uniform sampler2D uTexture;

void main() {

    vec2 newUV = uv;

    newUV.x += sin(uTime * 0.2) * 0.01;
    newUV.y += sin(uTime * 0.3) * 0.01;

    vec4 tex = texture2D(uTexture, uv);

    vec3 newPos = position;

    newPos.z += clamp(tex.z, 0., 1.0) * 0.1;

    // newPos.z += sin(uv. x + uTime * 0.8) * 0.05;
    // newPos.x += sin(uv. x + uTime * 0.8) * 0.05;
    // newPos.y += sin(uv. x + uTime * 0.8) * 0.05;


    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);

    vUv = uv;
    vNormal = normal;
}