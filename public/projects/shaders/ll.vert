attribute vec2 coordinates;
attribute vec2 uv;

varying vec2 colorUV;

void main(void) 
{
    gl_Position = vec4(coordinates, 0.0, 1.0);
    colorUV = uv;
}