const params = new URLSearchParams(window.location.search);
const currentProjectName = params.get('project');

var currentFile = "";

function loadFile(filePath) {
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
        console.log(data);
        refreshShaders("projects/shaders/" + currentProjectName + ".vert", "projects/shaders/" + currentProjectName + ".frag");
    })
    .catch(error => console.error('Error updating file:', error));
}

document.getElementById("editor").addEventListener('keydown', function (event) {
    if(event.key==='Tab') {
        event.preventDefault();
        var v = this.value, s = this.selectionStart, e = this.selectionEnd;
        this.value = v.substring(0, s)+'\t'+v.substring(e);
        this.selectionStart = this.selectionEnd = s + 1;
        return false;
    }
});

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

    console.log(project);

    for(let s in project.shaders)
    {
        addFile("/projects/shaders/" + currentProjectName + "." + project.shaders[s]);
    }

    for(let s in project.scripts)
    {
        addFile("projects/scripts/" + currentProjectName + "." + project.scripts[s] + ".js");
    }
}

function addFile(filePath) {
    const button = document.createElement('button');
    button.className = "fileBtn";
    button.addEventListener('click', () => {
        loadFile(filePath);
    });
    const split = filePath.split('/');
    button.textContent = split[split.length-1];

    document.querySelector(".files-container").appendChild(button);
}

loadProject();

document.addEventListener('keydown', e => {
    if(e.ctrlKey && e.key === 's') {
        e.preventDefault();
        //TODO: save the shader files
        saveFile();
        //TODO: reload the gl window
    }
});