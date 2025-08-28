const debug = true;
window.mage = {
    playerColor: "#ff0000ff",
    slut: 0
};


//This function is for waiiiting
function sleep(ms) {
    let sleepTime = ms;
    if (DEBUG_MODE.fastmode) {
        sleepTime = sleepTime / 10; // Reduce wait time by 90% in fast mode
    }
    return new Promise(function (resolve) {
        setTimeout(resolve, sleepTime);
    });
}

//Put text in the journal
function sendToJournal(message) {
    const logDiv = document.getElementById('gameLog');
    const threshold = 5;
    const isAtBottom = logDiv.scrollHeight - logDiv.scrollTop - logDiv.clientHeight <= threshold;
    // Create a new div for the message
    const msgDiv = document.createElement('div');
    msgDiv.className = 'logMessage';
    msgDiv.innerHTML = '> ' + message + '<br>';
    logDiv.appendChild(msgDiv);
    if (isAtBottom) {
        logDiv.scrollTop = logDiv.scrollHeight;
    }
    // Trigger fade-in
    setTimeout(function () {
        msgDiv.classList.add('show');
    }, 10); // Short delay to ensure the element is added before transition
}

//Put text in the log
function sendToLog(message) {
    const logDiv = document.getElementById('gameLog2');
    const threshold = 5;
    const isAtBottom = logDiv.scrollHeight - logDiv.scrollTop - logDiv.clientHeight <= threshold;
    // Create a new div for the message
    const msgDiv = document.createElement('div');
    msgDiv.className = 'logMessage';
    msgDiv.innerHTML = '> ' + message + '<br>';
    logDiv.appendChild(msgDiv);
    if (isAtBottom) {
        logDiv.scrollTop = logDiv.scrollHeight;
    }
    // Trigger fade-in
    setTimeout(function () {
        msgDiv.classList.add('show');
    }, 10); // Short delay to ensure the element is added before transition
}

function sendClickLog(message, color) {
    const logDiv = document.getElementById('gameLog2');
    const threshold = 5;
    const isAtBottom = logDiv.scrollHeight - logDiv.scrollTop - logDiv.clientHeight <= threshold;

    // Create a new div for the message
    const msgDiv = document.createElement('div');
    msgDiv.className = 'logMessage';

    // Apply optional color
    var innerHTML = '> ';
    if (color) {
        innerHTML += '<span style="color: ' + color + '">';
    }

    // Simple marker syntax: [click:handlerName]text[/click]
    // Example: "Hey man. You [click:friendlyClassmate1]need something[/click]?"
    var regex = /\[click:([^\]]+)\](.*?)\[\/click\]/g;
    var lastIndex = 0;
    var match;
    while (match = regex.exec(message)) {
        // Append text before the clickable part
        innerHTML += message.substring(lastIndex, match.index);

        // Create clickable span with data attributes
        innerHTML += '<span class="dialogue" data-clickable="true" data-handler="' + match[1] + '">' + match[2] + '</span>';

        lastIndex = regex.lastIndex;
    }

    // Append any remaining text after the last clickable segment
    innerHTML += message.substring(lastIndex);

    if (color) {
        innerHTML += '</span>';
    }

    innerHTML += '<br>';
    msgDiv.innerHTML = innerHTML;
    // After setting innerHTML, assign function references to ._handler
    const clickableSpans = msgDiv.querySelectorAll('span[data-clickable="true"]');
    clickableSpans.forEach(span => {
        const handlerName = span.dataset.handler;
        if (typeof window[handlerName] === "function") {
            span._handler = window[handlerName];
        }
    });
    logDiv.appendChild(msgDiv);

    if (isAtBottom) {
        logDiv.scrollTop = logDiv.scrollHeight;
    }

    // Trigger fade-in
    setTimeout(function () {
        msgDiv.classList.add('show');
    }, 10); // Short delay to ensure the element is added before transition
    attachDialogueHandlers("dialogue");
}


function choiceToLog(message, handler) {
    const logDiv = document.getElementById('gameLog2');
    const threshold = 5;
    const isAtBottom = logDiv.scrollHeight - logDiv.scrollTop - logDiv.clientHeight <= threshold;
    // Create a new div for the message
    const msgDiv = document.createElement('div');
    msgDiv.className = 'logMessage';
    msgDiv.innerHTML = '<a href=\"#\" class=\"dialogue link\">' + message + '</a><br>';
    msgDiv.dataset.clickable = "true";
    msgDiv.dataset.choice = "true";
    // Store both the function reference and a string version in dataset
    msgDiv._handler = handler;
    msgDiv.dataset.handler = handler.name || "";
    logDiv.appendChild(msgDiv);
    if (isAtBottom) {
        logDiv.scrollTop = logDiv.scrollHeight;
    }
    // Trigger fade-in
    setTimeout(function () {
        msgDiv.classList.add('show');
    }, 10); // Short delay to ensure the element is added before transition
    attachDialogueHandlers("choice");
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


//---------------------------//
// Resources                 //
//---------------------------//
window.mage.resource = {
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
    },
    frog: {
        name: 'frog',
        amount: 0,
        displayId: 'frogAmount',
        visible: false
    },
    ink: {
        name: 'ink',
        amount: 0,
        displayId: 'inkAmount',
        visible: false
    },
    garbageRune: {
        name: 'Garbage Rune',
        amount: 0,
        displayId: 'garbageRuneAmount',
        visible: false
    },
    okRune: {
        name: 'Ok Rune',
        amount: 0,
        displayId: 'okRuneAmount',
        visible: false
    },
    goodRune: {
        name: 'Good Rune',
        amount: 0,
        displayId: 'goodRuneAmount',
        visible: false
    },
    perfectRune: {
        name: 'Perfect Rune',
        amount: 0,
        displayId: 'perfectRuneAmount',
        visible: false
    }
};
let resource = window.mage.resource;

