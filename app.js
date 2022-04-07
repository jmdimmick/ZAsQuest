
const { stat } = require("fs");
const { get } = require("http");
const repl = require("repl");

//PLAYER OBJECT
const player = {
    stats: {
        drunkeness: 0,
        obnoxiousness: 0,
        neediness: 0,
        coolness: 0
    },
    uniqueItems: {},
    genericItems: {},
    quests: {},
    neighbors: {}
}

const topMenu = "\n\
Top Menu: \n\
Z. Bar \n\
A. Inventory \n\
S. Stats \n\
Q. Start Quest \n\
X. Exit Game\n"

const barMenu = "\n\
    What would like to drink? \n\
    \n\
    P.   Buy some mead for yourself \n\
    O.   Buy some mead for your neighbor \n\
    TOP. Z, A, S, Q, X \n" 
        
//ACTION MENUS

const inventory = "\n\
    \n\
    E [item name]. Equip Item \n\
    T [item name]. Trade Item (Lateral) \n\
    U [item name]. Trade Item + 1 Gem (Upgrade) \n\
    TOP.           Z, A, S, Q, X\n"

const drink4U = "\n\
    Bought Mead for Yourself: \n\
    \n\
    D.   Drink Peacefully \n\
    F.   Start a Fight \n\
    TOP. Z, A, S, Q, X\n"

const drink4Else = "\n\
    Bought Mead for Your Neighbor: \n\
    \n\
    C.   Complain about Your Last Quest \n\
    R.   Request Help on Your Next Quest \n\
    TOP. Z, A, S, Q, X\n"

//REQUEST HELP ACTION

const neighborNames = ['Svie', 'Wart', 'Grog', 'Gunt', 'Lond', 'Guze', 'Horp', 'Durt', 'Pock', 'Chim', 'Dunp', 'Wirl',
'Pent', 'Quif', 'Yorf', 'Itol', 'Monb', 'Forc', 'Xord', 'Asse', 'Damg', 'Hoji', 'Kult', 'Joix', 
'Urft', 'Licq', 'Orel', 'Whef', 'Cerd', 'Fonf', 'Jalt', 'Buse', 'Vole', 'Leps', 'Pold', 'Exid', 
'Tchs', 'Djom', 'Jomb', 'Lury', 'Epol', 'Pian'];

let neighborName = getDetail(neighborNames);

const fightStyles = ['fisticuffs.', 'arm wrestling.', 'a pushup race.', 'random feats of strength.', 'a dance off.', 'log rolling.', 
'a thumb war.', 'a series of inense rock paper scissors matches.', 'holding a burning match.', 'a staring contest.', 
'darts where your faces were the targets.', 'trading ball taps.', 'trading licks, like licking each other for real.'];

const yesHelp = `\n  Your neighbor, ${neighborName}, has agreed to help you.\n`;

const noHelp = `\n  Your neighbor, ${neighborName}, does not want to help.\n`;

const helpActions = [yesHelp, noHelp];

//ACTION RESULT CONSTRUCTORS

const stats = "\n  Stats ... to be developed.\n";

const quest = "\n  Quest ... to be developed\n";

const equipMessage = "\n  You equipped that.\n";

const tradeMessage = "\n  You traded that for this.\n";

const upgradeMessage = "\n  You upgraded that to this.\n";

const peaceful = "\n  You are getting drunk.\n";

const fight = `\n  You have started a fight with ${neighborName}.\n`;

const fightRepeat = `\n  You have started a fight with ${neighborName} ... again.\n`;

const fightLost = `\n\
  You lost. :( \n\
  ${neighborName} bested you at `
  //take out fightStyle reference and call it in the getOutcome function so it will call a new fight style each time

const fightWon = `\n\
\n\
\n You bested ${neighborName} at `

const fightOutcomes = [fightLost, fightWon]

const fightOutcome = getDetail(fightOutcomes);

const complain = "\n  You are complaining.\n";

const requestHelp = getDetail(helpActions);

//FAIL MENUS

const drinkFail = "\n  You need to buy another drink to do that.\n\
   \n\
   P.   Buy some mead for yourself \n\
   O.   Buy some mead for your neighbor \n\
   TOP. Z, A, S, Q, X \n"

   const randArray = [0, 1];

let currentMove = "";
let lastMove = "";

