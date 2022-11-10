uniform float uAmountHealth;
uniform vec3 uStartColor;
uniform vec3 uEndColor;


varying vec2 vUv;

vec3 Lerp(vec3 a, vec3 b, float t) {
    return (1.-t)*a + b*t;
}

vec3 InverseLerp(float a, float b, vec3 v) {
    return (v-a) / (b-a);
}

void main() {


    vec3 outputColor = Lerp(uStartColor, uEndColor, uAmountHealth);

    vec3 inverlerp = InverseLerp(0.2, 0.8, outputColor);

    // vec3 test = step();

    vec3 iLerp = vec3(step(vUv.x, uAmountHealth));

    iLerp *= inverlerp;



    gl_FragColor = vec4(iLerp, 1.);
}   