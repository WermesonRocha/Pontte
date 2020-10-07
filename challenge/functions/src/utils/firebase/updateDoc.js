const { db } = require('../../../firestore-config');

const updateDoc = async (docId, dataToWrite) => {
    return await db.collection('loan-agreements').doc(docId).update(dataToWrite);
}

module.exports = updateDoc;
