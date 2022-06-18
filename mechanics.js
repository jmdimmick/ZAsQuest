const tools = require("./tools");
module.exports = {

    getFintiteDetail: function (detailArr, endOfList) {
        return tools.swapNPop(detailArr, endOfList);
    },

    getInfiniteDetail: function (detailArr) {
        return detailArr[tools.random(detailArr.length-1)];
    }

}


