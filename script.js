let DEBUG_MODE = false; // Set to false for normal gameplay


//This function is for waiiiting
function sleep(ms) {
    if (DEBUG_MODE) return Promise.resolve();
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    });
}

//Put text in the log
function sendToLog(message) {
    const logDiv = document.getElementById('gameLog');
    logDiv.innerHTML += '> ' + message + '<br>';
}


//Setup for orbUnlock
let orbUnlock = false;

//Make knowledge go up when the research button is clicked
//Also make the knowledge display visible if it isn't already
let knowledge = 0;
let knowledgeVisible = false;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function researchClick() {
    //Knowledge visiblizer
    if (!knowledgeVisible) {
        const knowledgeDisplay = document.querySelector('.knowledgeDisplay');
        if (knowledgeDisplay) {
            knowledgeDisplay.classList.add('show');
            knowledgeVisible = true;
        }
    }
    //Knowledge increaserizer
    knowledge += 1;
    const knowledgeAmount = document.getElementById('knowledgeAmount');
    if (knowledgeAmount !== null) {
    knowledgeAmount.innerHTML = knowledge;
    }
    //Orb unlocker
    if (orbUnlock === false && knowledge >=10) {
        let orbUnlockRandom = getRandomInt(1, 30);
        console.log('orbUnlockRandom: ' + orbUnlockRandom);
        //If the random number is 1, unlock the orb
        if (orbUnlockRandom === 1) {
            orbUnlock = true;
            unlockOrb();
        }
    }
}

//---------------------------//
// Tab Switchers             //
//---------------------------//

const tabIds = ['researchTab', 'shopTab'];

function openTab(tabId) {
    tabIds.forEach(id => {
        const tab = document.getElementById(id);
        if (tab) {
            tab.classList.remove('show');
        }
    });
    const currentTab = document.getElementById(tabId);
    if (currentTab) {
        currentTab.classList.add('show');
    }
}


//---------------------------//
// Dialogs                   //
//---------------------------//

// Orb unlock dialog
async function unlockOrb() {
    sendToLog('After a few minutes of research, you feel like you\'ve learned something.');
    await sleep(4000);
    sendToLog('To use magic, you need mana. You do not currently have any mana.')
    await sleep(4000);
    sendToLog('Luckily, they sell mana orbs online nowadays.');
    await sleep(4000);
    sendToLog('You think that maybe you should buy one.');
    document.getElementById('researchTabBtn').classList.add('show');
    document.getElementById('shopSpace').classList.add('show');
    document.getElementById('shopTabBtn').classList.add('show');
}

//---------------------------//
// Event Listeners           //
//---------------------------//

//Tabs
document.getElementById('researchTabBtn').addEventListener('click', function() {
    openTab('researchTab');
});
document.getElementById('shopTabBtn').addEventListener('click', function() {
    openTab('shopTab');
});

//Research button
document.getElementById('researchBtn').addEventListener('click', researchClick);


//---------------------------//
// Initialization            //
//---------------------------//

//Initial log and display Research button
async function startGame() {
    sendToLog('You sit at your desk, the white-ish light of your computer monitor illuminating your face.');
    await sleep(4000);
    sendToLog('You spent most of the day doing what can only be described as')
    await sleep(2000);
    sendToLog('Goofing Off.')
    await sleep(4000);
    sendToLog('However, most of your friends have gone to bed, and you are left with nothing to entertain yourself.');
    await sleep(4000);
    sendToLog('You suppose it is finally time to actually do something productive.');
    await sleep(4000);
    sendToLog('Magic isn\'t going to learn itself, after all.');
    document.querySelector('.gameMainCenter').classList.add('border');
    document.querySelector('.researchTab').classList.add('show');
    document.querySelector('.centerContent').classList.add('show');

}
startGame();