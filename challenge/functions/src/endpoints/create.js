const functions = require('firebase-functions');
const AppError = require('../errors/AppError');
const formatValues = require('../utils/formatValues');
const writeDoc = require('../utils/firebase/writeDoc');
const mountData = require('../utils/create/mountData');
const validation = require('../utils/create/validation');

const create = functions.region('southamerica-east1').https.onRequest(async (req, res) => {
    try {
        if (req.method === 'POST') {
            validation(req.body);
            const parsedBody = formatValues(req.body);
            const dataToWrite = mountData(parsedBody);
            await writeDoc(dataToWrite);
            return res.status(200).send(dataToWrite);
        } else return res.status(405).send({ error: 'Method not allowed' });
    } catch (error) {
        console.log('ERROR:', error);
        if (error instanceof AppError) return res.status(error.statusCode).send({ errors: error.message });
        else return res.status(500).send(error);
    }
});

module.exports = create;