function buildResponse(cmd) {
    let cmdStr = cmd;
    cmdStr = cmdStr.toUpperCase();
    let weirdAns = "What the hell is " + cmdStr.substring(0, cmdStr.length-1) + "?";
    switch (cmdStr) {
        case 'TOP\n':
            return topMenu;
        case 'Z\n':
            return barMenu;
        case 'A\n': 
            return inventory;
        case 'S\n':
            return stats;
        case 'Q\n':
            player.stats.drunkeness = 0;
            player.stats.neediness = 0;
            player.neighbors[neighborName] = true;
            neighborName = newNeighbor(0);
            return quest;
            //set up new neighbor to generate with a story of what happened to the old neighbor if they helped on the quest.
            //they always die, every time
        case 'X\n':
            process.exit();
        case 'P\n':
            // lastMove = "P";
            player.stats.drunkeness++;
            print(`\n  Drunkeness = ${player.stats.drunkeness}`);
            return drink4U;
        case 'O\n':
            // lastMove = "O";
            player.stats.drunkeness++;
            print(`\n  Drunkeness = ${player.stats.drunkeness}`);
            return drink4Else;
        case 'E\n':
            return equipMessage;
        case 'T\n':
            return tradeMessage;
        case 'U\n':
            return upgradeMessage;
        case 'D\n':
        case 'F\n':
        case 'C\n':
        case 'R\n':
            return drinkCheck(cmdStr, lastMove);
        case 'LAST\n':
            print(lastMove);
            return "";
        default: 
            //can also console.log anything in plain text above the eval process
            //could be a good option for the menu ... or vice versa
            return weirdAns;
    }
}

function getDetail(detailArr) {
    let index = random(detailArr.length);
    console.log(detailArr.length);
    console.log(index);
    return detailArr[index];
}

function random(length) {
    return Math.floor(Math.random()*length);
}

function evalInput(uInput, context, filename, callback) {
    print(buildResponse(uInput));
    currentMove = uInput.toUpperCase();
    lastMove = currentMove.substring(0, currentMove.length-1);
    callback(null);
}

function print(text) {
    console.log(text);
}

function drinkCheck(cmdStr, lastMove) {
    switch (cmdStr) {
        case 'D\n':
            if (lastMove == "P") {
                print(`\n  Drunkeness = ${player.stats.drunkeness}`);
                player.stats.coolness++;
                return peaceful;
            }
            else {
                return drinkFail;
            }
        case 'F\n':
            if (lastMove == "P") {
                print(`\n  Drunkeness = ${player.stats.drunkeness}`);
                player.stats.obnoxiousness++;
                return getFightOutcome();
            }
            else {
                return drinkFail;
            }
        case 'C\n':
            if (lastMove == "O") {
                print(`\n  Drunkeness = ${player.stats.drunkeness}`);
                player.stats.obnoxiousness++;
                return complain;
            }
            else {
                return drinkFail;
            }
        case 'R\n':
            if (lastMove == "O") {
                print(`\n  Drunkeness = ${player.stats.drunkeness}`);
                player.stats.neediness++;
                return requestHelp;
            }
            else {
                return drinkFail;
            }
        default:
            return;
    }
}

function getFightOutcome() {
    const fightStyle = getDetail(fightStyles);
    if (player.stats.obnoxiousness > 1) {
        return fightRepeat + fightOutcome + fightStyle;
    }
    else {
        return fight + fightOutcome + fightStyle;
    }
}

function newNeighbor(attempts) {
    var newGuy = getDetail(neighborNames);
    attempts++;
    if (!player.neighbors[newGuy]) {
        console.log(newGuy);
        console.log(typeof newGuy);
        console.log(`success at ${attempts} attempts`);
        return newGuy;
    }
    else if (attempts < neighborNames.length - 1) {
        console.log('new attempt');
        return newNeighbor(attempts);
    }
    else {
        console.log('god mode');
        return "God (You are alone now.)"
    }
}

/*
ZA'S QUEST

Top Menu:
Z. Bar
A. Inventory
S. Stats
Q. Start Quest
X. Exit Game

    Bar Menu:
    P. Buy some mead for yourself
    O. Buy some mead for your neighbor
    Z, A, S, Q, X

        Bought Mead for Yourself:
        D. Drink Peacefully
        F. Start a Fight
        Z, A, S, Q, X
        
        Bought Mead for Your Neighbor:
        C. Complain about Your Last Quest
        R. Request Help on Your Next Quest
        Z, A, S, Q, X
    
    Inventory Menu:
    E [item name]. Equip Item
    T [item name]. Trade Item (Lateral)
    U [item name]. Trade Item + Gem (Upgrade)
    Z, A, S, Q, X
    
        Weapons/Equipment/Treasure Menu:


            ITEMS LIST:
                WEAPONS:
                    SWORD    < +SHIELD < +FIRE
                    CROSSBOW < +DAGGER < +LUCK
                EQUIPMENT:
                    ARMOR   < +HEALING   < +BRAVERY
                    STEALTH < +DECPETION < +ESCAPE
                TREASURE:
                    GEM
                    GOLD

    Stats Menu:
    Z, A, S, Q, X



*/

if (lastMove == "") {
    print(topMenu);
}

repl.start({ prompt: "Enter an Option ==> ", eval: evalInput });