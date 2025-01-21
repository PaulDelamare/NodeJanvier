const fs = require('fs');

exports.createFileIfDoesNotExist = (fileName) => {
    if (!fs.existsSync(fileName)) {
        fs.writeFileSync(fileName, '', 'utf-8');
        console.log(`${fileName} file created`);
    }
}