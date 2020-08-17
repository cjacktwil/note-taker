const express = require('express');
const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');

const { notes } = require('./db/db.json');
const { query } = require('express');

const PORT = process.env.PORT || 3003;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

//function to create a new note
function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    return note;
};

//function to find a note by its ID
function findNoteById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
};

//get notes from api
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

//get index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//get notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//post new note to api
app.post('/api/notes', (req, res) => {
    req.body.id = uniqid();

    const note = createNewNote(req.body, notes);

    res.json(note);
});

//partially working delete function - removes note but not spot in list
app.delete('/api/notes/:id', (req, res) => {
    const chosen = findNoteById(req.params.id, notes);
    console.log(chosen);

    //iterate through array to find chosen note
    for (let i = 0; i < notes.length; i++) {
        if (chosen === notes[i]) {
            //remove content from note and overwrite to database
            notes[i] = {};
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify({ notes }, null, 2))
        }
    };
    res.json(notes);
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});