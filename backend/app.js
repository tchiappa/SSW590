var express = require('express');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./db/mysql');
var promClient = require('prom-client');

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Add default metrics (CPU, memory, event loop lag, etc.)
promClient.collectDefaultMetrics({
    register,
    prefix: 'node_',
});

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

        // Health check endpoint
        app.get('/health', (req, res) => {
            res.status(200).send('OK');
        });

        // Prometheus metrics endpoint
        app.get('/metrics', async (req, res) => {
            try {
                res.set('Content-Type', register.contentType);
                const metrics = await register.metrics();
                res.end(metrics);
            } catch (err) {
                res.status(500).end(err);
            }
        });

        app.use('/', defaultRouter);
        app.use('/api', apiRouter);

    } catch (err) {
        console.error('Failed to initialize app:', err);
        process.exit(1);
    }
}

initializeApp();

module.exports = app;