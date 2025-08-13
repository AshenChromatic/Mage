const Debug = false;

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

// Main tab switching (PC, Desk, Door)
const mainTabIds = ['pcMainCenter', 'deskMainCenter', 'doorMainCenter'];

function openMainTab(tabId) {
    mainTabIds.forEach(id => {
        const tab = document.getElementById(id);
        if (tab) {
            tab.classList.remove('show');
            tab.classList.remove('revealed');
        }
    });
    const currentTab = document.getElementById(tabId);
    if (currentTab) {
        // If this is the first time showing, fade in
        if (!currentTab.dataset.revealed) {
            currentTab.classList.add('revealed');
            currentTab.dataset.revealed = 'true';
            setTimeout(() => {
                currentTab.classList.remove('revealed');
                currentTab.classList.add('show');
            }, 1000); // match fade duration
        } else {
            currentTab.classList.add('show');
        }
    }
}

document.getElementById('pcTabBtn').addEventListener('click', function(e) {
    e.preventDefault();
    openMainTab('pcMainCenter');
});
document.getElementById('deskTabBtn').addEventListener('click', function(e) {
    e.preventDefault();
    openMainTab('deskMainCenter');
});
document.getElementById('doorTabBtn').addEventListener('click', function(e) {
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
    sendToLog('Something that even you can manage:');
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
// Rune Minigame             //
//---------------------------//
let runeLevel = 1

//Define rune line width and radius for accuracy check
const RUNE_LINE_WIDTH = 6;
const RUNE_CIRCLE_RADIUS = 12;


//All runes are stored as lines here
const runes = {
    thorn: {
        name: "thorn",
        lines: [
            { start: [75, 50], end: [75, 250] },
            { start: [75, 115], end: [125, 150] },
            { start: [75, 185], end: [125, 150] }
        ],
        drawLines: [
            {
            endpoints: [[75, 50], [75, 250]],
            midpoints: [[75, 115], [75, 185]]
            },
            {
            endpoints: [[75, 115], [75, 185]],
            midpoints: [[125, 150]]
            }
        ]
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
    if (!rune.drawLines) return;
    ctx.save();
    ctx.lineWidth = 2;
    // Collect all unique endpoints
    const uniqueEndpoints = [];
    const endpointKeySet = new Set();
    const uniqueMidpoints = [];
    const midpointKeySet = new Set();
    for (const line of rune.drawLines) {
        for (const pt of line.endpoints) {
            const key = pt[0] + ',' + pt[1];
            if (!endpointKeySet.has(key)) {
                uniqueEndpoints.push(pt);
                endpointKeySet.add(key);
            }
        }
        for (const pt of line.midpoints) {
            const key = pt[0] + ',' + pt[1];
            if (!midpointKeySet.has(key)) {
                uniqueMidpoints.push(pt);
                midpointKeySet.add(key);
            }
        }
    }
    // Draw endpoints in yellow
    ctx.strokeStyle = 'yellow';
    for (const pt of uniqueEndpoints) {
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], RUNE_CIRCLE_RADIUS, 0, 2 * Math.PI);
        ctx.stroke();
    }
    // Draw midpoints in orange
    ctx.strokeStyle = 'orange';
    for (const pt of uniqueMidpoints) {
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], RUNE_CIRCLE_RADIUS, 0, 2 * Math.PI);
        ctx.stroke();
    }
    ctx.restore();
}

