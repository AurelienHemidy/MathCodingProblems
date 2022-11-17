varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;

uniform vec2 uResolution;
uniform vec3 uMouse;

uniform sampler2D uTexture;
uniform sampler2D uDisplacement;

uniform float uProgress;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
    vec2 directionFromMouse = normalize(vPosition.xy - uMouse.xy);

    float distanceFromMouse = length(vPosition - uMouse);

    float prox = clamp(1. - map( distanceFromMouse, 0., 0.2, 0.,1.), 0., 1.0);

    // color *= distanceMap;

    // Some distortion on image with mouse
    vec2 zoomedUV = vUv + directionFromMouse * prox * 0.02;

    // Zoomed on mouse
    vec2 zoomedUV1 = mix(vUv, uMouse.xy + vec2(0.5), prox* 0.3);
    
    vec4 color = texture2D(uTexture, zoomedUV);

    gl_FragColor = vec4(color.xyz, 1.0);

    if (gl_FragColor.x < 0.0001) discard;
    gl_FragColor = color;

    //===============================//
    //===============================//

    // float distanceFromMouse = length(vPosition - uMouse);

    // float proximity = clamp(1. - map( distanceFromMouse, 0., 1., 0.,1.), 0., 1.0);

    // vec4 displace = texture2D(uDisplacement, vUv.yx);

    
    // vec2 displaceUV = vec2(
    //     vUv.x,
    //     vUv.y 
    // );

    // displaceUV.y = mix(vUv.y, displace.x - 0.2, uProgress);

    
    // vec4 color = texture2D(uTexture, vUv);

    // color.r = texture2D(uTexture, displaceUV + vec2(0., 0.02) * uProgress).r;
    // color.g = texture2D(uTexture, displaceUV + vec2(0., 0.07) * uProgress).g;
    // color.b = texture2D(uTexture, displaceUV + vec2(0., 0.09) * uProgress).b;


    // displace += proximity * 0.7;
    // displace.w *= 1. - proximity * 0.001;

    // displace.xyz += (cos(uTime) + 1.) * 0.001;

    // color *= displace;



    // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    // gl_FragColor = color;
    
}