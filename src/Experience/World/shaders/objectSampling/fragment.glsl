uniform float uTime;

varying vec2 vUv; 
varying vec3 vColor;
varying vec3 vPosition;
varying float vNoise;

void main() {

    

    float disc = smoothstep(0.5, 0.2, length(gl_PointCoord - vec2(0.5)));
    
    vec3 color = vColor * disc;

    gl_FragColor = vec4(disc,disc,disc, disc);
    gl_FragColor = vec4(color, disc * 0.5 * vNoise);

    if (gl_FragColor.r < 0.01) discard;
}