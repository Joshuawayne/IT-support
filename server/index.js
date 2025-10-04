const express = require('express');
const connectDB = require('./db');
const cookieParser = require('cookie-parser'); // 1. Import cookie-parser

// Connect to Database
connectDB();

const app = express();

// Init Middlewares
app.use(express.json({ extended: false }));
app.use(cookieParser()); // 2. Add the cookie-parser middleware

const PORT = 5000;

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});