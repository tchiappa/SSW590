var express = require('express');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./db/mysql');

var defaultRouter = require('./routes/default')(db);
var apiRouter = require('./routes/api')(db);

var app = express();

// Initialize the app
async function initializeApp() {
    try {
        // Connect to MongoDB
        await db.connect();

        app.use(cors());
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