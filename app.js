// app.js - Main Application Entry Point
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./db');
const createError = require('http-errors');
// const errorHandler = require('./middleware/errorHandler');

// Import routes
// app.js
const accountRoutes = require('./mainRoutes/main');
const indexRoutes = require('./mainRoutes/index');
const app = express();
const PORT = process.env.PORT || 8080;
app.set("view engine", "pug");
app.set("views", "./views");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files
app.use(express.static('public'));

// Initialize database
initializeDatabase();
console.log("test");
// Routes
console.log(accountRoutes);
app.use('/', accountRoutes);
app.use('/', indexRoutes);
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Data Pusher API is running',
        timestamp: new Date().toISOString()
    });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).send('Route not found');
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', { error: err });
});

// Error handling middleware
// app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Data Pusher API is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    const { closeDatabase } = require('./db');
    closeDatabase();
    process.exit(0);
});

module.exports = app;