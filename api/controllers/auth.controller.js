import User from '../models/user.model.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cloudinary from '../utils/cloudinary.js';
import { normalizeUgandanPhone } from '../utils/phoneUtils.js';

// Load environment variables from .env file
dotenv.config();

//user signup controller
export const signup = async (req, res) => {

  try {
    //get user input
    const { username, email, password, phoneNumber } = req.body;

    // Validate input
    if (!username || !phoneNumber || !password) {
      return res.status(400).json({ message: 'Username, phone number, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Validate and normalize Ugandan phone number
    const normalizedPhone = normalizeUgandanPhone(phoneNumber);
    if (!normalizedPhone) {
      return res.status(400).json({ message: 'Invalid Ugandan phone number format' });
    }

    if (email && !email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    //check if phone number already exists
    let userByPhone = await User.findOne({ phoneNumber: normalizedPhone });
    if (userByPhone) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    //check if email already exists (if provided)
    if (email) {
      let userByEmail = await User.findOne({ email });
      if (userByEmail) {
        return res.status(400).json({ message: 'Email already registered' });
      }
    }

    // Check if username is taken
    let userByUsername = await User.findOne({ username });
    if (userByUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create a new user
    const newUser = new User({
      username,
      email: email || undefined,
      phoneNumber: normalizedPhone,
      password: hashedPassword
    });

    //save a user to the database
    await newUser.save();

    //return a success response
    const { password: pass, ...userData } = newUser._doc;
    res.status(201).json({
      success: true,
      message: 'User successfully created!',
      user: userData
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: error.message || 'Server error during signup' });
  }

};

//user signin controller
export const signin = async (req, res) => {
  try {
    //get user input
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({ message: 'Phone number and password are required' });
    }

    // Normalize input phone number
    const normalizedPhone = normalizeUgandanPhone(phoneNumber);
    if (!normalizedPhone) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    //check if user exists by phone
    let user = await User.findOne({ phoneNumber: normalizedPhone });
    if (!user) {
      return res.status(400).json({ message: "Account not found with this phone number!" });
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password!' });
    }

    //generate a JWT token
    const token = jwt.sign(
      { user: { id: user.id, isAdmin: user.isAdmin } },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return user data
    const { password: pass, ...userData } = user._doc;

    res.json({
      token,
      user: userData
    });


  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Google Authentication Controller
export const google = async (req, res, next) => {
  try {
    // Extract user data from the request body (sent from frontend Google login)
    const { email, username, photo } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (user) {
      // Existing user: generate JWT and return it
      const token = jwt.sign(
        { user: { id: user._id, isAdmin: user.isAdmin } },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // token validity
      );

      const { password, ...userData } = user._doc;

      res.status(200).json({ token, user: userData });
    } else {
      // Generate a random password (not used, but required by schema)
      const randomPassword = Math.random().toString(36).slice(-8);

      // Hash the random password for security
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      // Create a new user with Google data
      const baseUsername = (username || 'user').split(' ').join('').toLowerCase();

      // Ensure we have a valid photo URL or use the default avatar
      const avatar = photo || "https://res.cloudinary.com/dnj7dtnvx/image/upload/v1763294361/vecteezy_user-avatar-ui-button_13907861_j7b38y.jpg";

      const newUser = new User({
        username: baseUsername + Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        avatar,
      });

      // Save to DB
      await newUser.save();

      // Generate a JWT for the new user
      const token = jwt.sign(
        { user: { id: newUser._id, isAdmin: newUser.isAdmin } },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // token validity
      );

      const { password: pw, ...userData } = newUser._doc;

      res.status(201).json({ token, user: userData });
    }
  } catch (error) {
    next(error);
  }
};



//user Signout controller
export const signout = (req, res, next) => {

  res.json({ message: 'You have signed out successfully' });
};

