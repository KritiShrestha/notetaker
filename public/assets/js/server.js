const express = require('express');
const fs = require("fs");
const path = ('path')
const app = express();
const PORT = process.env.PORT || 3001;
const uniqid = require("uniqid")

app.use(express.json());
// Static middleware pointing to the public folder
app.use(express.static('public'));

// GET route to return the notes.html file to user
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// GET route to return the index.html file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// GET route to read the db.json file and return all saved notes as JSON
// app.get('/api/notes', (req, res) => {
//   fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
//     if (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Internal server error' });
//     } else {
//       const notes = JSON.parse(data);
//       res.json(notes);
//     }
//   });
// });
//server reads the db.json file and sends the responds with the parsed notes to the user
app.get('/api/notes', (req, res) => {
  fs.readFile('/db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      const notes = JSON.parse(data);
      res.json(notes);
    }
  });
});

//User submits the new data
app.post('/api/notes', (req, res) => {
  const newNote = {
    title: req.body.title,
    text: req.body.text,
    id: uniqid()
  }

  //Server reads and pushes the new notes after parsing
  fs.readFile('/db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
    else {
      const notes = JSON.parse(data);
      notes.push(newNote);
    }
  })

  //
  fs.writeFile('/db/db.json', JSON.stringify(notes), (err) => {
    if (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
    else res.json({note: newNote, message: "Note saved Successfully"})
  }
  )
}
)


// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



