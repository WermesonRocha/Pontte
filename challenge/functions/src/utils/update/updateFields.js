const AppError = require('../../errors/AppError');
const mountStepData = require('./mountStepData');
const formatValues = require('../formatValues');
const validateEmail = require('../validateEmail');
const validateCpf = require('../validateCpf');
const validateAddress = require('../validateAddress');
const validateBirth = require('../validateBirth');
const updateDoc = require('../firebase/updateDoc');
const getLoanData = require('../firebase/getLoanData');

const updateFields = async (body, docId) => {
    const { email, cpf, birthDate, address } = body;
    const validFields = ['name', 'email', 'cpf', 'amount', 'monthlyIncome', 'birthDate', 'maritalStatus', 'address'];
    if (!Object.keys(body).some(key => validFields.includes(key))) throw new AppError([{ type: 'Invalid payload', message: `You cannot update these values in this state` }]);
    if (email && !validateEmail(email)) throw new AppError([{ type: 'Invalid paramn', message: `The email you are trying to register is invalid` }]);
    if (cpf && !validateCpf(cpf)) throw new AppError([{ type: 'Invalid paramn', message: `The cpf you are trying to register is invalid` }]);
    if (address) {
        const [error, valid] = validateAddress(address);
        if (!valid) throw new AppError(error);
    }
    if (birthDate) {
        const [error, valid] = validateBirth(birthDate);
        if (!valid) throw new AppError(error);
    }
    const parsed = formatValues(body);
    const dataToWrite = mountStepData(parsed);
    await updateDoc(docId, dataToWrite);
    const updated = await getLoanData(docId);
    return updated;
};

module.exports = updateFields;
