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
    const buttonParent = document.createElement('div');
    buttonParent.className = "project-item";

    const button = document.createElement('button');
    button.className = "fileBtn";
    button.addEventListener('click', () => {
        window.location = window.location.href + "editor?project=" + name;
    });
    button.textContent = name;

    const deleteButton = document.createElement('button');
    deleteButton.className = "deleteBtn";
    deleteButton.textContent = "✖";
    deleteButton.addEventListener('click', async () => {
        await deleteProject(name);
        clearProjects();
        await loadProjects();
    });

    buttonParent.appendChild(button);
    buttonParent.appendChild(deleteButton);

    document.querySelector(".project-list").appendChild(buttonParent);
}

async function deleteProject(name) {
    const response = await fetch('/deleteProject', {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name
        })
    });

    const responseBody = await response.json();

    if(response.ok)
        console.log(responseBody. message);
    else
        console.log(responseBody.error);
}

function clearProjects() {
    document.querySelector(".project-list").innerHTML = "";
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