//---------------------------//
// Saving                    //
//---------------------------//

window.mage.progress = {
    orbUnlock: false,
    runeUnlock: false,
    runeTwo: false,
    runeFive: false,
    runeTen: false,
    runeLevel: 1,
    runeXP: 0,
    unlockDoor: false,
    mainSelector: false,
    goneOutside: false,
    deskRunes: false,
};
let progress = window.mage.progress;

function saveGame() {
    console.log('Attempting export')
    // Collect all resources and progress
    const saveData = {
        main: window.mage,
        elements: getElementStates(),
        dialogue: dialogueManager,
        dialogueQueue: dialogueQueue,
    }
    // Store save
    localStorage.setItem("mageSave", JSON.stringify(saveData));
}
function exportGame() {
    const saveData = {
        main: window.mage,
        elements: getElementStates(),
        dialogue: dialogueManager,
        dialogueQueue: dialogueQueue,
    };

    // Convert to JSON string
    const dataStr = JSON.stringify(saveData, null, 2);

    // Make filename with game title + date/time
    const gameTitle = "Mage";
    const date = new Date();
    const timestamp = date.toISOString().replace(/[:.]/g, "-");
    const filename = `${gameTitle}_save_${timestamp}.json`;

    // Create a blob and trigger download
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}

function getElementStates() {
    var elements = document.querySelectorAll('.show, .border');
    var result = [];
    for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        if (el.id) {
            var classes = [];
            if (el.classList.contains('show')) {
                classes.push('show');
            }
            if (el.classList.contains('border')) {
                classes.push('border');
            }
            result.push({
                id: el.id,
                classes: classes
            });
        }
    }
    return result;
}

// importSave: allow loading from localStorage (key "myGameSave") or from a JSON file.
// After loading the JSON it calls applySave(saveData) to do the actual work.
function importGame() {
    // If there's a simple browser slot, offer it first.
    const browserKey = "mageSave";
    const browserSave = localStorage.getItem(browserKey);

    if (browserSave && confirm("Load save from browser storage? (OK = load, Cancel = choose file)")) {
        try {
            const saveData = JSON.parse(browserSave);
            applySave(saveData);
        } catch (e) {
            alert("Failed to parse browser save: " + e);
        }
        return;
    }

    // Otherwise, prompt the user to pick a file.
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.addEventListener("change", (ev) => {
        const file = ev.target.files && ev.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const saveData = JSON.parse(e.target.result);
                applySave(saveData);
            } catch (err) {
                alert("Failed to parse save file: " + err);
            }
        };
        reader.onerror = function () {
            alert("Failed to read file.");
        };
        reader.readAsText(file);
    });

    // trigger the picker
    input.click();
}

