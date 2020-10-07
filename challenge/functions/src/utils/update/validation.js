const AppError = require('../../errors/AppError');

// Terminar essa parte da atualização
// Verificar em que estado o cara tá para ver os possiveis campos 'atualizáveis'

const validation = body => {
    const { uid } = body;
    if (!uid) throw new AppError([{ type: 'Required parameter', field: 'uid', message: `User uid is required` }]);
    return;
}

module.exports = validation;
