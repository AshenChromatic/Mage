let DEBUG_MODE = true; // Set to false for normal gameplay


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


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//---------------------------//
// Resources                 //
//---------------------------//

let knowledgeVisible = false;
let orbVisible = false;

let  resource = {
    knowledge: {
        name: 'knowledge',
        amount: 0,
        displayId: 'knowledgeAmount'
    },
    gold: {
        name: 'gold',
        amount: 5,
        displayId: 'goldAmount'
    },
    orb: {
        name: 'orb',
        amount: 0,
        displayId: 'orbAmount'
    }
};


//---------------------------//
// Clickers                  //
//---------------------------//

function researchClick() {
    //Knowledge visiblizer
    if (!knowledgeVisible) {
        const knowledgeDisplay = document.getElementById('knowledgeDisplay');
        if (knowledgeDisplay) {
            knowledgeDisplay.classList.add('show');
            knowledgeVisible = true;
        }
    }
    //Knowledge increaserizer
    resource.knowledge.amount += 1;
    const knowledgeAmount = document.getElementById(resource.knowledge.displayId);
    if (knowledgeAmount !== null) {
        knowledgeAmount.innerHTML = resource.knowledge.amount;
    }
    //Orb unlocker
    if (orbUnlock === false && resource.knowledge.amount >=10) {
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
// Buyers                    //
//---------------------------//
 
const buyer = {
    orb: {
        resourceNeed: ['gold'],
        costs: [5],
        resourceGet: ['orb']
    }
}

function checkIfEnoughResources(resourceNeed, costs) {
    if (!Array.isArray(resourceNeed)) resourceNeed = [resourceNeed];
    if (!Array.isArray(costs)) costs = [costs];

    if (resourceNeed.length !== costs.length) {
        console.error('resources and costs not paired up');
        return false;
    }

    // Check if the player has enough resources
    for (let i = 0; i < resourceNeed.length; i++) {
        if (resource[resourceNeed[i]].amount < costs[i]) {
            console.error('You are too broke in ' + resource[resourceNeed[i]].name);
            return false;
        }
        return true;
    }
}

function buy(resourceNeed, costs, resourceGet) {
    if (!checkIfEnoughResources(resourceNeed, costs)) {
        console.error('Not enough resources to buy');
        return;
    }
    // Deduct costs from resources and update the display
    for (let i = 0; i < resourceNeed.length; i++) {
        resource[resourceNeed[i]].amount -= costs[i];
        const displayId = resource[resourceNeed[i]].displayId;
        const displayElement = document.getElementById(displayId);
        if (displayElement) {
            displayElement.innerHTML = resource[resourceNeed[i]].amount;
        }
    }
    // Add the resource gained
    resource[resourceGet].amount += 1;
    const displayId = resource[resourceGet].displayId;
    const displayElement = document.getElementById(displayId);
    if (displayElement) {
        displayElement.innerHTML = resource[resourceGet].amount;
    }

    // Immediately update hover box state
    const hoverBoxBuy = document.getElementById('hoverBoxBuy');
    if (checkIfEnoughResources(resourceNeed, costs)) {
        hoverBoxBuy.classList.remove('broke');
    } else {
        hoverBoxBuy.classList.add('broke');
    }
    return true;
}

document.getElementById('buyOrbBtn').addEventListener('click', function() {
    const orbData = buyer.orb;
    if (buy(orbData.resourceNeed, orbData.costs, orbData.resourceGet[0]) && orbVisible === false) {
        console.log('Attempting to show orb');
        const orbDisplay = document.getElementById('orbDisplay');
        const orbDiv = document.getElementById('orbDiv');
        if (orbDiv) {
            orbDiv.classList.add('show');
        }
        if (orbDisplay) {
            orbDisplay.classList.add('show');
            orbVisible = true;
        }
    }
});




//---------------------------//
// Generators                //
//---------------------------//







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

document.getElementById('researchTabBtn').addEventListener('click', function() {
    openTab('researchTab');
});
document.getElementById('shopTabBtn').addEventListener('click', function() {
    openTab('shopTab');
});


//---------------------------//
// Hoverbox                  //
//---------------------------//

const hoverBox = document.getElementById('hoverBox');
const buyOrbBtn = document.getElementById('buyOrbBtn');


function setBuyText(desc, cost, effect, flavor) {
    const hoverBuyDesc = document.getElementById('hoverBuyDesc');
    const hoverBuyCost = document.getElementById('hoverBuyCost');
    const hoverBuyEffect = document.getElementById('hoverBuyEffect');
    const hoverBuyFlavor = document.getElementById('hoverBuyFlavor');

    hoverBuyDesc.innerHTML = desc;
    hoverBuyCost.innerHTML = cost;
    hoverBuyEffect.innerHTML = effect;
    hoverBuyFlavor.innerHTML = flavor;
}

buyOrbBtn.addEventListener ('mouseover', function() {
    hoverBox.classList.add('show');
    console.log('Hover box shown for Buy Orb button');
    setBuyText(
        'A mana orb that gathers and stores ambient mana from the environment.',
        '5 gold',
        '+1 Mana/s <br> +50 Max Mana',
        ''
    );
    const hoverBoxBuy = document.getElementById('hoverBoxBuy');
    if (checkIfEnoughResources(buyer.orb.resourceNeed, buyer.orb.costs)) {
        hoverBoxBuy.classList.remove('broke');
    } else {
        hoverBoxBuy.classList.add('broke');
    }
});

buyOrbBtn.addEventListener('mousemove', function(e) {
    hoverBox.style.left = (e.pageX + 10) + 'px';
    hoverBox.style.top = (e.pageY + 10) + 'px';
});

buyOrbBtn.addEventListener ('mouseleave', function() {
    hoverBox.classList.remove('show');
    console.log('Hover box hidden for Buy Orb button');
});





//---------------------------//
// Dialogs                   //
//---------------------------//

// Orb unlock dialog
async function unlockOrb() {
    const logDiv = document.getElementById('gameLog');
    logDiv.innerHTML +='<br>';
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
    document.getElementById('goldDisplay').classList.add('show');

}

//---------------------------//
// Event Listeners           //
//---------------------------//


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