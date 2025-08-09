function sleep(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    });
}

function sendToLog(message) {
    const logDiv = document.getElementById('gameLog');
    logDiv.innerHTML += '> ' + message + '<br>';
}

let knowledge = 0;
let knowledgeVisible = false;
function researchClick() {
    if (!knowledgeVisible) {
        const knowledgeDisplay = document.querySelector('.knowledgeDisplay');
        if (knowledgeDisplay) {
            knowledgeDisplay.classList.add('show');
            knowledgeVisible = true;
        }
    }
    knowledge += 1;
    const knowledgeAmount = document.getElementById('knowledgeAmount');
    if (knowledgeAmount !== null) {
    knowledgeAmount.innerHTML = knowledge;
    }
}

document.getElementById('researchBtn').addEventListener('click', researchClick);








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
    document.querySelector('.centerContent').classList.add('show');
}
startGame();