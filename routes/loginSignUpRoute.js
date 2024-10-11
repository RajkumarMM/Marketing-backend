import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../model/userModel.js'; // Ensure correct model is imported

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new userModel({ name, email, password: hashedPassword });
        await newUser.save();

        // Return the created user info (excluding the password)
        const { password: _, ...userInfo } = newUser.toObject();

        res.status(201).json({
            message: 'User created successfully',
            user: userInfo, // Include user info in the response
        });
    } catch (error) {
        console.error('Signup error:', error); // Log the error for debugging
        res.status(500).json({
            message: 'Server error',
            error: error.message // Include error message for more context
        });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create and assign a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            token,
            message: 'Login successful',
            user: { id: user._id, email: user.email } // Return user info (excluding password)
        });
    } catch (error) {
        console.error('Login error:', error); // Log the error for debugging
        res.status(500).json({
            message: 'Server error',
            error: error.message // Include error message for more context
        });
    }
});

export default router;
