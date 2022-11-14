varying vec2 vUv;
varying vec3 vNormal;

uniform float uTime;

uniform vec2 uResolution;

// void main() {

//     // float t = cos(uTime * 0.2) * 0.5 + 0.5;
//     // vec2 uvCentered = vUv * 2. - 1.;

//     // float radius = length(uvCentered);

//     // vec3 color = vec3(radius) * vec3(1.0, 0., 0.);

    

//     gl_FragColor = vec4(vec3(vUv.x), 1.0);
// }

vec3 hash (vec3 p)
{
    p *= mat3(189,  75, 121, 
              122, 220,  62, 
               34,  96, 162);
    return fract(sin(p) * 4328395.432885) * 2. - 1.;
}

float perlin3 (vec3 p)
{
    vec3 F = floor(p), f = fract(p);

#define W(x,y,z) dot( f-vec3(x,y,z), hash( F+vec3(x,y,z) ) )

    p = f * f * (3. - 2. * f); // smoothstep
    
    float x1 = mix(W(0, 0, 0), W(1, 0, 0), p.x),
          x2 = mix(W(0, 1, 0), W(1, 1, 0), p.x),
          x3 = mix(W(0, 0, 1), W(1, 0, 1), p.x),
          x4 = mix(W(0, 1, 1), W(1, 1, 1), p.x),
          y1 = mix(x1, x2, p.y),
          y2 = mix(x3, x4, p.y);
    
    return mix(y1, y2, p.z);
}

vec2 rotate (vec2 p, float r)
{
    r *= 3.1415926 / 180.0;
    float x = p.x * cos(r) - p.y * sin(r);
    float y = p.x * sin(r) + p.y * cos(r);
    return vec2(x, y);
}

void main()
{
	vec2 uv = gl_FragCoord.xy / uResolution.xy * 2.0 - 1.0;
    
    vec2 ws = uv;
    ws.x *= uResolution.x / uResolution.y;
    ws *= 16.0;
    
    ws = rotate(ws, 45.0 * abs(uv.x) * 1.0);
    
    float r = perlin3(vec3(ws, uTime * 0.05));

    ws = rotate(ws, r * 180.0);
    ws = mod(ws, 2.0);
    float c = dot(ws, vec2(1.0, 1.0)) * 0.5 - 0.5 * length(abs(uv * 2.0 - 1.0));
	gl_FragColor = vec4(c, c, c, 1.0);
}
