uniform float uAmountHealth;
uniform vec3 uStartColor;
uniform vec3 uEndColor;
uniform sampler2D uTexture;
uniform float uTime;

varying vec2 vUv;

vec3 InverseLerp(float a, float b, vec3 v) {
    return clamp((v-a) / (b-a), 0.0, 1.0);
}

void main() {


    // vec3 outputColor = mix(uStartColor, uEndColor, uAmountHealth);

    // vec3 inverlerp = InverseLerp(0.2, 0.8, outputColor);

    // vec3 iLerp = vec3(step(vUv.x, uAmountHealth));

    // iLerp *= inverlerp;

    

    // gl_FragColor = vec4(iLerp, 1.);

    // if(gl_FragColor.x < 0.001) discard;

    vec4 tex = texture2D(uTexture, vec2(uAmountHealth, vUv.y));

    if (uAmountHealth < 0.2)tex *= cos(uTime);

    vec3 iLerp = vec3(step(vUv.x, uAmountHealth));

    iLerp *= tex.xyz;

    gl_FragColor = vec4(iLerp, 1.);

    if(gl_FragColor.x < 0.001) discard;

    
}   