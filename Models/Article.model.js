const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: String,
    content: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Article', articleSchema);