// Render a rune as soon as the Rune tab appears
window.addEventListener('DOMContentLoaded', function() {
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
    const maxLines = rune.drawLines ? rune.drawLines.length : 0;

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
        return Math.sqrt((a[0] - b[0])**2 + (a[1] - b[1])**2);
    }
    const TOLERANCE = 12; // px, adjust as needed

    // Clone drawLines so we can remove matched lines
    let remainingDrawLines = rune.drawLines.map(function(line) {
        return {
            endpoints: [...line.endpoints],
            midpoints: [...line.midpoints]
        };
    });

    let grade = "ok"; // default, will be set to "garbage" if any check fails

    for (const drawn of drawnLines) {
        if (remainingDrawLines.length === 0) break;

        // Try to match this drawn line to a drawLine
        let matchedIndex = -1;
        let matchedLine = null;
        let drawnStart = drawn[0];
        let drawnEnd = drawn[drawn.length - 1];

        for (let i = 0; i < remainingDrawLines.length; i++) {
            const line = remainingDrawLines[i];
            // Check if drawn line starts/ends at either endpoint (within tolerance)
            if (
                (dist(drawnStart, line.endpoints[0]) < TOLERANCE && dist(drawnEnd, line.endpoints[1]) < TOLERANCE) ||
                (dist(drawnStart, line.endpoints[1]) < TOLERANCE && dist(drawnEnd, line.endpoints[0]) < TOLERANCE)
            ) {
                matchedIndex = i;
                matchedLine = line;
                break;
            }
        }

        if (!matchedLine) {
            grade = "garbage";
            console.log("No matching line found for drawn segment");
            break;
        }

        // Check if all midpoints are visited
        let allMidpointsHit = matchedLine.midpoints.every(mp =>
            drawn.some(pt => dist(pt, mp) < TOLERANCE)
        );
        if (!allMidpointsHit) {
            grade = "garbage";
            console.log("Midpoints not hit correctly");
            break;
        }

        // Remove matched line so it can't be matched again
        remainingDrawLines.splice(matchedIndex, 1);
    }

    if (grade === "garbage" || remainingDrawLines.length > 0) {
        grade = "garbage";
        console.log("Rune drawn incorrectly or pairing error");
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
    let TOLERANCE = runeLevel; // px, even tighter for accuracy

        // Flatten rune segments for easier checking
        let runeSegments = [];
        for (const seg of rune.lines) {
            runeSegments.push({start: seg.start, end: seg.end});
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
        } else if (percentOnRune >= 0.8) {
            grade = "good";
        } else if (percentOnRune >= 0.5) {
            grade = "ok";
        } else {
            grade = "garbage";
        }
        console.log(`Accuracy: ${(percentOnRune*100).toFixed(1)}% | Grade: ${grade}`);
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

    // Step 4: Clear canvas, pick a new random rune, render, and re-enable drawing
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
if (Debug) {
    const debugWindow = document.getElementById('debugWindow');
    debugWindow.classList.add('show');
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
debugHeader.addEventListener('mousedown', function(e) {
    isDragging = true;
    // Calculate offset
    const rect = debugWindow.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    document.body.style.userSelect = 'none'; // Prevent text selection
});
document.addEventListener('mousemove', function(e) {
    if (isDragging) {
        debugWindow.style.position = 'fixed';
        debugWindow.style.left = (e.clientX - offsetX) + 'px';
        debugWindow.style.top = (e.clientY - offsetY) + 'px';
    }
});
document.addEventListener('mouseup', function() {
    isDragging = false;
    document.body.style.userSelect = '';
});

// Debug window button event listeners
const fastmodeBtn = document.getElementById('fastmodeBtn');
const dummyResourcesBtn = document.getElementById('dummyResourcesBtn');
const skipToRunesBtn = document.getElementById('skipToRunesBtn');


//fastmode button
if (fastmodeBtn) {
    fastmodeBtn.addEventListener('click', function() {
        DEBUG_MODE.fastmode = !DEBUG_MODE.fastmode;
        fastmodeBtn.textContent = DEBUG_MODE.fastmode ? 'Fastmode: ON' : 'Fastmode: OFF';
    });
    // Set initial label
    fastmodeBtn.textContent = DEBUG_MODE.fastmode ? 'Fastmode: ON' : 'Fastmode: OFF';
}


if (dummyResourcesBtn) {
    dummyResourcesBtn.addEventListener('click', function() {
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
    skipToRunesBtn.addEventListener('click', function() {
        skipToRunes();
    });
}

//rune endpoints button
if (renderEndpointsBtn) {
    renderEndpointsBtn.addEventListener('click', function() {
        window.DEBUG_MODE.endpoints = !window.DEBUG_MODE.endpoints;
        renderEndpointsBtn.textContent = window.DEBUG_MODE.endpoints ? 'Render Rune Endpoints: ON' : 'Render Rune Endpoints: OFF';
        const canvas = document.getElementById('runeCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            renderRune(ctx, randomRune); // or your current rune variable
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
    if (!orbUnlock) {
        orbUnlock = true;
        unlockOrb();
    }
    // Unlock rune if not already unlocked
    if (!runeUnlock) {
        runeUnlock = true;
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
    // Fade in PC tab on first load
    const pcMain = document.getElementById('pcMainCenter');
    pcMain.classList.add('revealed');
    pcMain.dataset.revealed = 'true';
    setTimeout(() => {
        pcMain.classList.remove('revealed');
        pcMain.classList.add('show');
    }, 1000);

}
startGame();