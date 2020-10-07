const fs = require('fs');

const deleteFiles = files => files.map(({ path }) => fs.unlinkSync(path));

module.exports = deleteFiles;
