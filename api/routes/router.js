import { Router } from 'express';
import { createUser } from '../db/userCrud.js'
import passport from '../services/passport.js';
import * as controller from '../controller/controller.js';

const router = Router();

function requireAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ message: 'Unauthorized' });
}

// API Info
router.get('/', (_req, res) => {
  res.json({ ok: true, name: 'OpenCourt API' });
});

// Game Routes
router.get('/courts/:sport', controller.getGamesBySport);
router.get('/games/:gameId', controller.getGameById);
router.get('/courts/', controller.getAllGames);
router.post('/new', requireAuth, controller.createGame);

// Auth Routes
router.post("/newUser", async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const newUser = await createUser(email, username, password);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error in /newUser:", err);

    // handle duplicate username/email
    if (
      err.name === "SequelizeUniqueConstraintError" ||
      err.code === "ER_DUP_ENTRY"
    ) {
      return res.status(400).json({
        message:
          "User already exists. Please choose a different username or email.",
      });
    }
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// LOGIN using passport local strategy and create a session
router.post("/login", (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || "Invalid credentials" });

    req.login(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({
        message: "Login successful!",
        user: {
          id: user.user_id ?? user.id,
          username: user.username,
          email: user.email,
        },
      });
    });
  })(req, res, next);
});

// LOGOUT
router.post('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ ok: false });
    }
    
    res.clearCookie('connect.sid', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ ok: false });
      }
      res.json({ ok: true });
    });
  });
});

export default router;