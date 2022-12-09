uniform float uTime;
uniform vec2 uMouse;
uniform sampler2D uTexture;

varying vec2 vUv;
varying vec3 vDirection;
uniform vec3 uResolution;

void main() {

    

    vec2 uv = gl_FragCoord.xy / uResolution.xy;

    vec4 tex = texture2D(uTexture, uv);

    float center = length(gl_PointCoord.xy - vec2(0.5));

    float centerSmooth = smoothstep( 0.5, 0.2, center);

    vec4 color = tex * centerSmooth;

    gl_FragColor = vec4(uv, 1.0, 1.);
    gl_FragColor = vec4(centerSmooth, centerSmooth, centerSmooth, 1.);
    gl_FragColor = color;

    if (gl_FragColor.r < 0.01) discard;
    // gl_FragColor = vec4(dist, dist, dist, 1.0);
}