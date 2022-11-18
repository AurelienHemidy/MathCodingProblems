uniform float uTime;
uniform sampler2D uTexture;
uniform float uProgress;

varying vec2 vUv;

void main() {

    float dist = 1. - length(vec2(0.5) - vUv);

    vec4 color = texture2D(uTexture, vUv);

    gl_FragColor = vec4(uProgress, 0.0, 0.0, 1.0);
    gl_FragColor = vec4(dist,0.0, 0.0, 1.0);
    gl_FragColor = color;
}