const mountData = parsed => {
    const dataToWrite = { state: 'approval', status: parsed };
    return dataToWrite;
}

module.exports = mountData;
