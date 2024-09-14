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

app.post('/getProject', (req, res) => {
    const name = req.body.name;

    console.log(req.body);

    if(!name)
        return res.status(400).json({error: `Project's name is required`});

    console.log(fs.readFileSync(path.join(__dirname, 'projects.json'), 'utf8'));

    let data = JSON.parse(fs.readFileSync(path.join(__dirname, 'projects.json'), 'utf8'));

    const foundData = data.find(x => x.name === name);

    if(foundData)
        return res.json(foundData);
    else
        return res.status(404).json({error: `Project not found`});
});

app.get('/getProjects', (req, res) => {
    return res.json(JSON.parse(fs.readFileSync(path.join(__dirname, 'projects.json'), 'utf8')));
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

app.post('/update-file', (req, res) => {
    if(updateFile(req.body.path, req.body.content))
        res.json({ message: 'File uploaded succesfully'});
    else
        return res.status(500).json({ message: "Error writing to file" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});