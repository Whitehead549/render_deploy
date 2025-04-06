const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

// Make sure this is your actual secret key (remove the 0x prefix if it's not part of the key)
const SECRET_KEY = '0x4AAAAAABD1OrctXKc7ZmhAXwN691xMqb8'.replace('0x', ''); 

app.use(cors());
app.use(express.json());

app.post('/api', async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ error: 'Missing Turnstile token', success: false });
  }

  try {
    // Verify token with Cloudflare Turnstile
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: SECRET_KEY,
        response: token
      })
    });

    const data = await response.json();
    
    if (data.success) {
      return res.json({ 
        message: "Verified and connected successfully!",
        success: true
      });
    } else {
      console.error('Turnstile verification failed:', data);
      return res.status(403).json({ 
        error: 'Verification failed: ' + (data['error-codes']?.join(', ') || 'Unknown error'),
        success: false
      });
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(500).json({ 
      error: 'Internal server error during verification',
      success: false
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});