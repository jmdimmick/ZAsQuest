
function squareA(a) {
    let b = "5\n"
    a = a.trimEnd()
    return a.trimEnd() * a.trimEnd();
}

const testPlayer = {
    test: false
}

module.exports = { squareA, testPlayer }