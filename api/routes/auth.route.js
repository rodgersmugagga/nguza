import express from 'express';
import jwt from 'jsonwebtoken';
import { signin, signup, google, signout, googleCallback } from '../controllers/auth.controller.js';

import passport from 'passport';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), googleCallback);

router.post("/google", google); // Keep existing for backward compatibility if needed

export default router;