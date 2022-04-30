const { stat } = require("fs");
const { get } = require("http");
const repl = require("repl");

const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function evalInput(uInput, context, filename, callback) {
    if (uInput === 'x\n') {
        process.exit();
    }
    if (uInput === '\n') {
        newDetail(testArray, "done");
        console.log(details);
    }
    callback(null);
}

repl.start({ prompt: `Enter x to exit ==> `, eval: evalInput });



function getDetail(detailArr) {
    let index = random(detailArr.length);
    return detailArr[index];
}

function random(length) {
    return Math.floor(Math.random()*length);
}

const details = {};

function newDetail(detailArr, endOfList, attempts=0) {
    var newDeet = getDetail(detailArr);
    attempts++;
    if (attempts === detailArr.length - 1) {
        details[endOfList] = true;
        return endOfList;
    }
    else if (!details[newDeet]) {
        console.log(attempts);
        details[newDeet] = true;
        return newDeet;
    }
    else {
        console.log('recurse');
        return newDetail(detailArr, endOfList, attempts);
    }
}