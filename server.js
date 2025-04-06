const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // For server-side HTTP requests
const app = express();

// Replace with your actual Turnstile Secret Key
const SECRET_KEY = '0x4AAAAAABD1OrctXKc7ZmhAXwN691xMqb8';

app.use(cors());
app.use(express.json());

app.post('/api', async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ 
      error: 'Missing Turnstile token', 
      success: false 
    });
  }

  try {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(SECRET_KEY)}&response=${encodeURIComponent(token)}`
    });

    const data = await verifyRes.json();
    console.log('Turnstile verification result:', data);

    if (data.success) {
      return res.json({ 
        message: 'Verified and connected successfully working!',
        success: true
      });
    } else {
      return res.status(403).json({ 
        error: 'Verification failed: ' + (data['error-codes']?.join(', ') || 'unknown'),
        success: false 
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ 
      error: 'Server error during verification',
      success: false 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
