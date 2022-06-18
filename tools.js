module.exports = {
    swapNPop: function (detailArr, endOfList) {
        let arrLen = detailArr.length;
        if (arrLen == 0) return endOfList;
        let i = random(arrLen);
        [detailArr[arrLen-1], detailArr[i]] = [detailArr[i], detailArr[arrLen-1]];
        return detailArr.pop()
    },
    
    random: function (length) {
        return Math.floor(Math.random()*length);
    }
}