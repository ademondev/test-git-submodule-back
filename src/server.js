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

// In-memory users storage (for demo purposes)
let users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com'
  },
  {
    id: 3,
    name: 'Jim Beam',
    email: 'jim@example.com'
  }
];
let nextUserId = 3;

// Users endpoints
app.get('/api/users', (req, res) => {
  res.json({ users });
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const newUser = {
    id: nextUserId++,
    name,
    email,
    created: new Date().toISOString()
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users.splice(userIndex, 1);
  res.json({ message: 'User deleted successfully' });
});

// Status endpoint
app.get('/api/status', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  const memoryUsagePercent = Math.round(
    (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100
  );
  
  res.json({
    status: 'operational',
    uptime: Math.floor(uptime),
    database: 'connected', // would be real check in production
    memory_usage: `${memoryUsagePercent}%`
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Status check: http://localhost:${PORT}/api/status`);
});