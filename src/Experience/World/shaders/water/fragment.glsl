const float PI = 3.141592653589793;
uniform vec2 uMouse;

varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uDisplacement;

void main() {

    vec4 disp = texture2D(uDisplacement, vUv);
    
    float theta = disp.r * 2. * PI;

    vec2 dir = vec2(sin(theta), cos(theta));

    vec2 uv = vUv + dir * disp.r * 0.1;

    vec4 color = texture2D(uTexture, uv);
    
    gl_FragColor = color;
}