const functions = require('firebase-functions');
const AppError = require('../errors/AppError');
const validation = require('../utils/approval/validation');
const formatValues = require('../utils/approval/formatValues');
const mountData = require('../utils/approval/mountData');
const getDocId = require('../utils/firebase/getDocId');
const updateDoc = require('../utils/firebase/updateDoc');
const getLoanData = require('../utils/firebase/getLoanData');

const approval = functions.region('southamerica-east1').https.onRequest(async (req, res) => {
    try {
        if (req.method === 'PUT') {
            validation(req.body);
            const parsedBody = formatValues(req.body);
            const { uid } = req.body;
            const docId = await getDocId(uid);
            if (docId) {
                const { state } = await getLoanData(docId);
                if (state === 'upload images') {
                    const dataToWrite = mountData(parsedBody);
                    await updateDoc(docId, dataToWrite);
                    const user = await getLoanData(docId);
                    return res.status(200).send(user);
                } else throw new AppError([{ type: 'Invalid operation', message: 'Only contracts in the state of \'upload images\' can update status' }]);
            } else throw new AppError([{ type: 'Invalid paramn', field: 'Uid', message: 'No users with this uid' }]);
        } else return res.status(405).send({ error: 'Method not allowed' });
    } catch (error) {
        console.log('ERROR:', error);
        if (error instanceof AppError) return res.status(error.statusCode).send({ errors: error.message });
        else return res.status(500).send(error);
    }
});

module.exports = approval;
