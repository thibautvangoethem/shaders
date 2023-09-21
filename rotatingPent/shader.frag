//https://www.shadertoy.com/view/DtSBRm

vec2 rotate(vec2 v, float rotation) {
	float sine = sin(rotation);
	float cosine = cos(rotation);
	mat2 rotator = mat2(cosine, sine, -sine, cosine);
	return rotator * v;
}

//thanks https://iquilezles.org/articles/distfunctions2d/
float sdPentagon( in vec2 p, in float r )
{
    vec3 k = vec3(0.809016994,0.587785252,0.726542528);
    p.x = abs(p.x);
    p -= 2.0*min(dot(vec2(-k.x,k.y),p),0.0)*vec2(-k.x,k.y);
    p -= 2.0*min(dot(vec2( k.x,k.y),p),0.0)*vec2( k.x,k.y);
    p -= vec2(clamp(p.x,-r*k.z,r*k.z),r);    
    return length(p)*sign(p.y);
}

vec3 drawRotPent(vec2 uv,vec2 pos, float size, float timeModulate){
    uv=rotate(uv,iTime*timeModulate);
    float sd=sdPentagon(uv,size);
    sd=abs(sd);
    sd=sin(sd*16.0 + iTime*8.0*timeModulate)/16.0;
    //float result = smoothstep(0.01,0.02,sd);
    float result =sd;
    
    result=0.1/result;
    // Time varying pixel color
    return vec3(result,result,result);
}

vec3 pallete(float t){
    vec3 a=vec3(0.500,0.500,0.500);
    vec3 b=vec3(0.500,0.500,0.500);
    vec3 c=vec3(1.000,1.000,1.000);
    vec3 d=vec3(0.000,0.333,0.667);
    return a+b*cos(6.28318*(c*t+d));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from -1 to 1)
    vec2 uv = (fragCoord*2.0-iResolution.xy)/iResolution.y;
    uv=rotate(uv,iTime);
    
  
    vec3 pent1 = drawRotPent(uv,vec2(0.0,0.0),0.5,0.2);
    vec3 pent2 = drawRotPent(uv,vec2(0.0,0.0),0.20,-0.1);
    //vec3 pent2 = drawRotPent(uv,vec2(0.0,0.0),1.0,-1.0);
    
    vec3 col=pallete(length(uv))*(pent1+pent2);
    // Output to screen
    fragColor = vec4(col,1.0);
}
