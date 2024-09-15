const params = new URLSearchParams(window.location.search);
const currentProjectName = params.get('project');

const scripts = [];
const scriptObjects = [];

var currentFile = "";

function loadFile(filePath) {

    // console.log(filePath);

    // // fetch(filePath)
    // //     .then(response => response.text())
    // //     .then(data => {
    // //         document.getElementById('editor').value = data;
    // // });

    // return fetch(filePath)
    //     .then(response => response.text()).then(data => {
    //         document.getElementById('editor').value = data;
    //     });

    // currentFile = filePath;

    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById('editor').value = data;
    });

    currentFile = filePath;
}

function saveFile() {

    const newContent = document.getElementById('editor').value;

    fetch('/update-file', {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                content: newContent,
                path: "public/" + currentFile
            }),
    })
    .then(response => response.text())
    .then(data => {
        runScripts();
        refreshScripts();
    })
    .catch(error => console.error('Error updating file:', error));
}

async function loadProject() {
    const response = await fetch('/getProject', {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                name: currentProjectName
            }),
    });

    const project = await response.json();

    for(let s in project.shaders)
    {
        addFile("/projects/shaders/" + currentProjectName + "." + project.shaders[s]);
    }

    for(let s in project.scripts)
    {
        const scriptPath = "projects/scripts/" + currentProjectName + "." + project.scripts[s] + ".js";
        addFile(scriptPath);
        scripts.push(scriptPath);
    }
    
    runScripts();

    const s = document.createElement('script');

    if(project.scripts.length === 0) {
        s.src = "./webgl/shader-only.js";
    }
    else if(project.scripts.includes("low")) {
        s.src = "./webgl/low-level.js";
    }
    else {
        s.src = "./webgl/high-level.js";
    }
    
    s.onload = () => {refreshScripts();}
    document.body.appendChild(s);
}

function addFile(filePath) {
    const button = document.createElement('button');
    button.className = "fileBtn";
    button.addEventListener('click', () => {
        if(currentFile !== "")
            saveFile();
        loadFile(filePath);
    });
    const split = filePath.split('/');
    button.textContent = split[split.length-1];

    document.querySelector(".files-container").appendChild(button);
}

function refreshScripts() {
    stop();
    start(currentProjectName);
}

function runScripts() {
    for(let s in scriptObjects) {
        scriptObjects[s].remove();
    }

    for(let s in scripts) {
        const script = document.createElement('script');
        script.src = scripts[s];
        document.body.appendChild(script);
        scriptObjects.push(script);
    }
}

document.addEventListener('keydown', e => {
    if(e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveFile();
        //TODO: reload the gl window
        refreshShaders("projects/shaders/" + currentProjectName +".vert", "projects/shaders/" + currentProjectName +".frag");
    }
});

document.getElementById("editor").addEventListener('keydown', function (event) {
    if(event.key==='Tab') {
        event.preventDefault();
        var v = this.value, s = this.selectionStart, e = this.selectionEnd;
        this.value = v.substring(0, s)+ '\t' +v.substring(e);
        this.selectionStart = this.selectionEnd = s + 1;
        return false;
    }
});

loadProject();