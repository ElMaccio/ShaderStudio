document.getElementById("newProjectForm").addEventListener('submit', async (e) => {
    e.preventDefault();

    const projectName = document.getElementById("projectName").value;

    const projectPresetName = document.getElementById("projectType").value;

    let response = await fetch('/getProjectPreset', {
        method: "GET",
        headers: {
            preset: projectPresetName
        }
    });
    const projectPreset = await response.json();

    response = await fetch('/createProject', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: projectName,
            files: projectPreset.files
        })
    });

    console.log(response);

    const message = await response.json();

    if(!response.ok)
        //TODO: Add a better popup
        alert(message.error);

    console.log(message);

    clearProjects();
    loadProjects();
});