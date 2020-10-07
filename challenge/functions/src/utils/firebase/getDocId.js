const { db } = require('../../../firestore-config/index');

const getDocId = async (uid) => {
    const doc = await db.collection('loan-agreements').where('uid', '==', uid).get();
    if (!doc.empty) return doc.docs[0].id;
    else return '';
}

module.exports = getDocId;
