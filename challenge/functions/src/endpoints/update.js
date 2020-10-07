const functions = require('firebase-functions');
const AppError = require('../errors/AppError');
const validation = require('../utils/update/validation');
const updateFields = require('../utils/update/updateFields');
const getLoanData = require('../utils/firebase/getLoanData');
const getDocId = require('../utils/firebase/getDocId');

const create = functions.region('southamerica-east1').https.onRequest(async (req, res) => {
    try {
        if (req.method === 'PUT') {
            validation(req.body);
            const { uid } = req.body;
            const docId = await getDocId(uid);
            if (docId) {
                const { state } = await getLoanData(docId);
                if (state === 'creation' || state === 'upload images') {
                    const user = await updateFields(req.body, docId);
                    return res.status(200).send(user);
                }
                else throw new AppError([{ type: 'Invalid operation', message: 'Only contracts in the state of \'creation\' or \'upload images\' can update fields' }]);
            } else throw new AppError([{ type: 'Invalid paramn', field: 'Uid', message: 'No users with this uid' }]);
        } else return res.status(405).send({ error: 'Method not allowed' });
    } catch (error) {
        console.log('ERROR:', error);
        if (error instanceof AppError) return res.status(error.statusCode).send({ errors: error.message });
        else return res.status(500).send(error);
    }
});

module.exports = create;
