const validateAddress = address => {
    if (!address) return [[], false];
    const payload = { cep: address.cep, street: address.street, number: address.number, neighborhood: address.neighborhood, city: address.city, state: address.state };
    const missingParams = [];
    Object.keys(payload).map(key => !payload[key] ? missingParams.push({ type: 'Required paramn', field: `address.${key}`, message: `${key} is required in address` }) : null);
    if (missingParams.length > 0) return [missingParams, false];
    else return [[], true];
}

module.exports = validateAddress;
