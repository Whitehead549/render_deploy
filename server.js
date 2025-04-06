const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

const SECRET_KEY = '0x4AAAAAABD1OrctXKc7ZmhAXwN691xMqb8'; // Replace with your real secret key

app.use(cors());
app.use(express.json());

app.post('/api', async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ error: 'Missing Turnstile token' });
  }

  // Verify token with Cloudflare Turnstile
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${SECRET_KEY}&response=${token}`
  });

  const data = await response.json();

  if (data.success) {
    res.json({ message: "Verified and connected successfully!" });
  } else {
    res.status(403).json({ error: 'Verification failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
