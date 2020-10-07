const AppError = require('../../errors/AppError');
const validateEmail = require('../validateEmail');
const validateCpf = require('../validateCpf');
const validateAddress = require('../validateAddress');
const validateBirth = require('../validateBirth');

const validation = body => {
    const payload = { amount: body.amount, cpf: body.cpf, email: body.email, name: body.name }
    const missingParams = [];
    const validStatus = ['SINGLE', 'MARRIED', 'DIVORCIED', 'WIDOWED'];
    Object.keys(payload).map(key => !payload[key] ? missingParams.push({ type: 'Required paramn', field: key, message: `${key} is required` }) : null);
    if (missingParams.length > 0) throw new AppError(missingParams);
    const { cpf, email } = payload;
    const { address, birthDate, maritalStatus } = body;
    if (!validateEmail(email)) throw new AppError([{ type: 'Invalid paramn', message: `The email you are trying to register is invalid` }]);
    if (!validateCpf(cpf)) throw new AppError([{ type: 'Invalid paramn', message: `The cpf you are trying to register is invalid` }]);
    if (maritalStatus && !validStatus.includes(maritalStatus.toUpperCase())) throw new AppError([{ type: 'Invalid paramn', message: `The marital status you are trying to register is invalid. Valid statuses: ${validStatus}` }]);
    if (address) {
        const [error, valid] = validateAddress(address);
        if (!valid) throw new AppError(error);
    }
    if (birthDate) {
        const [error, valid] = validateBirth(birthDate);
        if (!valid) throw new AppError(error);
    }
    return;
}

module.exports = validation;
