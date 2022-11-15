varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;

uniform vec2 uResolution;
uniform vec3 uMouse;

uniform sampler2D uTexture;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
    // vec2 directionFromMouse = normalize(vPosition.xy - uMouse.xy);

    // float distanceFromMouse = length(vPosition - uMouse);

    // float prox = clamp(1. - map( distanceFromMouse, 0., 0.2, 0.,1.), 0., 1.0);

    // // color *= distanceMap;

    // // Some distortion on image with mouse
    // vec2 zoomedUV = vUv + directionFromMouse * prox * 0.02;

    // // Zoomed on mouse
    // vec2 zoomedUV1 = mix(vUv, uMouse.xy + vec2(0.5), prox* 0.3);
    
    // vec4 color = texture2D(uTexture, zoomedUV1);

    // gl_FragColor = vec4(color.xyz, 1.0);

    // if (gl_FragColor.x < 0.0001) discard;
    // gl_FragColor = color;

    //===============================//
    //===============================//

    float distanceFromMouse = length(vPosition - uMouse);

    float proximity = clamp(1. - map( distanceFromMouse, 0., 1., 0.,1.), 0., 1.0);



    gl_FragColor = vec4(proximity, proximity, proximity, 1.0);
    
}