const invalidCpfs = [
    '',
    '000.000.000-00',
    '111.111.111-11',
    '222.222.222-22',
    '333.333.333-33',
    '444.444.444-44',
    '555.555.555-55',
    '666.666.666-66',
    '777.777.777-77',
    '888.888.888-88',
    '999.999.999-99'
];

const reducer = (accumulator, currentValue) => accumulator + currentValue;

const validateCpf = cpf => {
    if (invalidCpfs.includes(cpf)) return false;
    if (cpf.indexOf('-') === -1) cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    let parts = cpf.split('-');
    let numbers = parts[0].replace(/\./g, '').split('');
    const calcFirtsNumber = 11 - (numbers.map((num, index) => parseInt(num) * (10 - index)).reduce((a, b) => reducer(a, b)) % 11);
    const first = (calcFirtsNumber >= 10) ? 0 : calcFirtsNumber;
    numbers.push(`${first}`);
    const calcSecondNumber = 11 - (numbers.map((num, index) => parseInt(num) * (11 - index)).reduce((a, b) => reducer(a, b)) % 11);
    const second = (calcSecondNumber >= 10) ? 0 : calcSecondNumber;
    return parseInt(parts[1]) === parseInt(`${first}${second}`);
}

module.exports = validateCpf;
