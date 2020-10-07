const formatValues = body => {
    let parsed = {};
    Object.keys(body).map(key => {
        if (key === 'name') parsed[key] = body[key].toUpperCase();
        else if (key === 'email') parsed[key] = body[key].toLowerCase();
        else if (key === 'cpf') parsed[key] = body[key].replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        else if (key === 'amount' || key === 'monthlyIncome') parsed[key] = parseFloat(body[key]) / 100;
        else parsed[key] = body[key];
    });
    return parsed;
}

module.exports = formatValues;
