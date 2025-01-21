// Import
const EventEmitter = require('events');
const messageEmitter = new EventEmitter();
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// Register a listener
messageEmitter.on('create_pdf', (body) => {
    // Création du document PDF

    // Chemin pour enregistrer le fichier à la racine du système
    const outputFile = path.join(__dirname, 'facture_fictive.pdf'); // Chemin absolu (racine du système)

    // Création du document PDF
    const doc = new PDFDocument();

    // Sauvegarde du PDF dans un fichier
    doc.pipe(fs.createWriteStream(outputFile));

    // En-tête de la facture
    doc.fontSize(20).text('FACTURE', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text('Entreprise Fictive Inc.', { align: 'left' });
    doc.text('123 Rue Imaginaire, Ville Inconnue, 00000');
    doc.text('Téléphone : 000-000-0000 | Email : contact@fictive.com');
    doc.moveDown(2);

    // Informations client
    doc.fontSize(14).text('Informations du client :', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text('Nom : Jean Dupont');
    doc.text('Adresse : 456 Avenue Inventée, Métropole Mystère, 12345');
    doc.text('Contact : 111-111-1111 | Email : jean.dupont@example.com');
    doc.moveDown(2);

    // Détails de la facture
    doc.fontSize(14).text('Détails de la facture :', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text('Numéro de facture : FCT-2025-001');
    doc.text('Date d\'émission : 20/01/2025');
    doc.text('Date d\'échéance : 27/01/2025');
    doc.moveDown(2);

    // Tableau des articles
    doc.fontSize(14).text('Articles/Services :', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text('Description                Quantité        Prix Unitaire        Total', { underline: true });
    doc.text('------------------------------------------------------------------');
    doc.text('Service A                     2                     50€                  100€');
    doc.text('Produit B                     1                     75€                   75€');
    doc.text('Produit C                     3                     30€                   90€');
    doc.moveDown(2);

    // Montant total
    doc.fontSize(14).text('Montant Total : 265€ (TVA incluse)', { align: 'right' });

    doc.fontSize(10).text(body.content ?? "", { align: 'center' });

    // Footer
    doc.fontSize(10).text('Merci pour votre confiance !', 50, 750, { align: 'center' });

    // Finalisation du PDF
    doc.end();

});

module.exports = messageEmitter;