// applySave: given a parsed saveData object, apply it to the game state
function applySave(saveData) {
    if (!saveData || typeof saveData !== "object") {
        alert("Invalid save data.");
        return;
    }

    // 1) Cancel any dialogue immediately
    try {
        if (typeof dialogueManager === "object") {
            dialogueManager.running = false; // stop current dialogue loop immediately
        }
    } catch (e) {
        console.warn("Couldn't access dialogue manager to stop it:", e);
    }

    // 1b) Clear the current log
    const logDiv = document.getElementById('gameLog');
    logDiv.innerHTML = '';
    //Fallback for old save data that doesn't include window.mage
    if (!saveData.main) {
        saveData.main = window.mage;
    }
    // 2) Restore resources: overwrite fields for each resource and update displays
    //Fallback for old resource object
    if (saveData.resources && typeof saveData.resources === "object") {
        console.log("Attempting to set saveData.main.resource")
        saveData.main = (saveData.main || {});
        console.log("Made empty main object successfully")
        saveData.main.resource = saveData.resources;
        console.log("Copied old resource data successfully:", saveData.main.resource);
    }
    if (saveData.main.resource && typeof saveData.main.resource === "object") {
        Object.keys(saveData.main.resource).forEach(function (resName) {
            const saved = saveData.main.resource[resName];
            // If you already have a resource object, copy saved properties into it; otherwise create it
            if (typeof resource[resName] === "object") {
                // Overwrite existing values with saved ones
                Object.assign(resource[resName], saved);
            } else {
                // Create new resource entry in the resource table
                resource[resName] = Object.assign({}, saved);
            }

            // Update display(s) for this resource
            if (resource[resName].displayId) {
                var el = document.getElementById(resource[resName].displayId);
                if (el) {
                    el.textContent = resource[resName].amount;
                }
            }
            // If there is a displayMaxId and max, update that too
            if (resource[resName].displayMaxId && typeof resource[resName].max !== 'undefined') {
                var maxEl = document.getElementById(resource[resName].displayMaxId);
                if (maxEl) {
                    maxEl.textContent = resource[resName].max;
                }
            }
        });
    }
    //Fallback for old progress object
    if (saveData.progress && typeof saveData.progress === "object") {
        console.log("Attempting to set saveData.main.progress")
        saveData.main = (saveData.main || {});
        console.log("Made empty main object successfully")
        saveData.main.progress = saveData.progress;
        console.log("Copied old progress data successfully:", saveData.main.progress);
    }
    // 3) Restore game state
    if (typeof saveData.main !== "undefined") {
        window.mage = saveData.main;
        progress = window.mage.progress;
    }
    // 3.5) Restore dialogue queue
    if (Array.isArray(saveData.dialogueQueue)) {
        dialogueQueue = saveData.dialogueQueue;
    }

    // 4) Reveal/hide elements according to saved element states
    if (Array.isArray(saveData.elements)) {
        // First remove the classes from all currently marked elements (so we have a clean slate)
        const currently = document.querySelectorAll('.show, .border');
        currently.forEach(el => {
            el.classList.remove('show');
            el.classList.remove('border');
        });

        // Apply saved classes
        saveData.elements.forEach(item => {
            if (!item || !item.id) return;
            const el = document.getElementById(item.id);
            if (!el) return;
            // remove both just in case, then add the ones that were saved
            el.classList.remove('show');
            el.classList.remove('border');

            if (Array.isArray(item.classes)) {
                item.classes.forEach(c => el.classList.add(c));
            }
        });
    }
    // 5) Reload map
    if (!mage.mapManager) {
        mage.mapManager = {};
    }
    if (!mage.mapManager.currentMapName) {
        mage.mapManager.currentMapName = "dorms";
    }
    loadMap(mage.mapManager.currentMapName);

    // 6) Resume dialogue from where left off 
    if (saveData.dialogue && typeof saveData.dialogue === "object") {
        try {
            // map fields to the in-memory dialogueManager (the one you showed earlier)
            if (typeof dialogueManager === "object") {
                dialogueManager.currentDialogue = saveData.dialogue.currentDialogue || saveData.dialogue.currentDialogueName || null;
                dialogueManager.currentLine = Number(saveData.dialogue.currentLine ?? saveData.dialogue.currentIndex ?? 0);
                dialogueManager.running = false; // don't auto-run until we call queueDialogue
            } else if (typeof dialogueState === "object") {
                dialogueState.currentDialogue = saveData.dialogue.currentDialogue || saveData.dialogue.currentDialogueName || null;
                dialogueState.currentIndex = Number(saveData.dialogue.currentIndex ?? saveData.dialogue.currentLine ?? 0);
                dialogueState.running = false;
            }

            // If a dialogue name exists, try to resume it by calling queueDialogue
            const nameToResume = (dialogueManager && dialogueManager.currentDialogue) ||
                (dialogueState && dialogueState.currentDialogue);

            const indexToResume = (dialogueManager && Number(dialogueManager.currentLine ?? 0)) ||
                (dialogueState && Number(dialogueState.currentIndex ?? 0)) || 0;

            if (nameToResume && typeof runDialogue === "function") {
                // small timeout to let the UI update first
                setTimeout(() => runDialogue(nameToResume, indexToResume), 50);
            }
        } catch (e) {
            console.warn("Could not resume dialogue from save:", e);
        }
    }

    //Update rune level text
    const runeLevelDisplay = document.getElementById('runeLevel');
    if (runeLevelDisplay) {
        runeLevelDisplay.textContent = `Rune Level: ${progress.runeLevel}`;
    }

    // Final: give a small notification
    console.log("Save imported successfully.");
};

document.getElementById('saveBtn').addEventListener('click', saveGame);
document.getElementById('exportBtn').addEventListener('click', exportGame);
document.getElementById('importBtn').addEventListener('click', importGame);
//---------------------------//
// Clickers                  //
//---------------------------//
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
    if (progress.orbUnlock === false && resource.knowledge.amount >= 10) {
        let orbUnlockRandom = getRandomInt(1, 30);
        if (orbUnlockRandom !== 1) {
            console.log('failed orb unlock check');
        }
        //If the random number is 1, unlock the orb
        if (orbUnlockRandom === 1) {
            progress.orbUnlock = true;
            runDialogue("unlockOrb", 0);
        }
    }
    //Rune unlocker
    if (progress.runeUnlock === false && resource.knowledge.amount >= 100 && resource.orb.amount > 0) {
        let runeChance = Math.max(1, 100 - Math.floor((resource.knowledge.amount - 100)));
        let runeUnlockRandom = getRandomInt(1, runeChance);
        if (runeUnlockRandom !== 1) {
            console.log('failed rune unlock check');
        }

        //If the random number is 1, unlock the rune
        if (runeUnlockRandom === 1) {
            progress.runeUnlock = true;
            runDialogue("unlockRune", 0);
        }
    }
}




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
    // Check various unlocks
    if (!progress.doorUnlock && resource.mana.amount >= 30) {
        progress.doorUnlock = true;
        console.log("Door unlocked!");
        queueDialogue("unlockDoor", 0);
    }
}


// Run generatorTick every second
setInterval(generatorTick, 1000);



//---------------------------//
// Tab Switchers             //
//---------------------------//

// Main tab switching (PC, Desk, Door)
const mainTabIds = ['pcMainCenter', 'deskMainCenter', 'doorMainCenter'];

function openMainTab(tabId) {
    mainTabIds.forEach(id => {
        const tab = document.getElementById(id);
        if (tab) {
            tab.classList.remove('show');
        }
    });
    const currentTab = document.getElementById(tabId);
    currentTab.classList.add('show');
}

document.getElementById('pcTabBtn').addEventListener('click', function (e) {
    e.preventDefault();
    openMainTab('pcMainCenter');
});
document.getElementById('deskTabBtn').addEventListener('click', function (e) {
    e.preventDefault();
    openMainTab('deskMainCenter');
});
document.getElementById('doorTabBtn').addEventListener('click', function (e) {
    e.preventDefault();
    openMainTab('doorMainCenter');
});

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

