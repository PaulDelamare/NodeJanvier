// Import
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logFunction = require('../logFunction');
const messageEmitter = require('../event');
const cors = require('cors');
const compression = require('compression');
const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config()
const Redis = require('ioredis');
const redis = new Redis();

// Routes Import
const articleRoutes = require('../Routes/Article.routes');
const presentationRoutes = require('../Routes/Presentation.routes');
const factureRoutes = require('../Routes/Facture.routes');
const cryptoRoutes = require('../Routes/Crypto.routes');
const languageRoutes = require('../Routes/Language.routes');
const { transporter } = require('../config/mail.config');


// const logger = createLogger({
//     level: 'info',
//     format: format.json(),
//     transports: [
//         new transports.Console(),
//         new DailyRotateFile({
//             filename: 'server-%DATE%.log',
//             datePattern: 'MM-DD-YYYY HH:mm:ss',
//             zippedArchive: true,
//             maxSize: '10m',
//             maxFiles: '14d'
//         })
//     ]
// })

// Middleware
app.use(cors({
    origin: 'http://bci25.portfolio-etudiant-rouen.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());

app.use(compression(
    {
        threshold: 1024,
        filter: (req, res) => {
            if (req.headers['x-no-compression']) {
                return false;
            }
            return !req.path.match(/\.(jpg|jpeg|png|gif|pdf|svg|mp4)$/i);
        }
    }
));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const loglevel = {
    level: {
        info: 0,
        warn: 1,
        error: 2,
        crit: 3
    }
}

const logFormat = format.combine(
    format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
    format.printf(({ level, message, timestamp }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
);

const logger = createLogger({
    level: loglevel.level,
    format: logFormat,
    transports: [
        new transports.Console(),
        new DailyRotateFile({
            filename: path.join(__dirname, 'logs', 'app-%DATE%.log'),
            datePattern: 'MM-DD-YYYY',
            maxSize: '5m'
        }),
        new DailyRotateFile({
            filename: path.join(__dirname, 'logs', 'error-%DATE%.log'),
            datePattern: 'MM-DD-YYYY',
            maxSize: '5m'
        }),
    ]
});

/**
 * Envoie un email avec un message d'erreur.
 *
 * @param {string} errorMessage Le message d'erreur à envoyer.
 *
 * @returns {Promise<void>}
 */
async function sendMail(errorMessage) {
    try {
        const mailoption = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO,
            subject: "ALERTE CRITIQUE !",
            text: `Alerte critique: ${errorMessage}`,
            html: `<h2>Alerte Critique: ${errorMessage}</h2>`
        };

        await transporter.sendMail(mailoption);
        console.log('Email envoyé avec succès');
    } catch (error) {
        console.error('Erreur', error);
    }
}

logger.on('crit', (err) => {
    console.log("Erreur critique detecté", err.message);
    logger.crit('Erreur  critique detecté', err.message);
    sendMail(err.message);
})
// En utilisant winston faire des log d'information,
// de warning, d'erreur , et d'erreur critique
// Gerez les rotations de log pour eviter que les fichier soit
// trop volumineux
// Gerez le format pour qu'il corresponde a 'MM-DD-YYYY HH:mm:ss'
// Ajouter un middleware de logs pour suivre toutes les requetes
// Capturer les erreur critique et les signaler avec une fonction
// d'envoi de mail

// Log Middleware Error
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
});

// Log Middleware Request
app.use((req, res, next) => {
    logFunction.rotateLog();
    logFunction.requestLog(req, res, next);

    logger.info(` ${req.method} - ${req.url} - IP:  ${req.ip}`);
    messageEmitter.emit('message_call', req.url);
});

redis.on('connect', () => {
    console.log('Connected to Redis');
});
redis.on('error', (err) => {
    console.error('Error connecting to Redis:', err);
});

// Routes
app.use('/api', articleRoutes);
app.use('/api', presentationRoutes);
app.use('/api', factureRoutes);
app.use('/api', cryptoRoutes);
app.use('/api', languageRoutes);

// Server
app.listen(process.env.PORT, () => {

    // Log File
    logFunction.writeLog('server.log', 'Serveur démarré');
    console.log('Server listening on port ' + process.env.PORT);
});

// Database
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log('Connected to MongoDB');
//     })
//     .catch((error) => {
//         console.error('Error connecting to MongoDB:', error);
//     });
