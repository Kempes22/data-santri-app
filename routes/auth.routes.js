const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Tampilkan form login
router.get('/login', (req, res) => {
  res.send(`
    <h2>Login Admin</h2>
    <form method="POST" action="/auth/login">
      <input type="text" name="username" placeholder="Username" /><br>
      <input type="password" name="password" placeholder="Password" /><br>
      <button type="submit">Login</button>
    </form>
  `);
});

// Proses login
router.post('/login', authController.login);

// Logout
router.get('/logout', authController.logout);

// Proteksi auth
router.get('/check', authController.checkAuth, (req, res) => {
  res.send('Kamu sudah login!');
});

module.exports = router;