document.getElementById('researchTabBtn').addEventListener('click', function (e) {
    e.preventDefault();
    openSubTab('researchTab');
});
document.getElementById('shopTabBtn').addEventListener('click', function (e) {
    e.preventDefault();
    openSubTab('shopTab');
});


//Go outside
document.getElementById('leaveHouseBtn').addEventListener('click', function (e) {
    e.preventDefault();
    goOutside();

});

function goOutside() {
    document.getElementById('insideHouse').classList.remove('show');
    document.getElementById('worldMap').classList.add('show');
    if (!progress.goneOutside) {
        progress.goneOutside = true;
        queueDialogue("goOutside", 0);
    }
    hoverMapOld = document.getElementById('hoverBoxMap');
    if (!hoverMapOld.classList.contains('show')) {
        hoverMapOld.classList.add('show');
    }
}

function goInside() {
    document.getElementById('worldMap').classList.remove('show');
    document.getElementById('insideHouse').classList.add('show');
    hoverBuyOld = document.getElementById('hoverBoxBuy');
    if (!hoverBuyOld.classList.contains('show')) {
        hoverBuyOld.classList.add('show');
    }
}

//---------------------------//
// Dialogs                   //
//---------------------------//
let dialogues = {
    startGame: [
        { type: 'line', text: 'You sit at your desk, the white-ish light of your computer monitor illuminating your face.', time: 4000 },
        { type: 'line', text: 'You spent most of the day doing what can only be described as', time: 2000 },
        { type: 'line', text: 'Goofing Off.', time: 4000 },
        { type: 'line', text: 'However, most of your friends have gone to bed, and you are left with nothing to entertain yourself.', time: 4000 },
        { type: 'line', text: 'You suppose it is finally time to actually do something productive.', time: 4000 },
        { type: 'line', text: 'Magic isn\'t going to learn itself, after all.', time: 1000 },
        { type: 'function', fn: startGame }

    ],
    unlockRune: [
        { type: 'line', text: ' ', time: 0 },
        { type: 'line', text: 'You continue your research for a while.', time: 4000 },
        { type: 'line', text: 'It\'s difficult to find anything of real use, especially to a beginner such as yourself.', time: 4000 },
        { type: 'line', text: 'Pouring over wizard chatrooms leaves you with more questions than answers.', time: 4000 },
        { type: 'line', text: 'Such as', time: 2000 },
        { type: 'line', text: 'What the hell is a Power Word: Scrunch?', time: 4000 },
        { type: 'line', text: 'However, you do find some information.', time: 4000 },
        { type: 'line', text: 'Something that even you can manage:', time: 4000 },
        { type: 'line', text: 'Runes.', time: 4000 },
        { type: 'line', text: 'Apparently, all some wizards do is draw a couple squiggles on a piece of paper and call it a day.', time: 4000 },
        { type: 'line', text: 'You turn to the empty space on your desk and pull out a notebook and a pencil.', time: 1000 },
        { type: 'function', fn: unlockRune }
    ],
    unlockOrb: [
        { type: 'line', text: ' ', time: 0 },
        { type: 'line', text: 'After a few minutes of research, you feel like you\'ve learned something.', time: 4000 },
        { type: 'line', text: 'To use magic, you need mana. You do not currently have any mana.', time: 4000 },
        { type: 'line', text: 'Luckily, they sell mana orbs online nowadays.', time: 4000 },
        { type: 'line', text: 'You think that maybe you should buy one.', time: 1000 },
        { type: 'function', fn: unlockOrb }
    ],
    runeTwo: [
        { type: 'line', text: ' ', time: 0 },
        { type: 'line', text: 'The first couple runes you drew were pretty, uh,', time: 1000 },
        { type: 'line', text: 'Rough.', time: 4000 },
        { type: 'line', text: 'But now that you\'ve had some practice, you think you sort of understand what you\'re doing.', time: 4000 },
        { type: 'line', text: 'At the very least, it feels a little bit easier now.', time: 4000 },
        { type: 'function', fn: runeTwo }
    ],
    runeFive: [
        { type: 'line', text: ' ', time: 0 },
        { type: 'line', text: 'Now that you\'ve been drawing runes for a while, you\'re confident that your skills have improved', time: 4000 },
        { type: 'line', text: 'You\'re not quite sure if it\'s muscle memory or something else, but you\'re more confident in your earlier intuition:', time: 2000 },
        { type: 'line', text: 'They <i>are</i> getting easier to draw.', time: 1000 },
        { type: 'function', fn: runeFive }
    ],
    unlockDoor: [
        { type: 'line', text: ' ', time: 0 },
        { type: 'line', text: 'You\'ve been generating mana, but you feel like you don\'t have enough to do anything with.', time: 4000 },
        { type: 'line', text: 'On top of this, you lack the funds to get any more mana orbs.', time: 4000 },
        { type: 'line', text: 'Unfortunately, all of this world\'s funds exist outside of the safety of your room', time: 4000 },
        { type: 'line', text: 'You decide to venture out into the world to find some way to earn gold', time: 1000 },
        { type: 'function', fn: unlockDoor }
    ],
    goOutside: [
        { type: 'line', text: ' ', time: 0 },
        { type: 'line', text: 'You open your door, and are greeted with the not very fresh air of your college dorms.', time: 4000 },
        { type: 'line', text: 'It is time to', time: 1000 },
        { type: 'line', text: 'As they say', time: 1000 },
        { type: 'line', text: 'Make money.', time: 4000 },
        { type: 'line', text: 'You have no idea how you\'re going to get money from these goobers.', time: 4000 },
    ]
}

