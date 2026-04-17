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
    name: 'Jim Beamy',
    email: 'jim@example.com'
  }
];
let nextUserId = 3;

// Users endpoints with pagination
app.get('/api/users', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 100); // Max 100 per page
  const offset = (page - 1) * limit;
  
  const paginatedUsers = users.slice(offset, offset + limit);
  const total = users.length;
  const pages = Math.ceil(total / limit);
  
  res.json({
    users: paginatedUsers,
    pagination: {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1
    }
  });
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

// Batch operations endpoints
app.post('/api/users/batch', (req, res) => {
  const { users: newUsers } = req.body;
  
  if (!Array.isArray(newUsers) || newUsers.length === 0) {
    return res.status(400).json({ error: 'Users array is required' });
  }
  
  const createdUsers = newUsers.map(userData => {
    const { name, email } = userData;
    if (!name || !email) {
      throw new Error('Name and email are required for each user');
    }
    
    const newUser = {
      id: nextUserId++,
      name,
      email,
      created: new Date().toISOString()
    };
    users.push(newUser);
    return newUser;
  });
  
  res.status(201).json({ 
    message: `Created ${createdUsers.length} users`,
    users: createdUsers 
  });
});

app.delete('/api/users/batch', (req, res) => {
  const { ids } = req.body;
  
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'IDs array is required' });
  }
  
  const deletedCount = ids.reduce((count, id) => {
    const userIndex = users.findIndex(user => user.id === parseInt(id));
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      return count + 1;
    }
    return count;
  }, 0);
  
  res.json({ 
    message: `Deleted ${deletedCount} users`,
    requested: ids.length,
    deleted: deletedCount
  });
});

// Search endpoint
app.get('/api/users/search', (req, res) => {
  const { q, name, email } = req.query;
  
  if (!q && !name && !email) {
    return res.status(400).json({ error: 'Search query parameter (q) or specific filters (name, email) required' });
  }
  
  let filteredUsers = users;
  
  // General search across name and email
  if (q) {
    const searchTerm = q.toLowerCase();
    filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  }
  
  // Specific name filter
  if (name) {
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  
  // Specific email filter  
  if (email) {
    filteredUsers = filteredUsers.filter(user =>
      user.email.toLowerCase().includes(email.toLowerCase())
    );
  }
  
  res.json({
    users: filteredUsers,
    total: filteredUsers.length,
    query: { q, name, email }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Status check: http://localhost:${PORT}/api/status`);
});