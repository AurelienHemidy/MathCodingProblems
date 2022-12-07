uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uProgress;
uniform float uSpeed;

varying vec2 vUv; 

uniform sampler2D uTexture;

float rand(vec2 n) {
    return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 n) {
    const vec2 d = vec2(0.0, 1.0);
    vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
    return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) {
    float total = 0.0, amplitude = 1.0;
    for (int i = 0; i < 4; i++) {
        total += noise(n) * amplitude;
        n += n;
        amplitude *= 0.5;
    }
    return total;
}

void main() {

    gl_FragColor = vec4(vUv, 1.0, 1.);

    float dist = smoothstep(0.4, 0., length(vUv - uMouse));
    // float dist = length(vUv - uMouse);

    const vec3 c1 = vec3(0.1, 0.0, 0.5);
    const vec3 c2 = vec3(0.2, 0.0, 0.9);
    const vec3 c3 = vec3(0.4, 0.0, 0.2);
    const vec3 c4 = vec3(0.0, 0.9, 1.0);
    const vec3 c5 = vec3(0.1);
    const vec3 c6 = vec3(0.9);
    
    vec2 speed = vec2(0.7, 0.4);
    float shift = 1.6;
    float alpha = 1.0;

    vec4 tex = texture2D(uTexture, vUv);

    float rTex = texture2D(uTexture, vUv + dist * uSpeed * 0.2).r;
    float gTex = texture2D(uTexture, vUv + dist * uSpeed * 0.7).g;
    float bTex = texture2D(uTexture, vUv + dist * uSpeed * 0.9).b;

    vec2 p = gl_FragCoord.xy * 8.0 / uResolution.xx ;
    float q = fbm(p - uTime / 10. * 0.1);
    vec2 r = vec2(fbm(p + q + uTime / 10. * speed.x - p.x - p.y), fbm(p + q - uTime / 10. * speed.y));
    vec3 c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y)  * dist * 7. * uProgress ;
    gl_FragColor = vec4(c * cos(shift * gl_FragCoord.y / uResolution.y), alpha);
    // gl_FragColor = vec4(dist, dist, dist, 1.);
}
