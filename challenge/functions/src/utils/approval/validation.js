const AppError = require('../../errors/AppError');

function validation(body) {
    const { status, uid } = body;
    const validStatus = ['APPROVED', 'DISAPPROVED'];
    if (!uid) throw new AppError([{ type: 'Required parameter', field: 'uid', message: `User uid is required` }]);
    if (!status || !validStatus.includes(status.toUpperCase())) throw new AppError([{ type: 'Invalid parameter', field: 'status', message: `Valid status are only 'approved' or 'disapproved'` }]);
    return;
}

module.exports = validation;
