const { db } = require('../../../firestore-config/index');

const writeDoc = async dataToWrite => {
    return await db.collection('loan-agreements').add(dataToWrite);
}

module.exports = writeDoc
