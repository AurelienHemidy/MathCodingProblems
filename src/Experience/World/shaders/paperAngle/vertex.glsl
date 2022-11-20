uniform vec2 uMouse;
uniform float uProgress;
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

void main() {

    float distanceFromMouse = length(uv - uMouse);
    float distStep = smoothstep(0.5, 0., distanceFromMouse);
    float centeredLength = step( 0.2, length( vUv - vec2(0.5)) / 2.); 

    distStep *= centeredLength;

    // clamp(distStep, 0., 1.0);


    float tX = map(uv.x, 0.8, 1.0, 0., 1.0);

    float newZ = step(0.8, uv.x) * tX * tX * 0.2;
    float newX = step(0.8, uv.x) * sin(tX * 3.14) * 0.2 -  step(0.8, uv.x) * 0.2;

    float newY = step(0.8, uv.y) * cos(tX * 3.14) * 0.2 -  step(0.8, uv.y) * 0.2;
    // if (uv.x < 0.9) {newX * 0.001;}
    // float newX = step(0.8, uv.x) * min(0., sin(map(uv.x, 0.8, 1.0, 0., 1.0) * 3.14 + 1.55)) * 0.1;
    // newX = step(0.8, uv.x) * sin((tX - 1.) * 3.14) * floor(tX);


    vec3 newPos = position;

    newPos.z += newZ * distStep;

    newPos.x += newX * distStep;


    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);

    vUv = uv;
    vNormal = normal;
}