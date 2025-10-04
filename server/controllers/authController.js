const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Helper function to generate tokens ---
const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// --- Helper function to set the refresh token cookie ---
const sendRefreshToken = (res, refreshToken) => {
  res.cookie('jwt', refreshToken, {
    httpOnly: true,       // Not accessible by JavaScript
    secure: process.env.NODE_ENV === 'production', // Only on HTTPS
    sameSite: 'Strict',   // Mitigates CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// --- Register User ---
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // After registering, generate tokens to log them in automatically
    const { accessToken, refreshToken } = generateTokens(user);
    sendRefreshToken(res, refreshToken);

    res.status(201).json({ accessToken });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// --- Login User ---
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    sendRefreshToken(res, refreshToken);

    res.json({ accessToken });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};