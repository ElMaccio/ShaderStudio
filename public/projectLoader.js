async function loadProjects() {
    const response = await fetch('/getProjects', {
        method: 'GET'
    });

    const projects = await response.json();

    for(let p in projects)
    {
        addProjectButton(projects[p].name);
    }
}

function addProjectButton(name) {
    const button = document.createElement('button');
    button.className = "fileBtn";
    button.addEventListener('click', () => {
        window.location = window.location.href + "editor?project=" + name;
    });
    button.textContent = name;

    document.querySelector(".project-list").appendChild(button);
}

async function loadProjectPresets() {
    const response = await fetch("/getProjectPresets", {
        method: "GET"
    });
    const presets = await response.json();

    console.log(presets);

    for(let p in presets)
    {
        addPresetOption(presets[p].name);
    }
}

function addPresetOption(name) {
    const option = document.createElement('option');
    option.innerText = name;
    option.value = name;
    document.getElementById("projectType").appendChild(option);
}

loadProjectPresets();
loadProjects();