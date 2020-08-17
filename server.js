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

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    return note;
};

function findNoteById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
};

// function validateNote(notesArray) {
//     const newNoteArray = notesArray.filter(note => !note.body);
//     console.log(newNoteArray);
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
    req.body.id = uniqid();

    const note = createNewNote(req.body, notes);

    res.json(note);
});
//working on delete function - don't want to delete link, how do I pull out specific note? need to use id...
app.delete('/api/notes/:id', (req, res) => {
    // let id = req.params.id;
    const chosen = findNoteById(req.params.id, notes);
    // console.log(id);
    console.log(chosen);

    for (let i = 0; i < notes.length; i++) {
        // console.log(notes[i]);
        if (chosen === notes[i]) {
           notes[i] = {};
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify({ notes }, null, 2))
            }
            
        // .then(() => {
        //     res.json({success: true});
        // })
        // .catch(err => {
        //     res.status.json({ err: err });
    // }
    // let notesArray = notes.filter(note => note != undefined);
    // fs.writeFileSync(
    //     path.join(__dirname, './db/db.json'),
    //     JSON.stringify({ notesArray }, null, 2))

    // notes = {};
    // notes.push(newNotesArray);
        };
    res.json(notes);
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});