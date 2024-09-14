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

loadProjects();