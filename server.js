const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

// Use the cookie-parser middleware
app.use(cookieParser());

// Configure express-session middleware
app.use(session({
    secret: 'your-secret-key', // Use a strong secret key for sessions
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if you're using HTTPS
}));

// Set the directory to serve static files (e.g., your index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Define some user data (in real applications, use a database)
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' }
];

// Use the express.json middleware to parse JSON request bodies
app.use(express.json());

// Authentication route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Find user by username and password
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Set session data for authenticated user
        req.session.userId = user.id;
        res.json({ message: 'Logged in successfully' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Logout route
app.post('/logout', (req, res) => {
    // Destroy the session to log out
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
    });
});

// Middleware function to verify session
function verifySession(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

// Protected route
app.get('/protected', verifySession, (req, res) => {
    res.json({ message: 'This is a protected route' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
