const PDFDocument = require('pdfkit');
const fs = require('fs');
const messageEmitter = require('../generatePdf');


exports.createPdf = async (req, res) => {

    messageEmitter.emit('create_pdf', req.body);
    res.status(200).json('Yo');
}
