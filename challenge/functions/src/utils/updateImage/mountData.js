const mountData = (oldList, newList) => {
    const fieldNames = ['userIdentification', 'proofOfIncome', 'propertyImage'];
    const nList = [];
    fieldNames.map(fieldname => {
        let newL = newList.filter(({ field }) => field === fieldname);
        let oldL = oldList.filter(({ field }) => field === fieldname);
        if (newL.length > 0) nList.push(newL[0]);
        else if (oldL.length > 0) nList.push(oldL[0]);
    });
    return nList;
}

module.exports = mountData;
