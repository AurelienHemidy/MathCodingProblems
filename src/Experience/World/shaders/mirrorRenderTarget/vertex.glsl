#define NUM_OCTAVES 5
const float PI = 3.141592653589793;

varying vec2 vUv;
varying vec3 vNormal;

uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uDisplacement;

float rand(float n){return fract(sin(n) * 43758.5453123);}

float noise(float p){
	float fl = floor(p);
  float fc = fract(p);
	return mix(rand(fl), rand(fl + 1.0), fc);
}

float fbm(float x) {
	float v = 0.0;
	float a = 0.5;
	float shift = float(100);
	for (int i = 0; i < NUM_OCTAVES; ++i) {
		v += a * noise(x);
		x = x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}


void main() {
    vec4 disp = texture2D(uDisplacement, uv);

    float quo = fbm(uTime * 0.1);

    vec3 newpos = position;

    newpos += fbm(disp.r + uTime * 0.05) ;




    gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);

    vUv = uv;
    vNormal = normal;
}