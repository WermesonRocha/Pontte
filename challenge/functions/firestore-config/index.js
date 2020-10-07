const { Storage } = require('@google-cloud/storage');
const admin = require('firebase-admin');
const serviceAccount = require('../account_key.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount), storageBucket: 'gs://pontte-challenge-b7be1.appspot.com/' });
const storage = new Storage({ projectId: 'pontte-challenge-b7be1', keyFilename: './account_key.json' });

exports.db = admin.firestore();
exports.storage = storage;
