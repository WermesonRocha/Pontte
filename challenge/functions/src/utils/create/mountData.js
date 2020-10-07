const { uuid } = require('uuidv4');

const mountData = body => {
    const uid = uuid();
    const dataToWrite = { uid, state: 'creation' };
    const validFields = ['name', 'email', 'cpf', 'amount', 'monthlyIncome', 'birthDate', 'maritalStatus', 'address'];
    Object.keys(body).map(key => validFields.includes(key) && body[key] ? dataToWrite[key] = body[key] : null);
    return dataToWrite;
}

module.exports = mountData;
