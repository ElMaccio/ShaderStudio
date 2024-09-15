precision mediump float;

varying vec2 colorUV;

void main(void)
{ 
    gl_FragColor = vec4(colorUV, 1.0, 1.0);
}
