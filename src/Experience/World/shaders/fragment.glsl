uniform float uTime;
uniform vec3 uColorStart;
uniform vec3 uColorEnd;

uniform float uMinRange;
uniform float uMaxRange;

#define TAU 6.283185307179586476925286766559

varying vec2 vUv;
varying vec3 vNormal;

vec3 lerp(vec3 a, vec3 b, float t) {
    return (1.- t) * a + b * t;
}

vec3 inverseLerp(float a, float b, vec3 v) {
    return (v - a) / (b - a);
}

float inverseLerpFloat(float a, float b, float v) {
    return (v - a) / (b - a);
}

void main() {

    float t2 = clamp(inverseLerpFloat(uMinRange, uMaxRange, vUv.x), 0., 1.);

    vec3 outColor = lerp(uColorStart, uColorEnd, t2);

    float yOffset = cos(vUv.x * TAU * 8.) * 0.01;

    float t = cos(((vUv.y + yOffset) - uTime * 0.01) * TAU * 5.) * 0.5 + 0.5;

    t *= 1. - vUv.y;

    t *= 1. - (abs(vNormal.y));
    
    // t *= outColor;

    vec3 gradient = mix(uColorStart, uColorEnd, vUv.y);

    vec3 outputColor = vec3(t) * gradient;

    // gl_FragColor = vec4(1., 0., 0., 1.);
    gl_FragColor = vec4(outputColor, 1.);
}