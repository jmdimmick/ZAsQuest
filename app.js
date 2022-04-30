
const { stat } = require("fs");
const { get } = require("http");
const repl = require("repl");

//PLAYER OBJECT
const player = {
    stats: {
        drunkeness: 0,
        obnoxiousness: 0,
        neediness: 0,
        coolness: 0,
        //shame: 0,
        //confidence: 0,
        hasFriend: false,
        hasQuest: false
    },
    currentWeapon: 'no weapon',
    //uniqueItems: {},
    //genericItems: {},
    currentQuest: '',
    monsters: {},
    quests: {},
    neighbors: {}
};

const topMenu = "\n\
Top Menu: \n\
Z. Bar \n\
A. Inventory \n\
S. Stats \n\
Q. Start Quest \n\
X. Exit Game\n"

const topMenuAbbr = "\n\
  TOP. Z, A, S, Q, X \n"

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



const helpActions = ['yesHelp', 'noHelp'];

//ACTION RESULT CONSTRUCTORS

const stats = "\n  Stats ... to be developed.\n";

const quest = "\n  Quest ... to be developed\n";

const equipMessage = "\n  You equipped that.\n";

const tradeMessage = "\n  You traded that for this.\n";

const upgradeMessage = "\n  You upgraded that to this.\n";

const peaceful = "\n  You are getting drunk.\n";

const fight = `\n  You have started a fight with `;

const fightRepeat = `\n  You have started a fight with `;

const fightLost = `\n\
  You lost. :( \n\
  `;

const fightWon = `\n\
\n\
\n You bested `;

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

//QUEST COMPONENTS

const questPrompts = ['can score some hefty loot', 'really get your rocks off', 'feel alive like never before', 'earn some real respect', 'learn the meaning of life', 'impress the local beauties', 
'achieve enlightenment', 'be the hero that we deserve', 'end the plague', 'advance your piece (if you know what I mean)', 'test the fates', 'soil your oats', 'self-actualize', 'call yourself a human'];

const monsters = ['gorth', 'barat', 'uniff', 'prantz', 'reir monk', 'sweet beezil', 'wite', 'klepping', 'trune', 'weirn', 
'fuul', 'repling', 'const', 'grimp', 'rundle', 'wute', 'popple', 'duplecks', 'zinto', 'guey', 'julip', 'weffer', 'lonk', 
'gonk', 'ranter', 'antihelo', 'buleon', 'grinx', 'nuhl', 'chuf', 'domb', 'klit', 'miil', 'avout', 'lewdie', 'opli', 'derper'];

const quests = ['steal the eggs of a hairy eagle', 'ask the immortal being the ultimate question', 'destroy the enchanted belt buckle', 'climb the musty mountains of Groyne to find the Pubrict', 
'learn the holy rituals of the mock people', 'exterminate the parasitic race of knotted worms', 'dance with an enchantress', 'seduce the love goddess', 'pluck a scale from the enchanted arse-dragon', 
'find the lost path to the death pyramids', 'solve the riddle of the foolish doctor', 'return from the depths of the deep hole, with pictures', 'eat the luscious fruit of the Cevantese Bush', 
'clip the wings of the flatulent owl', 'begin a never-ending story', 'ride the fin of a great whale to mysterious center of the sea', 'learn the unusual ways of the lawless gimps and exploit them', 
'play a game of chance with the great wizard, Pulleguean the Uncomforable', 'discover the terrible truth of our leader', 'train with the greatest grandpa in the realm', 'face the boring fire weasel', 
'burn the sacred scrolls', 'destroy the heretical evidence of our close evolutionary relatives', 'disguise yourself amongst the poo-dwellers and exploit them', 'gain the respect of the local weirdo', 
'hunt the formidable pack of vegetarian wolves', 'battle the foul demon inhabiting farm animals', 'enter the dream of the competing tavern proprietor and incept the idea of dissolving his business', 
'defeat all the stinging insects', 'embrace the love of a wood elf', 'find the missing town drunk', 'uncover the hidden meaning behind the inscription in the old oak tree', 'incite a rodent revolution',
'drink from the well of amusing insights', 'read the ancient text containing the anticurse', 'slay the great elaborator', 'sabotage the mechanical thinking device that secretly controls the realm'];

