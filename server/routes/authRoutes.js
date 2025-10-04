const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST api/auth/register
// @desc    Register a user and log them in
router.post('/register', authController.registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user and get tokens
router.post('/login', authController.loginUser);


module.exports = router;