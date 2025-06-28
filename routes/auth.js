// backend/routes/auth.js
const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // For simplicity — hardcoded credentials
  if (email === 'admin@example.com' && password === 'admin123') {
    return res.json({ token: 'secure-token-12345' });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;
