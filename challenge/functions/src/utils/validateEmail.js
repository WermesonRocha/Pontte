const validateEmail = email => email ? /^\S+@\S+\.\S+$/g.test(email) : false;

module.exports = validateEmail;
