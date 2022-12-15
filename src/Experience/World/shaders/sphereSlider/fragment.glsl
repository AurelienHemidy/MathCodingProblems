uniform float uTime;
uniform sampler2D uTexture;

varying vec2 vUv; 

void main() {

    gl_FragColor = vec4(0.05, 0.05, 0.05, 1.);

    gl_FragColor = texture2D(uTexture, vUv);
}