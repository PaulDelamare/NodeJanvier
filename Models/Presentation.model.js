const mongoose = require('mongoose');

const presentationSchema = new mongoose.Schema({
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    },
});

module.exports = mongoose.model('Presentation', presentationSchema);
