const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Users endpoint
app.get('/api/users', (req, res) => {
  res.json({
    users: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com'
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});