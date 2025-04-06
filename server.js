const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors()); // important to allow cross-origin

app.get('/api', (req, res) => {
  res.json({ message: "Hello from Node.js server!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
