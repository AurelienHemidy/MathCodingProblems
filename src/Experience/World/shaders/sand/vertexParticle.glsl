#define NUM_OCTAVES 5
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vDirection;
varying vec3 vPosition;

uniform vec3 uMouse;
uniform vec3 uMouseBehind;
uniform float uProgress;
uniform float uTime;
uniform float uHover;
uniform vec3 uCameraPos;

attribute vec3 aDirection;
attribute vec3 aNormal;

const float PI = 3.141592653589793;

//	Classic Perlin 3D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

mat3 rotateX(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(1, 0, 0),
        vec3(0, c, -s),
        vec3(0, s, c)
    );
}


void main() {

    // vec2 newMouse = uMouse + vec2(0.5);

    // float dist = smoothstep(0.8 + 0.1, 0.1, length(uv - newMouse));

    vec3 newpos = position;

    // // vec2 dir = 

    // newpos += cnoise(position + uTime * 0.01 - cnoise(position)) * uProgress;

    // newpos += mod(aDirection * uTime * 0.05, 2.) * (1. - uProgress);

    // newpos.x += cos(uTime * 0.1) + cos(PI * aDirection.x);
    // newpos.z += sin(uTime * 0.1) + sin(PI * aDirection.z);
    // newpos.y = sin(aDirection.y + uTime * 0.2);

    // newpos.y += sin(aDirection.y);

    // x = r * cos(s) * sin(t)
    // y = r * sin(s) * sin(t)
    // z = r * cos(t)

    newpos.x = .8 *  cos(2. * PI * position.x + uTime * 0.01) * sin(2. * PI * position.y + uTime * 0.01  + (1. * uProgress * 1.)) ;
    newpos.y = .8 * sin(2. * PI * position.x + uTime * 0.01) * sin(2. * PI * position.y + uTime * 0.01 + (1. * uProgress * 1.4));
    newpos.z = .8 * cos(2. * PI * position.y + uTime * 0.01);
    // newpos.x = 2. * cos(2. * PI * position.x) * sin(2. * PI * position.y) * 5. ;
    // newpos.y = 2. * sin(2. * PI * position.x) * sin(2. * PI * position.y) * 5. ;
    // newpos.z = 2. * cos(2. * PI * position.y) * 5. ;


    float distFront = smoothstep(0., 0.4, length(newpos - uMouse));
    float distBack = smoothstep(0., 0.4, length(newpos - uMouseBehind));

    float dist = 1. - distFront * distBack;

    float distFront2 = step(5., length(newpos - uMouse));


    // newpos.xyz += dot(newpos, vec3(dist)) * aDirection * 0.8 * cnoise(newpos * uTime * 0.1);
    // newpos.xyz += cross(newpos, vec3(distFront)) * aDirection * 0.8 * cnoise(newpos * uTime * 0.1);
    // newpos.xyz += cross(newpos, vec3(distBack)) * aDirection * 0.8 * cnoise(newpos * uTime * 0.1);
    // newpos.y = sin(2. * PI * position.x) * position.y;
    // newpos.y = cos(2. * PI * position.y) * position.y;
    
    // newpos.x += cross(normalize(uMouse), vec3(0., 1., 0.)).x * distFront * 10.;
    
    // newpos.z += cross(normalize(uMouse), uCameraPos).z * distFront * distBack * 10.;
    newpos *= 1. + cnoise(newpos * 10. + uTime * 0.1 ) * dist  * uHover * (dot(newpos, uCameraPos));

    newpos *= rotateX(-0.05);

    // Explosion
    // newpos *= 1. + cnoise(newpos + uTime * 0.01 ) * dist * 0.3 - dot(uCameraPos, newpos) * uHover;


    // newpos *= sin(uTime * 0.01) + 1. + cnoise(position + uTime * 0.01 - cnoise(position)) * uProgress;

    // // sin(uv.x + uTime * 0.2) * 0.1


// (1. + uProgress * 4.)
// * (2. - dot(normalize(uCameraPos), normalize(newpos)))
    vec4 mvPosition = modelViewMatrix * vec4(newpos, 1.0);
    gl_PointSize = 15.  * (1. / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    vUv = uv;
    vDirection = aDirection;
    vPosition = newpos;
}