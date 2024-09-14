attribute vec2 coordinates;

varying vec2 uv;

void main(void) 
{
    gl_Position = vec4(coordinates, 0.0, 1.0);
    uv = vec2(coordinates.x +0.5, coordinates.y + 0.5);
}