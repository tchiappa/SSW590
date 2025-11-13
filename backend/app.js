var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./db/mongo');

var defaultRouter = require('./routes/default');
var apiRouter = require('./routes/api');

var app = express();

// Initialize the app
async function initializeApp() {
    try {
        // Connect to MongoDB
        await db.connect();

        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());

        app.use('/', defaultRouter);
        app.use('/api', apiRouter);

    } catch (err) {
        console.error('Failed to initialize app:', err);
        process.exit(1);
    }
}

initializeApp();

module.exports = app;