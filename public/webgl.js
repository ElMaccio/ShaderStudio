var canvas = document.getElementById('glcanvas');
var gl = canvas.getContext('experimental-webgl');

var vertices = [-0.5, 0.5, -0.5, -0.5, 0.0, -0.5,];

async function setupWebGL(shaderProgram)
{
    // Create a new buffer object
    var vertex_buffer = gl.createBuffer();

    // Bind an empty array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Pass the vertices data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.useProgram(shaderProgram);

    //Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    //Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");

    //point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

    //Enable the attribute
    gl.enableVertexAttribArray(coord);

    /* Step5: Drawing the required object (triangle) */

    // Clear the canvas
    gl.clearColor(0.5, 0.5, 0.5, 0.9);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST); 

    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    return gl;
}

async function getShaderCode(vertPath, fragPath)
{
    const fragCode = await fetch(fragPath).then((response) => response.text()).then((data) => { return data;});
    const vertCode = await fetch(vertPath).then((response) => response.text()).then((data) => { return data;});

    return [vertCode, fragCode];
}

function createShaderProgram(vertCode, fragCode, gl)
{
    const vertShader = compileShader(vertCode, gl.VERTEX_SHADER, gl);
    const fragShader = compileShader(fragCode, gl.FRAGMENT_SHADER, gl);

    if (!vertShader || !fragShader) {
        console.error("Shader compilation failed.");
        return null;
    }

    const shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);

    // Check for linking errors
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error("Shader program linking error: " + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function compileShader(source, type, gl) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Check for compilation errors
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error (" + (type === gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT") + "): " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

async function loadShaderProgram(vertPath, fragPath) {
    const shaders = await getShaderCode(vertPath, fragPath);
    
    const shaderProgram = createShaderProgram(shaders[0], shaders[1], gl);

    return shaderProgram
}

async function refreshShaders(vertPath, fragPath) {
    const shaderProgram = await loadShaderProgram(vertPath, fragPath);

    setupWebGL(shaderProgram);
}

refreshShaders("projects/shaders/shader.vert", "projects/shaders/shader.frag");
