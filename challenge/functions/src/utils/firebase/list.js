const { db } = require('../../../firestore-config/index');

const list = async () => {
    const doc = await db.collection('loan-agreements').get();
    const loans = [];
    if (!doc.empty) {
        doc.forEach(doc => loans.push(doc.data()));
        return loans;
    }
    else return [];
}

module.exports = list;
