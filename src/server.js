// Import
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logFunction = require('../logFunction');
const messageEmitter = require('../event');
require('dotenv').config()

// Routes Import
const articleRoutes = require('../Routes/Article.routes');
const presentationRoutes = require('../Routes/Presentation.routes');
const factureRoutes = require('../Routes/Facture.routes');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Log Middleware Request
app.use((req, res, next) => {
    logFunction.rotateLog();
    logFunction.requestLog(req, res, next);
    messageEmitter.emit('message_call', req.url);
});

// Routes
app.use('/api', articleRoutes);
app.use('/api', presentationRoutes);
app.use('/api', factureRoutes);

// Server
app.listen(process.env.PORT, () => {

    // Log File
    logFunction.writeLog('server.log', 'Serveur démarré');
    console.log('Server listening on port ' + process.env.PORT);
});

// Database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