const weapons = ['meaty bone', 'large needle', 'wooden hammer', 'sharp pinwheel', 'pinecone mace', 'set of keys', 'flask of rare spices', 'frog sweat', 'weighted gloves', 'blunt sword', 'poison dust', 
'pair of quilled gauntlets', 'ink bomb', 'nasty hammer', 'double-edge sword', 'woven silk', 'sack of rotten apples', 'pair of spikey kneepads', 'infinite candle', 'youth tonic', 'grumpy toad', 
'bone comb', 'bag of bees', 'rudimentary flamethrower', 'yeast bomb', 'botched healing potion', 'hair whip', 'bleeder', 'eye poison', 'knotted worm', 'bag of sick', 'pointed stick', 'braid of snakes', 
'sugar blade', 'explosive spice', 'grain gun', 'trained hairy moth', 'bone chain', 'pair of knuckle quills', 'small lance', 'molten dagger', 'mysterious orb', 'blood butter', 'dark bow', 
'long finger knife', 'scorpion tail']

const neighborWeapons = ['smelly sock', 'overextended wit', 'encyclopedic knowledge of forraging', 'disgusting magic', 'painted elephant truck', 'rotten wood club', 'terrible dad jokes', 'shuffle speed', 
'goopey gloves', 'mental training', 'combat meditation', 'pitchy singing voice', 'ability to break dance', 'binaural beats', 'shoes', 'puss-filled warts', 'hat trick', 'story about the vegetarian wolves']

const lys = ['bravely', 'sportingly', 'galantly', 'unquestionably', 'with grace', 'uniquely'];

const questOutcomes = ['and defeated', 'but were defeated by'];

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
            return `\n  Current Weapon__${player.currentWeapon}\n\
            ${topMenuAbbr}`;
        case 'S\n':
            print("");
            print(`  Drunkeness______${player.stats.drunkeness}`);
            print(`  Confidence______${player.stats.confidence}`);
            print(`  Coolness________${player.stats.coolness}`);
            print(`  Neediness_______${player.stats.neediness}`);
            print(`  Obnoxiousness___${player.stats.obnoxiousness}`);
            print(`  Shame___________${player.stats.shame}`);
            return topMenuAbbr;
        case 'Q\n':
            if (player.stats.hasQuest) {
                player.stats.drunkeness = 0;
                player.stats.neediness = 0;
                player.neighbors[neighborName] = true;
                questNeighbor = neighborName;
                neighborName = newNeighbor(0);
                return getQuestSummary(questNeighbor);
            }
            else {
                return '\n  You do not have a pending quest. Do a nice thing then talk to the bartender.\n'
            }
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
        case 'FULL PLAYER\n':
            return player;
        default: 
            //can also console.log anything in plain text above the eval process
            //could be a good option for the menu ... or vice versa
            return weirdAns;
    }
}

