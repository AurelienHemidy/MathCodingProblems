uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uDisplacement;

const float PI = 3.141592653589793;

varying vec2 vUv; 

void main() {

    vec4 disp = texture2D(uDisplacement, vUv);

    float theta = disp.r * 2. * PI ;

    vec2 dir = vec2(sin(theta * uTime * 0.01), cos(theta * uTime * 0.01));

    vec2 uv = vUv + dir * disp.r * 0.08;

    vec4 color = texture2D(uTexture, uv);

    gl_FragColor = color;
}