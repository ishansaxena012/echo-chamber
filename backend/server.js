const express = require('express');
const cors = require('cors');

const echochamberRouter = require('./routes/echochamber');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to enable CORS and parse JSON request bodies
app.use(cors());
app.use(express.json());

app.use('/api', echochamberRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
