let DEBUG_MODE = {
    fastmode: true, //Skips waiting times
    dummies: false   // Shows dummy resources and generators
};


//This function is for waiiiting
function sleep(ms) {
    let sleepTime = ms;
    if (DEBUG_MODE.fastmode) {
        sleepTime = sleepTime / 10; // Reduce wait time by 90% in fast mode
    }
    return new Promise(function(resolve) {
        setTimeout(resolve, sleepTime);
    });
}

//Put text in the log
function sendToLog(message) {
    const logDiv = document.getElementById('gameLog');
    // Create a new div for the message
    const msgDiv = document.createElement('div');
    msgDiv.className = 'logMessage';
    msgDiv.innerHTML = '> ' + message + '<br>';
    logDiv.appendChild(msgDiv);
    // Trigger fade-in
    setTimeout(function() {
        msgDiv.classList.add('show');
    }, 10); // Short delay to ensure the element is added before transition
}



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


//---------------------------//
// Resources                 //
//---------------------------//



let knowledgeVisible = false;
let orbVisible = false;

let  resource = {
    dummyResource: {
        name: 'dummyResource',
        amount: 0,
        displayId: 'dummyResourceAmountVal',
        max: 10,
        visible: false
    },
    dummyGenerator: {
        name: 'dummyGenerator',
        amount: 1,
        displayId: 'dummyGeneratorAmount',
        generator: true,
        generate: 'dummyResource',
        rate: 1,
        visible: false
    },
    knowledge: {
        name: 'knowledge',
        amount: 0,
        displayId: 'knowledgeAmount',
        visible: false
    },
    gold: {
        name: 'gold',
        amount: 5,
        displayId: 'goldAmount',
        visible: false
    },
    orb: {
        name: 'orb',
        amount: 0,
        displayId: 'orbAmount',
        generator: true,
        generate: 'mana',
        rate: 1,
        increaseMax: 'mana',
        increaseMaxBy: 50,
        visible: false
    },
    mana: {
        name: 'mana',
        amount: 0,
        displayId: 'manaAmountVal',
        displayMaxId: 'manaMax',
        max: 0,
        visible: false
    }
};


//---------------------------//
// Clickers                  //
//---------------------------//

let orbUnlock = false;
let runeUnlock = false;
document.getElementById('researchBtn').addEventListener('click', researchClick);

