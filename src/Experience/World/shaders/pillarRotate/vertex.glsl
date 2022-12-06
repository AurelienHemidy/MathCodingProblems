varying vec2 vUv;
varying vec3 vNormal;

uniform float uTime;
uniform float uDiff;
uniform float uProgress;

float cubicPulse( float c, float w, float x ){
    x = abs(x - c);
    if( x>w ) return 0.0;
    x /= w;
    return 1.0 - x*x*(3.0-2.0*x);
}

void main() {

    float distortCurve = cubicPulse(0.5,1.,uv.x);

    float dist = length(uv - vec2(0.5));
    

    vec3 newpos = position;

    newpos.z += sin(dist * 10. + uTime / 2.) * 0.2 * uProgress;

    newpos.z += distortCurve * uDiff * 20.;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);

    vUv = uv;
    vNormal = normal;
}