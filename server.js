const cors = require('cors');
const next = require('next');
const Pusher = require('pusher');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const Sentiment = require('sentiment');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const dbConnect = require('./utils/dbConnect').dbConnect;
const User = require('./models/User');


// Determine if the application is running in development mode
const dev = process.env.NODE_ENV !== 'production';

// Set the port to the environment variable PORT or default to 3000
const port = process.env.PORT || 3000;

// Create a Next.js application instance
const app = next({ dev });

// Create a request handler for Next.js
const handler = app.getRequestHandler();

// Initialize the Sentiment analysis instance for sentiment scoring
const sentiment = new Sentiment();

// Initialize Pusher with credentials from environment variables
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    useTLS: true // Use TLS for secure connections
});

// Prepare the Next.js application
app.prepare()
    .then(() => {

        // Create an Express server instance
        const server = express();

        // Use middleware to enable CORS (Cross-Origin Resource Sharing) and parse request bodies
        server.use(cors());
        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({ extended: true }));

        // Handle all requests using the Next.js request handler
        server.get('*', (req, res) => {
            return handler(req, res);
        });

        // Initialize a single array to hold chat history for the current room
        let chatHistory = [];

        // Endpoint to receive new messages
        server.post('/message', (req, res) => {
            // Destructure the request body to get user details, message, timestamp, and channel
            const { user = null, message = '', timestamp = +new Date(), channel = 'public-room' } = req.body;

            // Destructure the request body to get user details, message, timestamp, and channel
            const sentimentScore = sentiment.analyze(message).score;

            // Create a chat object containing user, message, timestamp, and sentiment score
            const chat = { user, message, timestamp, sentiment: sentimentScore };

            // Add the new chat message to the chat history
            chatHistory.push(chat);

            // Trigger Pusher to send the new message to the specified channel
            pusher.trigger(channel, 'new-message', { chat });

            res.json({ status: 'success' });
        });

        // Endpoint to retrieve chat history
        server.post('/messages', (req, res) => {
            res.json({ messages: chatHistory, status: 'success' });
        });

        // Endpoint to clear chat history when leaving the room
        server.post('/leave-room', (req, res) => {
            chatHistory = [];
            res.json({ status: 'success' });
        });

        // User Signup Endpoint
        server.post('/api/signup', async (req, res) => {
            const { email, password, name } = req.body;

            // Validate request data
            if (!email || !password || !name) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            try {
                // Connect to the database
                dbConnect();
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ message: 'Email already taken' });
                }

                // Hash the password before storing it
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = new User({ email, password: hashedPassword, name });
                await newUser.save();

                // Respond with a success message upon successful user creation
                res.status(201).json({ message: 'User created successfully' });
            } catch (error) {
                res.status(500).json({ message: 'Server error', error });
            }
        });

        // User Login Endpoint
        server.post('/api/login', async (req, res) => {
            const { email, password } = req.body;

            // Validate request data
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            try {
                // Connect to the database
                dbConnect();
                const user = await User.findOne({ email });
                if (!user) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }

                // Check if the password is valid
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }

                // Respond with a success message and user details upon successful login
                res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email } });
            } catch (error) {
                res.status(500).json({ message: 'Server error', error });
            }
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