function researchClick() {
    //Knowledge visiblizer
    if (!resource.knowledge.visible) {
        const knowledgeDisplay = document.getElementById('knowledgeDisplay');
        if (knowledgeDisplay) {
            knowledgeDisplay.classList.add('show');
            resource.knowledge.visible = true;
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
        if (orbUnlockRandom !== 1) {
            console.log('failed orb unlock check');
        }
        //If the random number is 1, unlock the orb
        if (orbUnlockRandom === 1) {
            orbUnlock = true;
            unlockOrb();
        }
    }
    //Rune unlocker
    if (runeUnlock === false && resource.knowledge.amount >= 100 && resource.orb.amount > 0) {
        let runeChance = Math.max(1, 100 - Math.floor((resource.knowledge.amount - 100)));
        let runeUnlockRandom = getRandomInt(1, runeChance);
        if (runeUnlockRandom !== 1) {
            console.log('failed rune unlock check');
        }

        //If the random number is 1, unlock the rune
        if (runeUnlockRandom === 1) {
            runeUnlock = true;
            unlockRune();
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
    //Increase max resource if applicable
    if (resource[resourceGet].increaseMax && resource[resourceGet].increaseMaxBy) {
        const target = resource[resource[resourceGet].increaseMax];
        if (target) {
            target.max += resource[resourceGet].increaseMaxBy;
            const maxDisplayId = target.displayMaxId;
            const maxDisplayElement = document.getElementById(maxDisplayId);
            if (maxDisplayElement) {
                maxDisplayElement.innerHTML = target.max;
            }
        }
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
    if(resource.orb.visible === false) {
        if (buy(orbData.resourceNeed, orbData.costs, orbData.resourceGet[0]) === true) {
            console.log('Attempting to show orb');
            const orbDisplay = document.getElementById('orbDisplay');
            const orbDiv = document.getElementById('orbDiv');
            if (orbDiv) {
                orbDiv.classList.add('show');
            }
            if (orbDisplay) {
                orbDisplay.classList.add('show');
                resource.orb.visible = true;
            }
        }
    }
});




//---------------------------//
// Generators                //
//---------------------------//
 
function generatorTick() {
    //search for all resources that generate
    for (const prop in resource) {
        if (resource.hasOwnProperty(prop)) {
            const obj = resource[prop];
            if (obj.generator === true) {
                const targetResource = resource[obj.generate];
                if (targetResource) {
                    const prevAmount = targetResource.amount;
                    targetResource.amount += obj.rate * obj.amount;
                    if (targetResource.amount > targetResource.max) {
                        targetResource.amount = targetResource.max;
                    }
                    // Update the display for the generated resource
                    const displayId = targetResource.displayId;
                    const displayElement = document.getElementById(displayId);
                    if (displayElement) {
                        displayElement.innerHTML = targetResource.amount;
                    }
                    // If resource was previously 0 and now > 0, show it
                    if (prevAmount === 0 && targetResource.amount > 0 && !targetResource.visible) {
                        const displayDiv = document.getElementById(displayId.replace('AmountVal', 'Display'));
                        if (displayDiv) {
                            displayDiv.classList.add('show');
                        }
                        targetResource.visible = true;
                    }
                }
            }
        }
    }
}
   

// Run generatorTick every second
setInterval(generatorTick, 1000);



//---------------------------//
// Tab Switchers             //
//---------------------------//

// Subtab switching for PC tab
const subTabIds = ['researchTab', 'shopTab'];

function openSubTab(tabId) {
    subTabIds.forEach(id => {
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

document.getElementById('researchTabBtn').addEventListener('click', function(e) {
    e.preventDefault();
    openSubTab('researchTab');
});
document.getElementById('shopTabBtn').addEventListener('click', function(e) {
    e.preventDefault();
    openSubTab('shopTab');
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
        'Surprisingly unponderable.'
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

// Rune unlock dialog
async function unlockRune() {
    const logDiv = document.getElementById('gameLog');
    logDiv.innerHTML += '<br>';
    sendToLog('You continue your research for a while.');
    await sleep(4000);
    sendToLog('It\'s difficult to find anything of real use, especially to a beginner such as yourself.');
    await sleep(4000);
    sendToLog('Pouring over wizard chatrooms leaves you with more questions than answers.');
    await sleep(4000);
    sendToLog('Such as');
    await sleep(2000);
    sendToLog('What the hell is a Power Word: Scrunch?');
    await sleep(4000);
    sendToLog('However, you do find some information.');
    await sleep(4000);
    sendToLog('Something that even you can manage');
    await sleep(4000);
    sendToLog('Runes.');
    await sleep(4000);
    sendToLog('Apparently, all some wizards do is draw a couple squiggles on a piece of paper and call it a day.');
    await sleep(4000);
    sendToLog('You turn to the empty space on your desk and pull out a notebook and a pencil.')
    unlockRune = true;
    document.getElementById('mainSelector').classList.add('show');
    document.getElementById('pcTabBtn').classList.add('show');
    document.getElementById('deskSpace').classList.add('show');
    document.getElementById('deskTabBtn').classList.add('show');
    document.getElementById('mainSelectorDiv').classList.add('show');
}

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
// Debug                    //
//---------------------------//
if (DEBUG_MODE.dummies) {
    resource.dummyResource.visible = true;
    resource.dummyGenerator.visible = true;
}
if (resource.dummyResource.visible === true) {
    const dummyDisplay = document.getElementById('dummyDisplay');
    if (dummyDisplay) {
        dummyDisplay.classList.add('show');
    }
}
if (resource.dummyGenerator.visible === true) {
    const dummyGenDisplay = document.getElementById('dummyGenDisplay');
    if (dummyGenDisplay) {
        dummyGenDisplay.classList.add('show');
    }
}

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
    document.getElementById('pcMainCenter').classList.add('show');

}
startGame();