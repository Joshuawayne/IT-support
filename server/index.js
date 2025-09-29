const express = require('express');
const app = express();
const PORT = 5000; // You can choose any available port

// A simple test route to make sure the server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});