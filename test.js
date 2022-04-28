const { stat } = require("fs");
const { get } = require("http");
const repl = require("repl");

function evalInput(uInput, context, filename, callback) {
    if (uInput === 'x\n') {
        process.exit();
    }
    callback(null);
}
partition(0,arr.length-1);
repl.start({ prompt: `array: ${arr}. Enter x to exit ==> `, eval: evalInput });