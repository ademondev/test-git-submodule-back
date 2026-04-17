# API Reference AAAAAAAAAAAAAAAAAAAAAAA
# CHANGES FROM BACKEND REPO TO DOCS

## Endpoints

### GET /api/health

Returns the health status of the API.

**Response:**

```json
{
  "status": "NOT OK",
  "timestamp": "2026-04-17T10:00:00Z"
}
```

### GET /api/users

Returns a list of users.

**Response:**

```json
{
  "users": [afasdas
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
```

### POST /api/users

Creates a new user.

**Request Body:**

```json
{
  "name": "string",
  "email": "string"
}
```

**Response:**

```json
{
  "id": 3,
  "name": "New User",
  "email": "newuser@example.com",
  "created": "2026-04-17T10:00:00Z"
}
```

### DELETE /api/users/:id

Deletes a user by ID.

**Response:**

```json
{
  "message": "User deleted successfully"
}
```

### GET /api/status

Returns detailed system status information.

**Response:**

```json
{
  "status": "operational",
  "uptime": 3600,
  "database": "connected",
  "memory_usage": "45%"
}
```

## Batch Operations

### POST /api/users/batch

Creates multiple users in a single request.

**Request Body:**

```json
{
  "users": [
    {
      "name": "John Doe",
      "email": "john@example.com"
    },
    {
      "name": "Jane Smith", 
      "email": "jane@example.com"
    }
  ]
}
```

**Response:**

```json
{
  "message": "Created 2 users",
  "users": [
    {
      "id": 4,
      "name": "John Doe",
      "email": "john@example.com",
      "created": "2026-04-17T10:00:00Z"
    },
    {
      "id": 5,
      "name": "Jane Smith",
      "email": "jane@example.com", 
      "created": "2026-04-17T10:00:01Z"
    }
  ]
}
```

### DELETE /api/users/batch

Deletes multiple users by their IDs.

**Request Body:**

```json
{
  "ids": [1, 2, 3]
}
```

**Response:**

```json
{
  "message": "Deleted 2 users",
  "requested": 3,
  "deleted": 2
}
```

## Pagination

### GET /api/users?page=1&limit=10

Returns a paginated list of users.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of users per page (default: 10, max: 100)

**Response:**

```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Search

### GET /api/users/search

Search for users by name or email.

**Query Parameters:**

- `q` (optional): General search term (searches both name and email)
- `name` (optional): Filter by name (partial match)
- `email` (optional): Filter by email (partial match)

At least one parameter is required.

**Examples:**

- `/api/users/search?q=john` - Search for "john" in names and emails
- `/api/users/search?name=doe` - Search for users with "doe" in their name
- `/api/users/search?email=example.com` - Search for users with "example.com" in their email
- `/api/users/search?name=jane&email=gmail` - Combined filters

**Response:**

```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "total": 1,
  "query": {
    "q": "john",
    "name": null,
    "email": null
  }
}
```

