const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(express.json());

app.get('/editor', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/editor.html'));
});

const updateFile = (filePath, content) => {
    const fullFilePath = path.join(__dirname, filePath);

    let status = true;

    fs.writeFileSync(fullFilePath, content, 'utf8', (err) => {
        if(err){
            status = false;
        }
    });

    return status;
};

app.post('/getProject', (req, res) => {
    const name = req.body.name;

    if(!name)
        return res.status(400).json({error: `Project's name is required`});

    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'projects.json'), 'utf8'));

    const foundData = data.find(x => x.name === name);

    if(foundData)
        return res.json(foundData);
    else
        return res.status(404).json({error: `Project not found`});
});

app.get('/getProjects', (req, res) => {
    return res.json(JSON.parse(fs.readFileSync(path.join(__dirname, 'projects.json'), 'utf8')));
});

app.post('/createProject', (req, res) => {
    const name = req.body.name;
    const files = req.body.files;

    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'projects.json'), 'utf8'));

    if(data.find(x => x.name ===name))
        return res.status(400).json({error: `This name is already taken`});

    const project = {
        name: name,
        shaders: [],
        scripts: []
    };

    for(let f in files)
    {
        const splitFileName = files[f].split(".");
        const fileType = splitFileName.pop();

        const content = fs.readFileSync(path.join(__dirname, 'presets/' + files[f]), 'utf8');

        if(fileType == "js") {
            const scriptType = splitFileName.pop();
            updateFile("public/projects/scripts/" + name + "." + scriptType + ".js", content);
            project.scripts.push(scriptType);
        }
        else {
            updateFile("public/projects/shaders/" + name + "." + fileType, content);
            project.shaders.push(fileType);
        }
    }

    data.push(project);

    updateFile("projects.json", JSON.stringify(data));

    return res.json(req.body);
});

app.get('/getProjectPreset', (req, res) => {
    let preset = req.headers.preset;

    if(!preset)
        return res.status(400).json({error: "preset name is required"});

    preset = preset.split(' ').join('');

    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'project-presets.json'), 'utf8'));

    const presetData = data.find(x => x.name.split(' ').join('') === preset);

    if(!presetData)
        return res.status(404).json({error: "preset not found"});

    return res.json(presetData);
});

app.get('/getProjectPresets', (req, res) => {
    return res.json(JSON.parse(fs.readFileSync(path.join(__dirname, 'project-presets.json'), 'utf8')));
});

app.post('/update-file', (req, res) => {
    if(updateFile(req.body.path, req.body.content))
        res.json({ message: 'File uploaded succesfully'});
    else
        return res.status(500).json({ error: "Error writing to file" });
});

app.delete('/deleteProject', (req, res) => {
    const name = req.body.name;

    if(!name)
        return res.status(400).json({error: `Project's name is required`});

    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'projects.json'), 'utf8'));

    const foundIndex = data.findIndex(x => x.name === name);

    if(foundIndex === -1)
        return res.status(404).json({error: `Project not found`});

    const project = data[foundIndex];
    data.splice(foundIndex, 1);

    console.log(project);

    for(let s in project.shaders) {
        const fullFilePath = path.join(__dirname, "public/projects/shaders/" + project.name + "." + project.shaders[s]);

        console.log(fullFilePath);

        fs.unlinkSync(fullFilePath, (err) => {
            if(err)
                console.log(err);
            else
                console.log("working");
        });
    }

    for(let s in project.scripts) {
        const fullFilePath = path.join(__dirname, "public/projects/scripts/" + project.name + "." + project.scripts[s] + ".js");

        console.log(fullFilePath);

        fs.unlinkSync(fullFilePath, (err) => {
            if(err)
                console.log(err);
            else
                console.log("working");
        });
    }

    updateFile('projects.json', JSON.stringify(data));

    return res.json({message: "Succesfully deleted project: " + name});
});

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});