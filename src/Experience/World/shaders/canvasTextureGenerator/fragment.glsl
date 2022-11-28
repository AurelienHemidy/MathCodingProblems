uniform float uTime;
uniform sampler2D uTexture2;
uniform sampler2D uTexture;
uniform vec2 uMouse;

varying vec2 vUv; 

void main() {

    vec4 tex = texture2D(uTexture, vUv);

    vec2 newuv = vec2(vUv.x + uTime * 0.01 * tex.b, vUv.y + tex.b* 0.1);

    gl_FragColor = vec4(vUv, 1.0, 1.);
    gl_FragColor = texture2D(uTexture2, newuv);
}