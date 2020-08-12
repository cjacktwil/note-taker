const express = require('express');

const { notes } = require('./db/db.json');

const PORT = process.env.PORT || 3003;

const app = express();

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});