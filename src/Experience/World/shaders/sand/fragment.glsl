uniform float uTime;
uniform float uProgress;
uniform vec3 uMouse;
uniform sampler2D uTexture;

varying vec2 vUv;
varying vec3 vDirection;
varying vec3 vPosition;
uniform vec3 uResolution;
uniform vec3 uMouseBehind;

void main() {

    

    vec2 uv = gl_FragCoord.xy / uResolution.xy;

    // vec2 newMouse = uMouse + vec2(0.5);
    // float dist = smoothstep(10. * (1.+ 5. * uProgress), 0.3, length(vPosition - uMouse));
    float distFront = smoothstep(0., .4, length(vPosition - uMouse));
    float distBack = smoothstep(0., .4, length(vPosition - uMouseBehind));

    float distFront2 = step(5., length(vPosition - uMouse));

    vec4 tex = texture2D(uTexture, uv);

    float center = length(gl_PointCoord.xy - vec2(0.5));

    float centerSmooth = smoothstep( 0.5, 0.2, center);

    vec4 color = tex * centerSmooth * 2.;

    gl_FragColor = vec4(uv, 1.0, 1.);
    gl_FragColor = vec4(centerSmooth, centerSmooth, centerSmooth, 1.);
    gl_FragColor = color;

    // if (gl_FragColor.r < 0.01) discard;
    // gl_FragColor = vec4(1. - distFront * distBack, 1. - distFront * distBack, 1. - distFront * distBack, 1.);
    // gl_FragColor = vec4(1., 1., 1., 1.);
    // gl_FragColor = vec4(distFront2, distFront2, distFront2, 1.);

}