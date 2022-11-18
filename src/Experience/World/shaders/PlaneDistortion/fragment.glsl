uniform float uTime;
uniform sampler2D uTexture;
uniform float uProgress;
uniform vec2 uMouse;
uniform float uSpeed;
uniform vec4 uResolution;

varying vec2 vUv;

void main() {

    float dist = 1. - length(vec2(0.5) - vUv);

    float mouseDist = smoothstep(0.2, 0., length(vUv - uMouse));

    // vec2 newUV = (vUv - vec2(0.5))*uResolution.zw + vec2(0.5); 

    vec4 color = texture2D(uTexture, vUv);

    float r = texture2D(uTexture, vUv + mouseDist * uSpeed * 0.2).r;
    float g = texture2D(uTexture, vUv + mouseDist * uSpeed * 0.7).g;
    float b = texture2D(uTexture, vUv + mouseDist * uSpeed * 0.9).b;

    gl_FragColor = vec4(uProgress, 0.0, 0.0, 1.0);
    gl_FragColor = vec4(dist,0.0, 0.0, 1.0);
    gl_FragColor = color;
    gl_FragColor = vec4(r, g, b, 1.0);
    // gl_FragColor = vec4(mouseDist,mouseDist, mouseDist, 1.0);
}