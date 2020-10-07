const AppError = require('../../errors/AppError');
const validateEmail = require('../validateEmail');
const validateCpf = require('../validateCpf');
const validateAddress = require('../validateAddress');
const validateBirth = require('../validateBirth');

const validation = body => {
    const payload = { amount: body.amount, cpf: body.cpf, email: body.email, name: body.name }
    const missingParams = [];
    Object.keys(payload).map(key => !payload[key] ? missingParams.push({ type: 'Required parameter', field: key, message: `${key} is required` }) : null);
    if (missingParams.length > 0) throw new AppError(missingParams);
    const { cpf, email } = payload;
    const { address, birthDate } = body;
    if (!validateEmail(email)) throw new AppError([{ type: 'Invalid parameter', message: `The email you are trying to register is invalid` }]);
    if (!validateCpf(cpf)) throw new AppError([{ type: 'Invalid parameter', message: `The cpf you are trying to register is invalid` }]);
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
