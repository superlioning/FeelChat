const mongoose = require('mongoose');


// Retrieve the MongoDB connection URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Variable to track the connection status
let isConnected;

// Function to establish a connection to the MongoDB database
async function dbConnect() {
    // If already connected, skip the connection process
    if (isConnected) {
        return;
    }

    try {
        // Connect to MongoDB using the connection URI and options
        const db = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true, // Use the new URL string parser
            useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine
        });

        // Set the connection status to 'connected'
        isConnected = db.connections[0].readyState;
        console.log('Connected to MongoDB'); // Log successful connection
    } catch (error) {
        // Log any error encountered during connection
        console.error('Error connecting to MongoDB', error);
    }
}

module.exports = { dbConnect };