const express = require ('express');
const fs = require ("fs");
const path = ('path')
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GET route to return the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
  });
  
 