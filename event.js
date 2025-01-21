// Import
const EventEmitter = require('events');
const messageEmitter = new EventEmitter();

// Register a listener
messageEmitter.on('message_call', (route) => {

    // Do something when the event is called
    console.log("Je suis un message ", route);
});

module.exports = messageEmitter;