let dialogueManager = {
    currentDialogue: null,
    currentLine: 0,
    running: false
}

// Reveal main elements
function startGame() {
    console.log("Revealing main elements");
    document.getElementById('gameMainCenter').classList.add('show');
    document.getElementById('gameMainCenter').classList.add('border');
    document.getElementById('researchTab').classList.add('show');
}

// Orb unlock
function unlockOrb() {
    progress.orbUnlock = true;
    document.getElementById('researchTabBtn').classList.add('show');
    document.getElementById('shopSpace').classList.add('show');
    document.getElementById('shopTabBtn').classList.add('show');
    document.getElementById('goldDisplay').classList.add('show');
}

// Rune unlock
function unlockRune() {
    progress.runeUnlock = true;
    document.getElementById('deskSpace').classList.add('show');
    document.getElementById('deskTabBtn').classList.add('show');
    showMainSelector();
}

// Second Rune Level
function runeTwo() {
    progress.runeTwo = true;
}

// Fifth Rune Level
function runeFive() {
    progress.runeFive = true;
}

function unlockDoor() {
    progress.unlockDoor = true;
    document.getElementById('doorTabBtn').classList.add('show');
    document.getElementById('doorSpace').classList.add('show');
    showMainSelector();
}

function showMainSelector() {
    console.log("Checking to show main selector");
    if (!progress.mainSelector) {
        console.log("Showing main selector");
        document.getElementById('mainSelector').classList.add('show');
        document.getElementById('pcTabBtn').classList.add('show');
        document.getElementById('mainSelectorDiv').classList.add('show');
        progress.mainSelector = true;
    }
}

let dialogueQueue = [];
let dialogueActive = false;

function queueDialogue(dialogueName, index) {
    if (dialogueActive) {
        dialogueQueue.push({ name: dialogueName, index: index });
        return;
    }
    runDialogue(dialogueName, index);
}

async function runDialogue(dialogueName, index) {
    if (dialogueActive) {
        dialogueQueue.push({ name: dialogueName, index: index });
        return;
    }
    dialogueActive = true;
    let steps = dialogues[dialogueName];

    dialogueManager.currentDialogue = dialogueName;
    dialogueManager.currentLine = index || 0;
    dialogueManager.running = true;

    while (dialogueManager.running && dialogueManager.currentLine < steps.length) {
        let step = steps[dialogueManager.currentLine];

        if (step.type === "line") {
            sendToJournal(step.text);
            await sleep(step.time);
        } else if (step.type === "function") {
            step.fn();
        }

        dialogueManager.currentLine++;
        console.log(dialogueManager.currentLine);
    }

    // Cleanup
    dialogueManager.running = false;
    dialogueManager.currentDialogue = null;
    dialogueManager.currentLine = 0;
    dialogueActive = false;

    // Start next dialogue in queue if any
    if (dialogueQueue.length > 0) {
        const next = dialogueQueue.shift();
        runDialogue(next.name, next.index);
    }
}

//Log gradient
const diaryForGradient = document.getElementById("gameLog");
const diaryGradient = document.querySelector(".logGradient");

diaryForGradient.addEventListener("scroll", () => {
    if (diaryForGradient.scrollTop > 0) {
        diaryGradient.style.opacity = "1";
    } else {
        diaryGradient.style.opacity = "0";
    }
});

const logForGradient = document.getElementById("gameLog2");
const logGradient = document.querySelector(".logGradient2");

logForGradient.addEventListener("scroll", () => {
    if (logForGradient.scrollTop > 0) {
        logGradient.style.opacity = "1";
    } else {
        logGradient.style.opacity = "0";
    }
});



//---------------------------//
// Rune Minigame             //
//---------------------------//
const runeXPBenchmarks = [0, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000];


//Define rune line width and radius for accuracy check
const RUNE_LINE_WIDTH = 6;
const RUNE_CIRCLE_RADIUS = 12;


//All runes are stored as lines here
const runes = {
    thorn: {
        name: "thorn", // halfway between b and p
        lines: [
            { start: [75, 50], end: [75, 250] }, //vertical
            { start: [75, 115], end: [125, 150] }, //top triangle
            { start: [75, 185], end: [125, 150] } // bottom triangle
        ],
        midpoints: [[75, 50], [75, 250], [75, 115], [75, 185], [125, 150]],
        lineCount: 2
    },
    ur: {
        name: "ur",   //fucked up lowercase n
        lines: [
            { start: [70, 50], end: [70, 250] }, //vertical
            { start: [70, 50], end: [130, 250] } //diagonal
        ],
        midpoints: [[70, 50], [70, 250], [130, 250]],
        lineCount: 1
    },
    cen: {
        name: "cen",  // the spiky lowercase h
        lines: [
            { start: [70, 50], end: [70, 250] }, //vertical
            { start: [70, 190], end: [130, 250] } //diagonal down
        ],
        midpoints: [[70, 50], [70, 250], [70, 190], [130, 250]],
        lineCount: 2
    },
    gyfu: {
        name: "gyfu", // x
        lines: [
            { start: [70, 50], end: [130, 250] }, //top left to bottom right
            { start: [130, 50], end: [70, 250] }, //top right to bottom left
        ],
        midpoints: [[70, 50], [130, 250], [70, 250], [130, 50], [100, 150]],
        lineCount: 2
    },
    thorn: {
        name: "wyn", // looks like a p
        lines: [
            { start: [75, 50], end: [75, 250] }, //vertical
            { start: [75, 50], end: [125, 85] }, //top triangle
            { start: [75, 125], end: [125, 85] } // bottom triangle
        ],
        midpoints: [[75, 125], [75, 250], [75, 50], [125, 85]],
        lineCount: 1
    },
    // Add more runes here
};

