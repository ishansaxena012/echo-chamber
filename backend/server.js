const express = require('express');
const cors = require('cors');

// Import the echochamber router
const echochamberRouter = require('./routes/echochamber');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to enable CORS and parse JSON request bodies
app.use(cors());
app.use(express.json());

// Main route handler for the echochamber API
app.use('/api', echochamberRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
