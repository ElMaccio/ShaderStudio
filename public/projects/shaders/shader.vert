attribute vec2 coordinates;

varying vec2 uv;

void main(void) 
{
	gl_Position = vec4(coordinates, 0.0, 1.0);
	uv = coordinates + 0.5;
}