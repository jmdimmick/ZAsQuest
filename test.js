const { stat } = require("fs");
const { get } = require("http");
const repl = require("repl");

let arr = [2, 6, 4, 5, 6, 2, 7, 6, 8, 4, 5];
function partition(left_pointer, right_pointer) {
    let pivot = arr[right_pointer];
    let pivot_index = right_pointer;
    right_pointer--;
    if (left_pointer >= right_pointer) {
        console.log('small partition');
        return;
    }
    while (arr[left_pointer] < pivot) {
        left_pointer++;
    }
    while (arr[right_pointer] > pivot) {
        right_pointer--;
    }
    console.log(left_pointer);
    console.log(right_pointer);
    if (left_pointer >= right_pointer) {
        [arr[pivot_index], arr[left_pointer]] = [arr[left_pointer], arr[pivot_index]];
        console.log('left ahead');
        partition(0, left_pointer-1);
        // if (left_pointer < pivot_index) {
        //     console.log('left made end');
        //     partition(left_pointer+1, arr.length-1);
        // }
    }
    else {
        [ arr[left_pointer], arr[right_pointer]] = [arr[right_pointer], arr[left_pointer]];
        console.log('left behind');
        console.log(arr);
       partition(0, pivot_index);
    }
}

function evalInput(uInput, context, filename, callback) {
    if (uInput === 'x\n') {
        process.exit();
    }
    callback(null);
}
partition(0,arr.length-1);
repl.start({ prompt: `array: ${arr}. Enter x to exit ==> `, eval: evalInput });