//Pull a random rune
const runeKeys = Object.keys(runes);
const randomRune = runes[runeKeys[Math.floor(Math.random() * runeKeys.length)]];

function renderRune(ctx, rune) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.lineWidth = RUNE_LINE_WIDTH;
    ctx.strokeStyle = "#888";
    ctx.lineCap = "round"; // Make line tips rounded
    for (const seg of rune.lines) {
        ctx.beginPath();
        ctx.moveTo(seg.start[0], seg.start[1]);
        ctx.lineTo(seg.end[0], seg.end[1]);
        ctx.stroke();
    }
    // Draw invisible circles for logic (not rendered, but for hit detection)
    // You can store these for later use in grading
}

// Render endpoint outlines for debugging
function renderRuneEndpoints(ctx, rune) {
    if (!window.DEBUG_MODE.endpoints) return;
    if (!rune.midpoints) return;
    ctx.save();
    ctx.lineWidth = 2;
    // Collect all unique midpoints
    const uniqueMidpoints = [];
    const midpointKeySet = new Set();
    for (const pt of rune.midpoints) {
        const key = pt[0] + ',' + pt[1];
        if (!midpointKeySet.has(key)) {
            uniqueMidpoints.push(pt);
            midpointKeySet.add(key);
        }
    }
    // Draw midpoints in yellow
    ctx.strokeStyle = 'yellow';
    for (const pt of uniqueMidpoints) {
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], RUNE_CIRCLE_RADIUS, 0, 2 * Math.PI);
        ctx.stroke();
    }
    ctx.restore();
};

// Render a rune as soon as the Rune tab appears
window.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('runeCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        renderRune(ctx, randomRune);
        renderRuneEndpoints(ctx, randomRune);
        enableRuneDrawing(canvas, ctx, randomRune);
    }
});

// Drawing logic
function enableRuneDrawing(canvas, ctx, rune) {
    let drawing = false;
    let start = null;
    let currentLine = [];
    let drawnLines = [];
    const maxLines = rune.lineCount;

    function onMouseDown(e) {
        if (drawnLines.length >= maxLines) return;
        drawing = true;
        const rect = canvas.getBoundingClientRect();
        start = [e.clientX - rect.left, e.clientY - rect.top];
        currentLine = [start];
    }

    function onMouseMove(e) {
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        const point = [e.clientX - rect.left, e.clientY - rect.top];
        currentLine.push(point);
        // Draw the current segment as you go
        ctx.save();
        ctx.strokeStyle = '#44f';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        const [sx, sy] = currentLine[currentLine.length - 2];
        ctx.moveTo(sx, sy);
        ctx.lineTo(point[0], point[1]);
        ctx.stroke();
        ctx.restore();
    }

    function onMouseUp(e) {
        if (!drawing) return;
        drawing = false;
        drawnLines.push(currentLine);
        if (drawnLines.length >= maxLines) {
            // Remove listeners and call gradeRune
            canvas.removeEventListener('mousedown', onMouseDown);
            canvas.removeEventListener('mousemove', onMouseMove);
            canvas.removeEventListener('mouseup', onMouseUp);
            gradeRune(drawnLines, rune);
        }
    }

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
}

