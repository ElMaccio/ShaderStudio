var canvas = document.getElementById('glcanvas');
var gl = canvas.getContext('experimental-webgl');
var shouldRun = true;

var vertices = [
    // Positions      // UVs
    -0.5,  0.5,       0.0, 1.0,  // Top-left corner
    -0.5, -0.5,       0.0, 0.0,  // Bottom-left corner
     0.0, -0.5,       0.5, 0.0   // Bottom-center corner
];

async function setupWebGL(shaderProgram)
{
    // Create a new buffer object
    var vertex_buffer = gl.createBuffer();

    // Bind an empty array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.useProgram(shaderProgram);

    //Get the attribute location
    let coord = gl.getAttribLocation(shaderProgram, "coordinates");

    if (coord === -1) {
        console.error("coordinates attribute not found in the shader");
    }

    //4 is sizeof(float)
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 4 * 4, 0);
    gl.enableVertexAttribArray(coord);

    let uv = gl.getAttribLocation(shaderProgram, "uv");

    if (uv === -1) {
        console.error("uv attribute not found in the shader");
    }

    gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 4 * 4, 2 * 4);
    gl.enableVertexAttribArray(uv);

    // Clear the canvas
    gl.clearColor(0.5, 0.5, 0.5, 0.9);
    gl.enable(gl.DEPTH_TEST); 
    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);

    shouldRun = true;
    renderLoop();

    return gl;
}

function renderLoop() {
    // Clear the canvas for the next frame
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw the triangle (or other shapes)
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Request the next frame
    if(shouldRun)
        requestAnimationFrame(renderLoop);
}

async function getShaderCode(vertPath, fragPath)
{
    try {
        const [vertCode, fragCode] = await Promise.all([
            fetch(vertPath).then(response => response.ok ? response.text() : Promise.reject(response.statusText)),
            fetch(fragPath).then(response => response.ok ? response.text() : Promise.reject(response.statusText))
        ]);
        return [vertCode, fragCode];
    } catch (error) {
        console.error("Error fetching shader code:", error);
        throw new Error("Shader fetch failed");
    }
}

function createShaderProgram(vertCode, fragCode)
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

function compileShader(source, type) {
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
    
    const shaderProgram = createShaderProgram(shaders[0], shaders[1]);

    return shaderProgram
}

async function start(projectName) {
    const shaderProgram = await loadShaderProgram("projects/shaders/" + projectName + ".vert", "projects/shaders/" + projectName + ".frag");

    setupWebGL(shaderProgram);
}

function stop() {
    shouldRun = false;
}

console.log("loaded");