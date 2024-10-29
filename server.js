const cors = require('cors');
const next = require('next');
const Pusher = require('pusher');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const Sentiment = require('sentiment');

// Determine if the application is running in development mode
const dev = process.env.NODE_ENV !== 'production';

// Set the port to the environment variable PORT or default to 3000
const port = process.env.PORT || 3000;

// Create a Next.js application instance
const app = next({ dev });

// Create a request handler for Next.js
const handler = app.getRequestHandler();

// Initialize the Sentiment analysis instance
const sentiment = new Sentiment();

// Initialize Pusher with credentials from environment variables
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    useTLS: true
});

// Prepare the Next.js application
app.prepare()
    .then(() => {
        // Create an Express server
        const server = express();

        // Use middleware to enable CORS and parse request bodies
        server.use(cors());
        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({ extended: true }));

        // Handle all requests with Next.js request handler
        server.get('*', (req, res) => {
            return handler(req, res);
        });

        // Initialize an object to hold chat history
        const chatHistory = { messages: [] };

        // Endpoint to receive new messages
        server.post('/message', (req, res, next) => {
            // Destructure the request body
            const { user = null, message = '', timestamp = +new Date } = req.body;

            // Analyze the sentiment of the message
            const sentimentScore = sentiment.analyze(message).score;

            // Create a chat object with user, message, timestamp, and sentiment score
            const chat = { user, message, timestamp, sentiment: sentimentScore };

            // Add the new chat message to chat history
            chatHistory.messages.push(chat);

            // Trigger Pusher to send the new message to all clients
            pusher.trigger('public-room', 'new-message', { chat });

            // Respond with success
            res.json({ status: 'success' });
        });

        // Endpoint to retrieve chat history
        server.post('/messages', (req, res, next) => {
            // Send the chat history as a response
            res.json({ ...chatHistory, status: 'success' });
        });

        // Start the server and listen on the specified port
        server.listen(port, err => {
            if (err) throw err;
            console.log(`> Ready on http://localhost:${port}`);
        });

    })
    .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
    });