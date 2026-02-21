import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: "740774923770-0tu0i3dgond64grn4a43l7t6s0fpeh03.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // If user already exists with this email but no googleId, link them
        const email = profile.emails[0].value;
        user = await User.findOne({ email });

        if (user) {
          user.googleId = profile.id;
          if (!user.avatar) user.avatar = profile.photos[0].value;
          await user.save();
          return done(null, user);
        }

        // Create new user
        const newUser = new User({
          googleId: profile.id,
          username: profile.displayName.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
          email: email,
          password: Math.random().toString(36).slice(-10), // Required by schema
          avatar: profile.photos[0].value,
        });

        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

export default passport;
