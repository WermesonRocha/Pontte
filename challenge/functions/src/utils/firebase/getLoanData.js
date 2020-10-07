const { db } = require('../../../firestore-config/index');

const getLoanData = async (docId) => {
    const doc = await db.collection('loan-agreements').doc(docId).get();
    if (doc.exists) return doc.data();
    else return {};
}

module.exports = getLoanData;