function gradeRune(drawnLines, rune) {
    // Helper: distance between two points
    function dist(a, b) {
        return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
    }
    const TOLERANCE = 12; // px, adjust as needed

    let grade = "ok"; // default, will be set to "garbage" if any check fails

    // Collect all user-drawn points from all lines
    let allDrawnPoints = [];
    for (const line of drawnLines) {
        allDrawnPoints = allDrawnPoints.concat(line);
    }

    // Check if all midpoints are visited by any drawn point
    let allMidpointsHit = rune.midpoints.every(mp =>
        allDrawnPoints.some(pt => dist(pt, mp) < TOLERANCE)
    );

    if (!allMidpointsHit) {
        grade = "garbage";
        console.log("Midpoints not hit correctly");
    }

    if (grade === "garbage") {
        console.log("Rune drawn incorrectly or pairing error");
        sendToLog(`You drew a garbage rune. It didn't feel like you were drawing the right shape at all.`);
        progress.runeXP += 1;
    }

    //Step 2: Accuracy check
    if (grade !== "garbage") {
        // Collect all user-drawn points
        let userPoints = [];
        for (const line of drawnLines) {
            userPoints = userPoints.concat(line);
        }

        // For each user point, check if it is close to any segment of the rune
        let onRuneCount = 0;
        let totalCount = userPoints.length;
        let TOLERANCE = progress.runeLevel; // px, even tighter for accuracy

        // Flatten rune segments for easier checking
        let runeSegments = [];
        for (const seg of rune.lines) {
            runeSegments.push({ start: seg.start, end: seg.end });
        }

        // Helper: distance from point to segment
        function pointToSegmentDist(pt, seg) {
            const [x, y] = pt;
            const [x1, y1] = seg.start;
            const [x2, y2] = seg.end;
            const dx = x2 - x1;
            const dy = y2 - y1;
            if (dx === 0 && dy === 0) {
                // Start and end are the same
                return Math.sqrt((x - x1) ** 2 + (y - y1) ** 2);
            }
            // Project point onto the segment
            const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
            const projX = x1 + t * dx;
            const projY = y1 + t * dy;
            return Math.sqrt((x - projX) ** 2 + (y - projY) ** 2);
        }

        for (const pt of userPoints) {
            let close = false;
            for (const seg of runeSegments) {
                if (pointToSegmentDist(pt, seg) <= TOLERANCE) {
                    close = true;
                    break;
                }
            }
            if (close) onRuneCount++;
        }

        let percentOnRune = totalCount > 0 ? (onRuneCount / totalCount) : 0;
        // Assign grade based on percentage
        if (percentOnRune >= 0.99) {
            grade = "perfect";
            progress.runeXP += 100;
        } else if (percentOnRune >= 0.8) {
            grade = "good";
            progress.runeXP += 50;
        } else if (percentOnRune >= 0.5) {
            grade = "ok";
            progress.runeXP += 25;
        } else {
            grade = "garbage";
            progress.runeXP += 10;
        }
        console.log(`Accuracy: ${(percentOnRune * 100).toFixed(1)}% | Grade: ${grade}`);
        sendToLog(`You drew a ${grade} rune with ${(percentOnRune * 100).toFixed(1)}% accuracy.`);
    }

    //Step 3: Return rune of whatever grade
    if (grade === "garbage") {
        resource.garbageRune.amount += 1;
        console.log("Rune graded as garbage");
        const garbageRuneAmount = document.getElementById(resource.garbageRune.displayId);
        if (garbageRuneAmount) {
            garbageRuneAmount.textContent = resource.garbageRune.amount;
        }
    }
    if (grade === "ok") {
        resource.okRune.amount += 1;
        console.log("Rune graded as ok");
        const okRuneAmount = document.getElementById(resource.okRune.displayId);
        if (okRuneAmount) {
            okRuneAmount.textContent = resource.okRune.amount;
        }
    }
    if (grade === "good") {
        resource.goodRune.amount += 1;
        console.log("Rune graded as good");
        const goodRuneAmount = document.getElementById(resource.goodRune.displayId);
        if (goodRuneAmount) {
            goodRuneAmount.textContent = resource.goodRune.amount;
        }
    }
    if (grade === "perfect") {
        resource.perfectRune.amount += 1;
        console.log("Rune graded as perfect");
        const perfectRuneAmount = document.getElementById(resource.perfectRune.displayId);
        if (perfectRuneAmount) {
            perfectRuneAmount.textContent = resource.perfectRune.amount;
        }
    }

    // After grading, check if rune resources are visible; if not, show them
    if (!resource.garbageRune.visible || !resource.okRune.visible || !resource.goodRune.visible || !resource.perfectRune.visible) {
        console.log("Showing rune resources");
        const runeDiv = document.getElementById('runeDiv');
        if (runeDiv) runeDiv.classList.add('show');
        const garbageRuneDisplay = document.getElementById('garbageRuneDisplay');
        if (garbageRuneDisplay) garbageRuneDisplay.classList.add('show');
        const okRuneDisplay = document.getElementById('okRuneDisplay');
        if (okRuneDisplay) okRuneDisplay.classList.add('show');
        const goodRuneDisplay = document.getElementById('goodRuneDisplay');
        if (goodRuneDisplay) goodRuneDisplay.classList.add('show');
        const perfectRuneDisplay = document.getElementById('perfectRuneDisplay');
        if (perfectRuneDisplay) perfectRuneDisplay.classList.add('show');
        resource.garbageRune.visible = true;
        resource.okRune.visible = true;
        resource.goodRune.visible = true;
        resource.perfectRune.visible = true;
    }
    //Change desk dialogue at 100 total runes
    if (!progress.deskRunes && (resource.garbageRune.amount + resource.okRune.amount + resource.goodRune.amount + resource.perfectRune.amount) >= 100) {
        maps.dorms.keyData["D"].hoverText = "Has seen a some use lately. A stack of paper sits neatly on one side, while a heap of runes you have drawn is scattered across the other."
        progress.deskRunes = true;
    }

    // Step 4: Update rune level and display
    console.log(`Rune XP now at ${progress.runeXP}`);
    while (progress.runeLevel < runeXPBenchmarks.length && progress.runeXP >= runeXPBenchmarks[progress.runeLevel]) {
        progress.runeLevel++;
        console.log("Leveled up! Rune Level is now:", progress.runeLevel);
    }
    //update display
    const runeLevelDisplay = document.getElementById('runeLevel');
    if (runeLevelDisplay) {
        runeLevelDisplay.textContent = `Rune Level: ${progress.runeLevel}`;
    }

    // Step 4.5: run rune level dialogues
    if (progress.runeLevel === 2 && !progress.runeTwo) {
        queueDialogue("runeTwo", 0)
        progress.runeTwo = true;
    }
    if (progress.runeLevel === 5 && !progress.runeFive) {
        queueDialogue("runeFive", 0)
        progress.runeFive = true;
    }

    // Step 5: Clear canvas, pick a new random rune, render, and re-enable drawing
    const canvas = document.getElementById('runeCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        // Pick a new random rune
        const runeKeys = Object.keys(runes);
        const newRandomRune = runes[runeKeys[Math.floor(Math.random() * runeKeys.length)]];
        // Clear and render new rune
        renderRune(ctx, newRandomRune);
        renderRuneEndpoints(ctx, newRandomRune);
        enableRuneDrawing(canvas, ctx, newRandomRune);
    }
}

