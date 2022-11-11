uniform float uTime;

varying vec2 vUv;

const float TAU = 6.2831853071796;


void main() {

    vec2 uvsCentered = vUv * 2. -1.;

    float distanceFromCenter = length(uvsCentered);
    

    // float wave = cos((distanceFromCenter - uTime * 0.01)  * TAU * 5.);
    float t = abs(vUv.x * 2. - 1.);

    gl_FragColor = vec4(vec3(t), 1.0);
}