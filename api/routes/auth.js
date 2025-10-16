// routes/auth.js
import { Router } from 'express';
const router = Router();

router.get('/auth/check', (req, res) => {
  console.log('--- AUTH CHECK CALLED ---');
  console.log('Cookies header:', req.headers.cookie || '(none)');
  console.log('isAuthenticated fn exists:', typeof req.isAuthenticated);
  console.log('isAuthenticated():', typeof req.isAuthenticated === 'function' ? req.isAuthenticated() : '(no fn)');
  console.log('req.user:', req.user ? { id: req.user.user_id ?? req.user.id, username: req.user.username } : null);

  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.json({
      authenticated: true,
      user: {
        id: req.user.user_id ?? req.user.id,
        username: req.user.username,
        email: req.user.email
      }
    });
  }
  return res.status(401).json({ authenticated: false });
});

// make sure there is a default export
export default router;
