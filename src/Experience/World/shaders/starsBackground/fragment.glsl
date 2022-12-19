uniform float uTime;
uniform vec3 uResolution;

varying vec2 vUv; 
// varying vec3 vColor; 

void main() {

    // float dist = smoothstep(0.2, 0., length(gl_PointCoord.xy - vec2(0.5)));

    // gl_FragColor = vec4(vColor * dist, length(gl_PointCoord.xy - vUv));

    // //Clear fragcolor
    gl_FragColor *= 0.;
    
    //Line dimensions (box) and position relative to line
    vec2 b = vec2(0,.2), p;
    //Rotation matrix
    mat2 R;
    //Iterate 20 times
    for(float i=.95; i++<10.;
        //Add attenuation
        gl_FragColor += 1e-3/length(clamp(p=R
        //Using rotated boxes
        *(fract((vUv*i*.1+uTime * 0.01*b)*R)-.5),-b,b)-p)
        //My favorite color palette
        *(cos(p.y/.1+vec4(5,4,2,1))+1.) )
        //Rotate for each iteration
        R=mat2(cos(i+vec4(0,33,10,0)));
        gl_FragColor.a = 1.;

        // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}