const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

const users = new Map(); // In-memory user storage: username -> password

// Signup route
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    if (users.has(username)) {
        return res.status(409).json({ message: 'Username already exists' });
    }
    users.set(username, password);
    return res.status(201).json({ message: 'User registered successfully' });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    if (!users.has(username) || users.get(username) !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    return res.status(200).json({ message: 'Login successful' });
});

// Service request route
app.post('/service', (req, res) => {
    const { service, location } = req.body;
    if (!service || !location) {
        return res.status(400).json({ message: 'Service and location are required' });
    }
    // For demo, just respond with success message
    return res.status(200).json({ message: `Your request for ${service} service in ${location} has been received.` });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
