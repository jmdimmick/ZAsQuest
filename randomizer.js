const { stat } = require("fs");
const { get } = require("http");
const repl = require("repl");

const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function evalInput(uInput, context, filename, callback) {
    if (uInput === 'x\n') {
        process.exit();
    }
    if (uInput === '\n') {
        getDetail(testArray, "done");
        console.log(details);
    }
    callback(null);
}

repl.start({ prompt: `Enter x to exit ==> `, eval: evalInput });

function random(length) {
    return Math.floor(Math.random()*length);
}

const details = {};

function getDetail(detailArr, endOfList) {
    var newDeet = swapNPop(detailArr, endOfList);
    if (!details[newDeet]) {
        details[newDeet] = true;
    }
}

function swapNPop(detailArr, endOfList) {
    let arrLen = detailArr.length;
    if (arrLen == 0) return endOfList;
    let i = random(arrLen-1);
    [detailArr[arrLen-1], detailArr[i]] = [detailArr[i], detailArr[arrLen-1]];
    return detailArr.pop()
}

