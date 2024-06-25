import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  
  try {  
    const user = await User.create({
      username,
      password, 
      role
    });
    
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ error: 'User creation failed' });
  }
});

// Login route to generate JWT
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials, username does not exist' });
    }
    
    // Compare the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials, incorrect password' });
    }
    
    // Create JWT payload
    const payload = {
      username: user.username,
      id: user.id,
      role: user.role
    };
    
    // Generate JWT with payload and secret key
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Respond with JWT token
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;