vertices = [
    // Positions      // UVs
    -0.5,  0.5,       0.0, 1.0,  // Top-left corner
    -0.5, -0.5,       0.0, 0.0,  // Bottom-left corner
     0.0, -0.5,       0.5, 0.0   // Bottom-center corner
];

function setup() {
    var vertex_buffer = GLOBAL.gl.createBuffer();

    // Bind an empty array buffer to it
    GLOBAL.gl.bindBuffer(GLOBAL.gl.ARRAY_BUFFER, vertex_buffer);
    GLOBAL.gl.bufferData(GLOBAL.gl.ARRAY_BUFFER, new Float32Array(vertices), GLOBAL.gl.STATIC_DRAW);

    GLOBAL.gl.useProgram(GLOBAL.shaderProgram);

    //Get the attribute location
    let coord = GLOBAL.gl.getAttribLocation(GLOBAL.shaderProgram, "coordinates");

    if (coord === -1) {
        console.error("coordinates attribute not found in the shader");
    }

    //4 is sizeof(float)
    GLOBAL.gl.vertexAttribPointer(coord, 2, GLOBAL.gl.FLOAT, false, 4 * 4, 0);
    GLOBAL.gl.enableVertexAttribArray(coord);

    let uv = GLOBAL.gl.getAttribLocation(GLOBAL.shaderProgram, "uv");

    if (uv === -1) {
        console.error("uv attribute not found in the shader");
    }

    GLOBAL.gl.vertexAttribPointer(uv, 2, GLOBAL.gl.FLOAT, false, 4 * 4, 2 * 4);
    GLOBAL.gl.enableVertexAttribArray(uv);

    // Clear the canvas
    GLOBAL.gl.clearColor(0.5, 0.5, 0.5, 0.9);
    GLOBAL.gl.enable(GLOBAL.gl.DEPTH_TEST); 
    // Clear the color buffer bit
    GLOBAL.gl.clear(GLOBAL.gl.COLOR_BUFFER_BIT);

    // Set the view port
    GLOBAL.gl.viewport(0,0, GLOBAL.canvas.width, GLOBAL.canvas.height);
}

function update() {
    GLOBAL.gl.clear(GLOBAL.gl.COLOR_BUFFER_BIT | GLOBAL.gl.DEPTH_BUFFER_BIT);

    GLOBAL.gl.drawArrays(GLOBAL.gl.TRIANGLES, 0, 3);
}