//https://www.shadertoy.com/view/mljBDR

float avgCol(vec4 col){
    return (col.x+col.y+col.z)/3.0;
}

//https://en.wikipedia.org/wiki/Sobel_operator
float sobelOperation(vec2 uv,float offsetx,float offsety){
    //center not actually needed for sobel operation
    //float center=avgCol(texture(iChannel0, uv));
    float centerLeft=avgCol(texture(iChannel0, uv+vec2(-offsetx,0.0)));
    float centerRight=avgCol(texture(iChannel0, uv+vec2(offsetx,0.0)));
    
    float top=avgCol(texture(iChannel0, uv+vec2(0.0,offsety)));
    float topLeft=avgCol(texture(iChannel0, uv+vec2(-offsetx,offsety)));
    float topRight=avgCol(texture(iChannel0, uv+vec2(offsetx,offsety)));
 
    float botom=avgCol(texture(iChannel0, uv+vec2(0.0,-offsety)));
    float botomLeft=avgCol(texture(iChannel0, uv+vec2(-offsetx,-offsety)));
    float botomRight=avgCol(texture(iChannel0, uv+vec2(offsetx,-offsety)));
    
    float op1=topLeft+2.0*centerLeft+botomLeft-topRight-2.0*centerRight-botomRight;
    float op2=topLeft+2.0*top+topRight-botomLeft-2.0*botom-botomRight;
    return sqrt(op1*op1 + op2*op2);
}



void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    //change this color to change the color of the border
    vec3 baseCol=vec3(1.0,1.0,0.0);
    //Set this to something static if you dont want pulsing
    float offset=abs(sin(iTime));
    //0 means show everything, the higher the value the less will be shown, 1=nothing
    float cuttoff=0.2;
    
    //This doesnt look great :/, but enable it if you want the simulation to pulsate, also uncomment the other line using this
    //Also doesnt interact well with the cuttof
    //float neonVal=0.01;
    
    
    vec2 uv = fragCoord/iResolution.xy; 
    
    vec3 normalCol=texture(iChannel0,uv).xyz;
    
    float sobelVal=sobelOperation(uv,offset/iResolution[0],offset/iResolution[0]);
    if(sobelVal<cuttoff){
         sobelVal=0.0;
    }
    
    //sobelVal=neonVal/sobelVal;
    vec3 sobelCol = vec3(sobelVal,sobelVal,sobelVal)*baseCol;
    
    
    //Add sobelmask ontop of the texture, remove the normalcol to get only the border
    vec3 col=normalCol+sobelCol;

    fragColor = vec4(col,1.0);
}