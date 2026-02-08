# Todo API

A REST API built with Express.js for managing a todo list with full CRUD operations.

## Features

- ✅ Create, Read, Update, and Delete todos
- ✅ Filter todos by completion status
- ✅ Input validation and error handling
- ✅ RESTful API design
- ✅ CORS enabled
- ✅ Deployed on Vercel

## API Endpoints

### Get All Todos
```
GET /api/todos
```

Optional query parameters:
- `completed=true|false` - Filter by completion status

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "uuid",
      "title": "Sample Todo",
      "description": "This is a sample todo item",
      "completed": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get a Specific Todo
```
GET /api/todos/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Sample Todo",
    "description": "This is a sample todo item",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Create a New Todo
```
POST /api/todos
```

**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "id": "uuid",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update a Todo (Full Update)
```
PUT /api/todos/:id
```

**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, cheese",
  "completed": true
}
```

### Partially Update a Todo
```
PATCH /api/todos/:id
```

**Request Body (any combination of fields):**
```json
{
  "completed": true
}
```

### Delete a Todo
```
DELETE /api/todos/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Todo deleted successfully",
  "data": {
    "id": "uuid",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/michaelswai686-ctrl/todo-api.git
cd todo-api
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The API will be available at `http://localhost:3000`

## Development

Run in development mode:
```bash
npm run dev
```

## Technologies Used

- **Express.js** - Web framework
- **CORS** - Enable cross-origin requests
- **UUID** - Generate unique IDs
- **Vercel** - Deployment platform

## Data Structure

Each todo item has the following structure:

```javascript
{
  id: String,          // UUID v4
  title: String,       // Required
  description: String, // Optional
  completed: Boolean,  // Default: false
  createdAt: String,   // ISO 8601 timestamp
  updatedAt: String    // ISO 8601 timestamp
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Notes

- This API uses in-memory storage. Data will be reset when the server restarts.
- For production use, connect to a real database (MongoDB, PostgreSQL, etc.)
- All timestamps are in ISO 8601 format

## License

MIT