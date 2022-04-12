const { stat } = require("fs");
const { get } = require("http");
const repl = require("repl");

let arr = [6, 2, 4];
function partition(left_pointer, right_pointer) {
    let pivot = arr[right_pointer];
    right_pointer--;
    arr.push(6);
}

function evalInput(uInput, context, filename, callback) {
    if (uInput === 'x\n') {
        process.exit();
    }
    callback(null);
}
partition(0,2);
repl.start({ prompt: `array: ${arr}. Enter x to exit ==> `, eval: evalInput });