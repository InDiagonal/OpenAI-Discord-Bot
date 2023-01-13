// Import the required modules and classes
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const bodyParser = require('body-parser');
const { DiscordBot } = require('../src/discord-bot.js');


// Create an instance of DiscordBot class
new DiscordBot();

// Create an Express application
const app = express();
const pagesPath = path.join(process.cwd(), 'server/public');

// The following lines register middlewares with the Express application:
app.use(express.static(pagesPath)); // Serve static files from the 'pages' directory
app.use(bodyParser.json()); // Parse incoming request bodies in a middleware before the handlers
app.use(bodyParser.urlencoded({extended: true}));

// Serve the 'index.html' file as the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(pagesPath, 'index.html'));
});

// Define a route for the '/database' path that handle GET and POST request
app.route('/database')
	// Serve the 'database.html' file when a GET request is made to the '/database' route
    .get((req, res) => {
        res.sendFile(path.join(pagesPath, 'database.html'));
    })
	// Handle the file download when a POST request is made to the '/database' route
    .post((req, res) => {
	    if (req.body.key === process.env.ADMIN_KEY) {
		    const fileName = 'user_chats.db';
		    const filePath = path.join(process.cwd(), `server/db/${fileName}`);
		
		    try {
				// Read file located at filePath
			    const file = fs.readFileSync(filePath);
				// Set content type of response to text/plain
			    res.set('Content-Type', 'text/plain');
				// Set content disposition to attachment, so the content is downloaded
			    res.set('Content-Disposition', `attachment; filename="${fileName}"`);
				// Send file in the response to the client
			    res.send(file);

		    } catch (err) {
			    res.status(500).send(err);
		    }
	    } else {
		    res.status(401).send("Invalid password, access denied");
	    }
    });

// Start the Express application
app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});
