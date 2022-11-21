uniform vec2 uMouse;
uniform float uSpeed;
uniform sampler2D uTexture;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vBary;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}


void main() {

    float distanceFromMouse = smoothstep(0.2, 0., length(vUv - uMouse));

    vec2 direction = normalize(vUv - uMouse);

    vec2 last = uMouse - direction;

    vec4 color = texture2D(uTexture, vUv + distanceFromMouse * uSpeed * 5. );

    gl_FragColor = vec4(distanceFromMouse * uSpeed * 2., distanceFromMouse * uSpeed * 2., distanceFromMouse * uSpeed * 2., 1.0);
    gl_FragColor = color;
    gl_FragColor = vec4(vUv, 0.0, 1.0);


  float width = 1.0;

  vec3 d = fwidth(vBary);
  vec3 s = smoothstep(d * (width + 0.5), d* (width - 0.5), vBary);

  float line = max(s.x, max(s.y, s.z));
  gl_FragColor = vec4(vec3(line), 1.0);
}