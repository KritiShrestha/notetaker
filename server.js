//require dependencies
const express = require('express');
// Import the built-in Path module
const path = require("path");
// Import the built-in FileSystem module
const fs = require("fs");
// Import the uuid library
const uuid = require('uuid');
// create express app
const app = express();
//create a PORT variable
const PORT = process.env.PORT || 3005;

//set up express to handle data parsing
app.use(express.urlencoded({
	extended: true
}));
// Handles json data
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static("public"));

// route to get notes
app.get('/api/notes', function (req, res) {
	// read the db.json file
	fs.readFile('./db/db.json', 'utf8', (err, data) => {
    	if (err) throw err;
    	res.json(JSON.parse(data));
	});
});

// route to add a new note and add it to the json file
app.post("/api/notes", function (req, res) {
	//get the new note body
	const newNote = req.body;
	newNote.id = uuid.v4();

	// read the db.json file
	fs.readFile('./db/db.json', 'utf8', (err, data) => {
    	if (err) throw err;
    	const notes = JSON.parse(data);
    	// add new note to the notes array
    	notes.push(newNote);
    	// write the updated notes
    	fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
        	if (err) throw err;
        	console.log("New note added.");
        	res.json(newNote);
    	});
	});
});

// route to delete notes
app.delete('/api/notes/:id', (req, res) => {
	// get the id of the note
	const noteId = req.params.id;

	// read the db.json file
	fs.readFile('./db/db.json', 'utf8', (err, data) => {
    	if (err) throw err;
    	const notes = JSON.parse(data);
    	// removes the note with provided id using filter method
    	const filteredNotes = notes.filter((note) => note.id !== noteId);

    	// write the updated notes
    	fs.writeFile('./db/db.json', JSON.stringify(filteredNotes), (err) => {
        	if (err) throw err;
        	console.log("Note deleted.");
        	res.json({
            	success: true
        	});
    	});
	});
});

// Handles GET requests to the '/notes' route
app.get("/notes", function (req, res) {
	res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Handles all other GET requests
app.get("/*", function (req, res) {
	res.sendFile(path.join(__dirname, "./public/index.html"));
});

// create server listener
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
