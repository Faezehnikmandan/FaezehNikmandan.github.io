
// Import required modules
const express = require('express');
const cors = require('cors');
const path = require('path');

// Create an instance of Express
const app = express();

// Enable CORS for requests from your website
app.use(cors());

// Middleware to parse incoming form data (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Handle form submission
app.post('/submit-form', (req, res) => {
    const { name,surname , email, message } = req.body;

    // Log form data or process it (e.g., save to a database)
    console.log('Form Data:', { name, email, message });

    // Send a response back to the website
    res.send(`Thank you, ${name}, for your message!`);
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
