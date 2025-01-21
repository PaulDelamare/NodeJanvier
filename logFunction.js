// Import
const fs = require('fs');
const path = require('path');
const { createFileIfDoesNotExist } = require('./utils/CreateFile');

/**
 * Writes a log message to the specified file.
 *
 * @param {string} fichier - The name of the file to write the log message to.
 * @param {string} message - The log message to be written.
 *
 * This function checks if the specified file exists. If not, it creates the file.
 * Then, it appends a log message, prefixed with the current timestamp, to the file.
 * If an error occurs while writing to the file, it logs the error to the console.
 */
exports.writeLog = (fichier, message) => {

    // Create log file if it doesn't exist
    createFileIfDoesNotExist(fichier)

    // Write log message to server.log
    const logMessage = `${new Date().toISOString()} - ${message} \n`;

    // Append log message to server.log
    fs.appendFile(fichier, logMessage, (err) => {
        if (err) {
            console.error('Error writing to server.log:', err);
        }
    });
};

/**
 * Middleware function to log the HTTP request method and path.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 *
 * This function logs the method and original URL of incoming requests by writing
 * the information to 'server.log' using the writeLog function. It then calls the
 * next middleware function in the stack.
 */
exports.requestLog = (req, res, next) => {

    // Log request method and path
    const method = req.method;
    const path = req.originalUrl;

    // Create log file if it doesn't exist
    createFileIfDoesNotExist("request.log")

    // Write log message to server.log
    this.writeLog('request.log', `Method: ${method}, Path: ${path}`);

    next();
}

exports.rotateLog = () => {
    const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5MO

    const stats = fs.statSync('request.log');

    if (stats.size > MAX_LOG_SIZE) {

        const unique = `request_${Date.now()}.log`;
        fs.renameSync('request.log', path.join(__dirname, unique));

        fs.writeFileSync('request.log', '', 'utf-8');
    }
}