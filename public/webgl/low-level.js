//GLOBALS
const GLOBAL = {}

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
    const vertShader = compileShader(vertCode, GLOBAL.gl.VERTEX_SHADER, GLOBAL.gl);
    const fragShader = compileShader(fragCode, GLOBAL.gl.FRAGMENT_SHADER, GLOBAL.gl);

    if (!vertShader || !fragShader) {
        console.error("Shader compilation failed.");
        return null;
    }

    const shaderProgram = GLOBAL.gl.createProgram();

    GLOBAL.gl.attachShader(shaderProgram, vertShader);
    GLOBAL.gl.attachShader(shaderProgram, fragShader);
    GLOBAL.gl.linkProgram(shaderProgram);

    // Check for linking errors
    if (!GLOBAL.gl.getProgramParameter(shaderProgram, GLOBAL.gl.LINK_STATUS)) {
        console.error("Shader program linking error: " + GLOBAL.gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function compileShader(source, type) {
    const shader = GLOBAL.gl.createShader(type);
    GLOBAL.gl.shaderSource(shader, source);
    GLOBAL.gl.compileShader(shader);

    // Check for compilation errors
    if (!GLOBAL.gl.getShaderParameter(shader, GLOBAL.gl.COMPILE_STATUS)) {
        console.error("Shader compilation error (" + (type === GLOBAL.gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT") + "): " + GLOBAL.gl.getShaderInfoLog(shader));
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
    GLOBAL.projectName = projectName;
    GLOBAL.shouldRun = true;
    GLOBAL.canvas = document.getElementById('glcanvas');
    GLOBAL.gl = GLOBAL.canvas.getContext('experimental-webgl');
    GLOBAL.shaderProgram = await loadShaderProgram("projects/shaders/" + projectName + ".vert", "projects/shaders/" + projectName + ".frag");

    setup();

    loop();
}

function loop() {
    update();

    if(GLOBAL.shouldRun)
        requestAnimationFrame(loop());
}

function stop() {
    GLOBAL.shouldRun = false;
}