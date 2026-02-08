const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data store (in production, use a real database)
let todos = [
  {
    id: uuidv4(),
    title: 'Sample Todo',
    description: 'This is a sample todo item',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Helper function to find todo by ID
const findTodoById = (id) => {
  return todos.find(todo => todo.id === id);
};

// Helper function to validate todo data
const validateTodoData = (data) => {
  if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
    return { valid: false, message: 'Title is required and must be a non-empty string' };
  }
  return { valid: true };
};

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Todo API',
    version: '1.0.0',
    endpoints: {
      'GET /api/todos': 'Get all todos',
      'GET /api/todos/:id': 'Get a specific todo',
      'POST /api/todos': 'Create a new todo',
      'PUT /api/todos/:id': 'Update a todo',
      'PATCH /api/todos/:id': 'Partially update a todo',
      'DELETE /api/todos/:id': 'Delete a todo'
    }
  });
});

// GET all todos
app.get('/api/todos', (req, res) => {
  try {
    // Optional query parameters for filtering
    const { completed } = req.query;
    
    let filteredTodos = todos;
    
    if (completed !== undefined) {
      const isCompleted = completed === 'true';
      filteredTodos = todos.filter(todo => todo.completed === isCompleted);
    }
    
    res.json({
      success: true,
      count: filteredTodos.length,
      data: filteredTodos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching todos',
      error: error.message
    });
  }
});

// GET a specific todo by ID
app.get('/api/todos/:id', (req, res) => {
  try {
    const todo = findTodoById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching todo',
      error: error.message
    });
  }
});

// POST - Create a new todo
app.post('/api/todos', (req, res) => {
  try {
    const validation = validateTodoData(req.body);
    
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }
    
    const newTodo = {
      id: uuidv4(),
      title: req.body.title.trim(),
      description: req.body.description || '',
      completed: req.body.completed || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: newTodo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating todo',
      error: error.message
    });
  }
});

// PUT - Update a todo (replaces entire todo)
app.put('/api/todos/:id', (req, res) => {
  try {
    const todo = findTodoById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    const validation = validateTodoData(req.body);
    
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }
    
    // Update all fields
    todo.title = req.body.title.trim();
    todo.description = req.body.description || '';
    todo.completed = req.body.completed || false;
    todo.updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      message: 'Todo updated successfully',
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating todo',
      error: error.message
    });
  }
});

// PATCH - Partially update a todo
app.patch('/api/todos/:id', (req, res) => {
  try {
    const todo = findTodoById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    // Update only provided fields
    if (req.body.title !== undefined) {
      if (typeof req.body.title !== 'string' || req.body.title.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Title must be a non-empty string'
        });
      }
      todo.title = req.body.title.trim();
    }
    
    if (req.body.description !== undefined) {
      todo.description = req.body.description;
    }
    
    if (req.body.completed !== undefined) {
      todo.completed = Boolean(req.body.completed);
    }
    
    todo.updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      message: 'Todo updated successfully',
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating todo',
      error: error.message
    });
  }
});

// DELETE - Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  try {
    const todoIndex = todos.findIndex(todo => todo.id === req.params.id);
    
    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    const deletedTodo = todos.splice(todoIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'Todo deleted successfully',
      data: deletedTodo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting todo',
      error: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Todo API server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} for API documentation`);
});

module.exports = app;