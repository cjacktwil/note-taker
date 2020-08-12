const express = require('express');
const fs = require('fs');
const path = require('path');

const { notes } = require('./db/db.json');

const PORT = process.env.PORT || 3003;

const app = express();

app.use(express.urlencoded({ extended: true}));

app.use(express.json());

app.use(express.static('public'));

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray}, null, 2)
    );
    return note;
};

// validation not needed - save button only appears when fields have content
// function validateNote(note) {
//     if (!note.name || typeof note.name !== 'string') {
//         return false;
//     }
//     if (!note.text || typeof note.text !== 'string') {
//         return false;
//     }
//     return true;
// };

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString();

    // if (!validateNote(req.body)) {
    //     res.status(400).send('Please be sure that the note has a title and some text.');
    // } else {
    const note = createNewNote(req.body, notes);

    res.json(req.body);
    // }
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});