function getDetail(detailArr) {
    let index = random(detailArr.length);
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
                player.stats.obnoxiousness--;
                return `${peaceful}\n\
                ${topMenuAbbr}`;
            }
            else {
                return drinkFail;
            }
        case 'F\n':
            if (lastMove == "P") {
                print(`\n  Drunkeness = ${player.stats.drunkeness}`);
                player.stats.obnoxiousness++;
                return `${getFightOutcome()}\n\
                ${topMenuAbbr}`;
            }
            else {
                return drinkFail;
            }
        case 'C\n':
            if (lastMove == "O") {
                player.stats.hasQuest = true;
                player.currentQuest = getDetail(quests);
                player.currentWeapon = getDetail(weapons);
                const questPrompt = getDetail(questPrompts);
                return `\n  Bartender: "I hear you can ${questPrompt} if you manage to ${player.currentQuest}. Take this ${player.currentWeapon.toUpperCase()} to help you."\n\
                \n  You now have a quest!\n\
                ${topMenuAbbr}`;
                //replace with asking the bartender for a quest. move the quest generator here, save it to player, and reference it in getQuest()
            }
            else {
                return drinkFail;
            }
        case 'R\n':
            if (lastMove == "O") {
                print(`\n  Drunkeness = ${player.stats.drunkeness}`);
                player.stats.neediness++;
                return `${getNeighborAction(requestHelp)}\n\
                ${topMenuAbbr}`;
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
    if (player.stats.obnoxiousness >= 2) {
        return fightRepeat + `${neighborName} ... again.\n` + `\n  You lost. :( \n\n  ${neighborName} bested you at ` + fightStyle + `\n`;
    }
    else {
        return fight + `${neighborName}.\n` + `\n  You won. :) \n\n  You bested ${neighborName} at ` + fightStyle + `\n`;
    }
}

function newNeighbor(attempts) {
    var newGuy = getDetail(neighborNames);
    attempts++;
    if (!player.neighbors[newGuy]) {
        // console.log(newGuy);
        // console.log(typeof newGuy);
        // console.log(`success at ${attempts} attempts`);
        return newGuy;
    }
    else if (attempts < neighborNames.length - 1) {
        // console.log('new attempt');
        return newNeighbor(attempts);
    }
    else {
        // console.log('god mode');
        return "God (You are alone now.)"
    }
}

function getNeighborAction(result) {
    switch (result) {
        case 'yesHelp':
            player.hasFriend = true;
            return `\n  Your neighbor, ${neighborName}, has agreed to help you.\n`;
        case 'noHelp':
            return `\n  Your neighbor, ${neighborName}, does not want to help.\n`;
    }
}

function getQuestSummary(neighbor) {
    const monster = newMonster(0);
    player.monsters[monster] = true;
    const quest = player.currentQuest;
    player.quests[quest] = true;
    const weapon = player.currentWeapon;
    const neighborWeapon = getDetail(neighborWeapons);
    const _ly = getDetail(lys);
    const outcome = getDetail(questOutcomes);
    let friendMessage = '';
    if (player.hasFriend) {
        friendMessage = `\n  Also, ${neighbor.toUpperCase()} helped by using their ${neighborWeapon.toUpperCase()}, but ultimately died.\n`;
        player.hasFriend = false;
    };
    player.stats.hasQuest = false;
    return `\n  You encountered the ${monster.toUpperCase()} on your quest to ${quest}.\n\
    \n  You used your ${weapon.toUpperCase()} ${_ly} ${outcome} the ${monster.toUpperCase()}.\n\
    ${friendMessage}`;
}

function newMonster(attempts) {
    var newMon = getDetail(monsters);
    attempts++;
    if (!player.monsters[newMon]) {
        // console.log(newGuy);
        // console.log(typeof newGuy);
        // console.log(`success at ${attempts} attempts`);
        return newMon;
    }
    else if (attempts < monsters.length - 1) {
        // console.log('new attempt');
        return newMonster(attempts);
    }
    else {
        // console.log('god mode');
        return "God (You are alone now.)"
    }
}

/*
ZA'S QUEST
    
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

player = {
    stats: {
        drunkeness: 0,
        obnoxiousness: 0,
        neediness: 0,
        coolness: 0,
        shame: 0,
        confidence: 0,
    },
    uniqueItems: {},
    genericItems: {},
    quests: {},
    neighbors: {}
}

drinking ++ drunkeness
    drink4neighbor ++ coolness
    complaining/fighting ++ obnoxiousness
    peaceful ++ coolness
        fighting/winning ++ confidence
        fighting/losing ++ shame
    helpasking ++ neediness
    helpreceived ++ friends



*/

if (lastMove == "") {
    print(topMenu);
}

repl.start({ prompt: "Enter an Option ==> ", eval: evalInput });