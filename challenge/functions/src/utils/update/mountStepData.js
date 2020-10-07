const mountStepData = parsed => {
    const dataToWrite = {};
    const validFields = ['name', 'email', 'cpf', 'amount', 'monthlyIncome', 'birthDate', 'maritalStatus', 'address'];
    validFields.map(field => {
        if (parsed[field]) dataToWrite[field] = parsed[field];
    });
    return dataToWrite;
}

module.exports = mountStepData;
