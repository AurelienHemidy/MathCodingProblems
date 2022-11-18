uniform float uProgress;
uniform float uDirection;
uniform float uTime;

varying vec2 vUv;

void main() {
    

    vec3 newPos = position;

    float dist = length(uv - vec2(0.5) );

    float maxDist = length(vec2(0.5));

    float normalizedDist = dist/maxDist;

    float stickTo = normalizedDist;
    float stickOut = -normalizedDist;

    // Inverse the way based on direction
    float stickEffect = mix(stickTo, stickOut, uDirection);

    float uProgress1 = min(2. * uProgress, 2. * (1. - uProgress));

    // Inverse the timing based on direction
    float progressMove = mix(clamp(2. * uProgress, 0., 1.0), clamp(1. - 2.* (1. - uProgress), 0., 1.0), uDirection);

    float zOffset = 4.;

    newPos.z +=  zOffset*(stickEffect * uProgress1 - progressMove);

    newPos.z += uProgress * sin(dist * 10. + uTime) * 0.1;


    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);

    vUv = uv;
}