const functions = require('firebase-functions');
const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');
const AppError = require('../errors/AppError');
const { storage } = require('../../firestore-config');
const updateDoc = require('../utils/firebase/updateDoc');
const getLoanData = require('../utils/firebase/getLoanData');
const getDocIdFromUser = require('../utils/firebase/getDocId');
const deleteFiles = require('../utils/deleteFiles');

const uploadImages = functions.region('southamerica-east1').https.onRequest(async (req, res) => {
    if (req.method === 'POST') {
        let uid = '';
        const fields = [];
        const tempNames = [];
        const validFileFields = ['userIdentification', 'proofOfIncome', 'propertyImage'];
        const busboy = new Busboy({ headers: req.headers });
        busboy.on('field', function (fieldname, val) {
            uid = fieldname === 'uid' && val;
        });
        busboy.on('file', function (fieldname, file, filename) {
            let tempName = path.join('./temp', filename);
            fields.push(fieldname);
            tempNames.push({ path: tempName, field: fieldname, filename });
            file.pipe(fs.createWriteStream(tempName));
        });
        busboy.on('finish', async function () {
            try {
                if (!uid) {
                    deleteFiles(tempNames);
                    throw new AppError([{ type: 'Required paramn', field: 'Uid', message: 'User uid is required' }]);
                }
                else if (!fields.includes('userIdentification')) {
                    deleteFiles(tempNames);
                    throw new AppError([{ type: 'Required paramn', field: 'userIdentification', message: 'Paramn userIdentification is required' }]);
                }
                else {
                    let docId = await getDocIdFromUser(uid);
                    if (!docId) {
                        deleteFiles(tempNames);
                        throw new AppError([{ type: 'Invalid paramn', field: 'Uid', message: 'No users with this uid' }]);
                    }
                    else {
                        const { state } = await getLoanData(docId);
                        if (state === 'creation') {
                            const bucket = await storage.bucket('gs://pontte-challenge-b7be1.appspot.com/');
                            const imgUrls = [];
                            const validFiles = tempNames.filter(({ field }) => validFileFields.includes(field));
                            await Promise.all(validFiles.map(async ({ path, field, filename }) => {
                                const name = `${uid}_${field}_${filename}`;
                                const destination = `Documents/${name}`;
                                await bucket.upload(path, { destination, public: true });
                                let url = await bucket.file(destination).getSignedUrl({ action: 'read', expires: '2021-12-31 00:00:00' });
                                imgUrls.push({ url: url[0], field });
                            }));
                            deleteFiles(tempNames);
                            await updateDoc(docId, { state: 'upload images', imgUrls });
                            const user = await getLoanData(docId);
                            return res.status(200).send(user);
                        } else {
                            deleteFiles(tempNames);
                            throw new AppError([{ type: 'Invalid operation', message: 'Only contracts in the state of \'creation\' can upload files' }]);
                        }
                    }
                };
            } catch (error) {
                console.log('ERROR:', error);
                if (error instanceof AppError) return res.status(error.statusCode).send({ errors: error.message });
                else return res.status(500).send(error);
            }
        });
        busboy.end(req.rawBody);
    } else return res.status(405).send({ error: 'Method not allowed' });
});

module.exports = uploadImages;
