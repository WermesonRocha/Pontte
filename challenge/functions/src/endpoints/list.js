const functions = require('firebase-functions');
const AppError = require('../errors/AppError');
const list = require('../utils/firebase/list');

const approval = functions.region('southamerica-east1').https.onRequest(async (req, res) => {
    try {
        if (req.method === 'GET') {
            const loans = await list();
            return res.status(200).send(loans);
        } else return res.status(405).send({ error: 'Method not allowed' });
    } catch (error) {
        console.log('ERROR:', error);
        if (error instanceof AppError) return res.status(error.statusCode).send({ errors: error.message });
        else return res.status(500).send(error);
    }
});

module.exports = approval;
