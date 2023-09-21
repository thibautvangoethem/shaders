//https://www.shadertoy.com/view/mlSfRw


vec3 pallete(float t){
    vec3 a=vec3(0.660,0.560,0.680);
    vec3 b=vec3(0.718,0.438,0.720);
    vec3 c=vec3(0.520,0.800,0.520);
    vec3 d=vec3(-0.430,-0.397,-0.083);
    return a+b*cos(6.28318*(c*t+d));
}

//Modified from https://iquilezles.org/articles/distfunctions2d/
float sdPentagon( in vec2 p, in float r )
{
    vec3 k = vec3(0.809016994,0.597785252,0.826542528);
    p.x = abs(p.x);
    p -= .85*min(dot(vec2(-k.x,k.y),p),0.0)*vec2(-k.x,k.y);
    p -= vec2(clamp(p.x,-r*k.z,r*k.z),r);    
    return length(p)*sign(p.y);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from -1 to 1)
    vec2 uv = (fragCoord*2.0-iResolution.xy)/iResolution.y;
    uv.y+=1.5;
    uv.y-=mod(iTime,4.0);
    
    float sd=sdPentagon(uv,0.5);
    sd=abs(sd);
    
    float result=sd;
    
    float resultCore=0.05/(smoothstep(0.0,1.0,result));
    float modulate=(abs(sin(iTime*4.0)/20.0))+0.01;
    float resultTrail=clamp(0.5,1.0,modulate/(smoothstep(0.0,1.0,result)));


    vec3 colMain=pallete(0.0)*resultCore;
    vec3 colTrail=pallete(10.0)*resultTrail;
    // Time varying pixel color
    //vec3 col = colMain+colTrail;
    vec3 col = colMain+colTrail;

    // Output to screen
    fragColor = vec4(col,1.0);
}