//---------------------------//
// Debug                     //
//---------------------------//

//Show debug window if debug is true
if (debug) {
    const debugWindow = document.getElementById('debugWindow');
    debugWindow.classList.add('show');
    const debugBox = document.getElementById('debugHoverBox');
    if (debugBox) { debugBox.classList.add('show'); }
}

//Debug variables
window.DEBUG_MODE = {
    fastmode: false,
    dummies: false,
    endpoints: false
};

// Make debug window draggable
const debugWindow = document.getElementById('debugWindow');
const debugHeader = debugWindow.querySelector('.debugHeader');
let offsetX = 0, offsetY = 0, isDragging = false;
debugHeader.addEventListener('mousedown', function (e) {
    isDragging = true;
    // Calculate offset
    const rect = debugWindow.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    document.body.style.userSelect = 'none'; // Prevent text selection
});
document.addEventListener('mousemove', function (e) {
    if (isDragging) {
        debugWindow.style.position = 'fixed';
        debugWindow.style.left = (e.clientX - offsetX) + 'px';
        debugWindow.style.top = (e.clientY - offsetY) + 'px';
    }
});
document.addEventListener('mouseup', function () {
    isDragging = false;
    document.body.style.userSelect = '';
});

// Debug window button event listeners
const fastmodeBtn = document.getElementById('fastmodeBtn');
const dummyResourcesBtn = document.getElementById('dummyResourcesBtn');
const skipToRunesBtn = document.getElementById('skipToRunesBtn');


//fastmode button
if (fastmodeBtn) {
    fastmodeBtn.addEventListener('click', function () {
        DEBUG_MODE.fastmode = !DEBUG_MODE.fastmode;
        fastmodeBtn.textContent = DEBUG_MODE.fastmode ? 'Fastmode: ON' : 'Fastmode: OFF';
    });
    // Set initial label
    fastmodeBtn.textContent = DEBUG_MODE.fastmode ? 'Fastmode: ON' : 'Fastmode: OFF';
}


if (dummyResourcesBtn) {
    dummyResourcesBtn.addEventListener('click', function () {
        DEBUG_MODE.dummies = !DEBUG_MODE.dummies;
        dummyResourcesBtn.textContent = DEBUG_MODE.dummies ? 'Dummy Resources: ON' : 'Dummy Resources: OFF';
        // Show/hide dummy resources immediately
        const dummyDisplay = document.getElementById('dummyDisplay');
        const dummyGenDisplay = document.getElementById('dummyGenDisplay');
        if (DEBUG_MODE.dummies) {
            if (dummyDisplay) dummyDisplay.classList.add('show');
            if (dummyGenDisplay) dummyGenDisplay.classList.add('show');
        } else {
            if (dummyDisplay) dummyDisplay.classList.remove('show');
            if (dummyGenDisplay) dummyGenDisplay.classList.remove('show');
        }
    });
    // Set initial label
    dummyResourcesBtn.textContent = DEBUG_MODE.dummies ? 'Dummy Resources: ON' : 'Dummy Resources: OFF';
}
if (skipToRunesBtn) {
    skipToRunesBtn.addEventListener('click', function () {
        skipToRunes();
    });
}

//rune endpoints button
if (renderEndpointsBtn) {
    renderEndpointsBtn.addEventListener('click', function () {
        window.DEBUG_MODE.endpoints = !window.DEBUG_MODE.endpoints;
        renderEndpointsBtn.textContent = window.DEBUG_MODE.endpoints ? 'Render Rune Endpoints: ON' : 'Render Rune Endpoints: OFF';
        const canvas = document.getElementById('runeCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            renderRune(ctx, randomRune);
            if (window.DEBUG_MODE.endpoints) {
                renderRuneEndpoints(ctx, randomRune);
            }
        }
    });
    // Set initial label
    renderEndpointsBtn.textContent = window.DEBUG_MODE.endpoints ? 'Render Rune Endpoints: ON' : 'Render Rune Endpoints: OFF';
}

// Skip to Runes function
function skipToRunes() {
    // Unlock orb if not already unlocked
    if (!progress.orbUnlock) {
        progress.orbUnlock = true;
        unlockOrb();
    }
    // Unlock rune if not already unlocked
    if (!progress.runeUnlock) {
        progress.runeUnlock = true;
        unlockRune();
    }
    // Set knowledge to 101
    resource.knowledge.amount = 101;
    const knowledgeAmount = document.getElementById(resource.knowledge.displayId);
    if (knowledgeAmount) {
        knowledgeAmount.innerHTML = resource.knowledge.amount;
    }
    // Set orbs to 1
    resource.orb.amount = 1;
    const orbAmount = document.getElementById(resource.orb.displayId);
    if (orbAmount) {
        orbAmount.innerHTML = resource.orb.amount;
    }
    // Show orb display if not visible
    if (!resource.orb.visible) {
        const orbDisplay = document.getElementById('orbDisplay');
        if (orbDisplay) {
            orbDisplay.classList.add('show');
            resource.orb.visible = true;
        }
        const orbDiv = document.getElementById('orbDiv');
        if (orbDiv) {
            orbDiv.classList.add('show');
        }
    }
    // Show knowledge display if not visible
    if (!resource.knowledge.visible) {
        const knowledgeDisplay = document.getElementById('knowledgeDisplay');
        if (knowledgeDisplay) {
            knowledgeDisplay.classList.add('show');
            resource.knowledge.visible = true;
        }
    }
}


//Show dummy resources
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

queueDialogue("startGame", 0);