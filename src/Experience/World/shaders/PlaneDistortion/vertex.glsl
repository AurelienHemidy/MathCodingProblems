uniform float uProgress;

varying vec2 vUv;

void main() {
    

    vec3 newPos = position;

    float dist = length(uv - vec2(0.5) );

    float maxDist = length(vec2(0.5));

    float normalizedDist = dist/maxDist;

    float uProgress1 = min(2. * uProgress, 2. * (1. - uProgress));

    float progressMove = clamp(2. * uProgress, 0., 1.0);

    float zOffset = 4.;


    newPos.z +=  zOffset*(normalizedDist * uProgress1 - progressMove);

    // newPos.z -= 2. * progressMove;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);

    vUv = uv;
}