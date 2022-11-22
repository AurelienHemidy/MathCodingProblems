uniform float uTime;
uniform sampler2D uTexture;

varying vec2 vUv; 

void main() {

    vec2 newUV = vUv;

    newUV.x += sin(uTime * 0.2) * 0.01;
    newUV.y += sin(uTime * 0.3) * 0.01;

    vec4 tex = texture2D(uTexture, newUV);

    vec3 waterColor = vec3(0.0, 0.0, 0.5);

    waterColor += tex.xyz;

    gl_FragColor = vec4(tex.xyz, 1.);
    // gl_FragColor = tex;
}