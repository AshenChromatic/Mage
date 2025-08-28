hoverBox2 = document.getElementById('hoverBox2');
maps = mage.maps;

mage.mapManager = {};
if (!mage.mapManager.currentMap) {
    mage.mapManager.currentMap = {};
}
if (!mage.mapManager.currentMapName) {
    mage.mapManager.currentMapName = "dorms";
}
let currentMap = mage.mapManager.currentMap;
let currentMapName = mage.mapManager.currentMapName;
function resolveGlobal(path) {
    return path.split('.').reduce(function (obj, prop) {
        return obj && obj[prop];
    }, window);
}

// Load Map from window.mage.maps
function loadMap(mapName) {
    if (!window.mage.maps || !window.mage.maps[mapName]) {
        console.error(`Map '${mapName}' not found in window.mage.maps.`);
        return;
    }
    currentMap = window.mage.maps[mapName];
    currentMapName = mapName;
    console.log(`Loaded ${mapName}:`, currentMap);
    fillMap(currentMap);
}

// Render the map as soon as the Map tab appears
window.addEventListener('DOMContentLoaded', function () {
    const mapDisplay = document.getElementById('worldMap');
    if (mapDisplay) {
        console.log("Map Display On Screen");
        loadMap(currentMapName);
    }
});

//---------------------------//
// Dialogue Management       //
//---------------------------//
mage.mapManager.dialogue = {
    gribbletharp: {
        comeHereOften: true
    }
}
let mapDialogue = mage.mapManager.dialogue;

// helper: resolve a handler function for a node
function resolveHandler(node) {
    if (typeof node._handler === "function") return node._handler;

    var name = node.dataset && node.dataset.handler;
    if (!name) return null;

    // try global function by name
    if (typeof window[name] === "function") return window[name];

    // try a user-supplied handlers map if present
    if (typeof window.handlers === "object" && typeof window.handlers[name] === "function") {
        return window.handlers[name];
    }

    return null;
}

function dialogueHelper(node, sourceType) {
    let handlerName = node.dataset.handler || null;

    // 1. Clean up active clickable text / choices
    if (node.dataset.choice === "true" || sourceType === "choice") {
        clearActives("text", handlerName, true);
    } else {
        clearActives("text", handlerName);
    }

    // 2. Run the dialogue-specific function (resolve if needed)
    let fn = resolveHandler(node);
    if (typeof fn === "function") {
        try {
            fn.call(node);
        } catch (err) {
            console.error("Handler threw:", err);
        }
    } else {
        console.warn("No handler function assigned or resolvable for node:", node);
    }
}

function attachDialogueHandlers(sourceType) {
    var logContainer = document.getElementById("gameLog2");
    if (!logContainer) return;

    // Only attach one delegated listener
    if (!logContainer._dialogueDelegationAttached) {
        logContainer.addEventListener("click", function (evt) {
            evt.preventDefault();

            var node = evt.target.closest && evt.target.closest("[data-handler]");
            if (!node) return;

            // Defensive: only proceed if still in DOM
            if (!document.body.contains(node)) {
                console.log("Clicked element is no longer in the DOM.");
                return;
            }

            // Must have a resolvable handler
            var fn = resolveHandler(node);
            if (typeof fn !== "function") {
                console.log("Clicked element has no valid handler, ignoring.", node);
                return;
            }

            dialogueHelper(node, sourceType);
        });

        logContainer._dialogueDelegationAttached = true;
    }

    // Still do the one-time processing of nodes (wrap non-choice text into anchors,
    // mark them clickable). This avoids per-node listeners while preserving formatting.
    var nodes = logContainer.querySelectorAll("[data-handler]");
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];

        // skip nodes already processed
        if (node._processedForDialog) continue;

        if (node.dataset.choice !== "true") {
            var text = node.textContent;
            node.innerHTML = "<a href='#' class='dialogue link'>" + text + "</a>";
        }

        // mark as clickable so clearActives can find them
        node.setAttribute("data-clickable", "true");
        node._processedForDialog = true;
    }
}


function clearActives(source, handlerName, isChoice) {
    var actives = document.querySelectorAll('[data-clickable="true"]');
    console.log(
        "clearActives called with source:", source,
        "handlerName:", handlerName,
        "actives found:", actives.length
    );

    for (var i = 0; i < actives.length; i++) {
        var el = actives[i];
        var isChoice = el.dataset.choice === "true";
        var elHandler = el.dataset.handler;

        if (source === "map" || source === "worldmap") {
            // Always remove choices when coming from the map
            if (isChoice) {
                console.log("[map] Removing choice element:", el);
                el.remove();
                // Continue to next element
                continue;
            } else {
                console.log("[map] Delinking dialogue text:", el);
                delink(el, "map");
                el.removeAttribute("data-clickable");
                el.removeAttribute("data-choice");
                el.removeAttribute("data-handler");
            }
            continue;
        }

        if (source === "text") {
            if (!isChoice) {
                // Normal text: just delink and strip data
                console.log("[text] Delinking dialogue text:", el);
                if (elHandler !== handlerName) {
                    delink(el, "text");
                }
                if (elHandler === handlerName) {
                    delink(el, "text", true);
                }
                el.removeAttribute("data-clickable");
                el.removeAttribute("data-choice");
                el.removeAttribute("data-handler");
            } else {
                // Handle choices
                if (isChoice != true) {
                    console.log("[text] Removing choice (no handlerName):", el);
                    el.remove();
                } else if (elHandler !== handlerName) {
                    console.log("[text] Removing unselected choice:", el, "elHandler:", elHandler, "handlerName:", handlerName);
                    el.remove();
                } else {
                    console.log("[text] Delinking selected choice:", el);
                    delink(el, "choice", true);
                    el.removeAttribute("data-clickable");
                    el.removeAttribute("data-choice");
                    el.removeAttribute("data-handler");
                }
            }
        }
    }
}


function delink(el, type, clicked) {
    console.log("delink:" + el + " " + type);
    const link = el.querySelector("a");
    if (!link) return;

    const span = document.createElement("span");
    span.textContent = link.textContent;
    if (clicked && clicked === true) {
        span.style.color = "#373737";     // change color
        span.style.fontWeight = "bold"; // make bold
    }
    el.innerHTML = "";
    el.appendChild(span);
}


//---------------------------//
// Map Box                   //
//---------------------------//
const mapBox = document.getElementById("mapBox");

//Shady Shop
const shadyShop = document.createElement("div");
const shadyName = document.createElement("div");
shadyName.textContent = 'Shady Shop';
shadyName.style.color = "#453f4a";
shadyShop.classList.add('mapShop');
shadyShop.appendChild(shadyName);
const shadyLine = document.createElement("hr");
shadyLine.classList.add('hoverBuyDiv');
shadyShop.appendChild(shadyLine);
const shadyBuy1 = document.createElement("button");
shadyBuy1.textContent = 'Buy Ink';
shadyBuy1.classList.add('shopBuyBtn');
shadyBuy1.dataset.item = 'shadyInk';
shadyShop.appendChild(shadyBuy1);
const shadyBuy2 = document.createElement("button");
shadyBuy2.textContent = 'The Frog';
shadyBuy2.classList.add('shopBuyBtn');
shadyBuy2.dataset.item = 'shadyFrog';
shadyShop.appendChild(shadyBuy2);
shadyBuy1.addEventListener("click", function () {
    buyInk();
})
shadyBuy2.addEventListener("click", function () {
    buyFrog();
});

//---------------------------//
// 1 Billion Functions       //
//---------------------------//
function replaceCharAt(str, index, replacement) {
    return str.substring(0, index) + replacement + str.substring(index + 1);
}
function clickPlayer() {
    console.log("Clicked Player");
}

function doorHome(position) {
    console.log("Clicked Home Door");
    doorUp(position);
    document.getElementById('hoverBox2').classList.remove('show');
    goInside();
}

//Friendly Classmate
function clickFriendlyClassmate(position) {
    console.log("Clicked Friendly Classmate");
    sendPlayerRight(position);
    sendClickLog(maps.dorms.keyData["1"].name + ": Hey man. You [click:friendlyClassmate1]need something[/click]?", "#399500");
}

function friendlyClassmate1() {
    console.log("Clicked Friendly Classmate 1");
    choiceToLog("Who are you?", friendlyClassmate2A);
    choiceToLog("How do I get money?", friendlyClassmate2B);
    if (mapDialogue.gribbletharp.comeHereOften === true) {
        choiceToLog("Come here often?", friendlyClassmate2C);
    }
}

function friendlyClassmate2A() {
    console.log("Clicked Friendly Classmate 2A");
    sendToLog("<span style='color: #399500;'>" + maps.dorms.keyData["1"].name + ": You don't remember me, dude? It's me, Gribbletharp, I live RIGHT next door, hello?</span>");
    sendToLog("You think that name sucks.");
    maps.dorms.keyData["1"].name = "Gribbletharp";
    mage.maps.dorms.keyData["1"].name = "Gribbletharp";
    mage.maps.dorms.keyData["1"].hoverTitle = "Gribbletharp";
    maps.dorms.keyData["1"].hoverTitle = "Gribbletharp";
}

function friendlyClassmate2B() {
    console.log("Clicked Friendly Classmate 2B");
    sendToLog("<span style='color: #399500;'>" + maps.dorms.keyData["1"].name + ": Uh, you get a job??? I'm not giving you any money, freak.</span>");
    sendToLog("What a foolish idea. " + maps.dorms.keyData["1"].name + " must be some type of moron.");
}

function friendlyClassmate2C() {
    console.log("Clicked Friendly Classmate 2C");
    sendToLog("<span style='color: #399500;'>" + maps.dorms.keyData["1"].name + ": ...yes? I live here, idiot.</span>");
    choiceToLog("Woah, what a coincidence, I also live here! We should kiss...", friendlyClassmate3A);
    choiceToLog("That can't be true. I've never seen you before.", friendlyClassmate3B);
    choiceToLog("*leave*", friendlyClassmate3C);
}

function friendlyClassmate3A() {
    mage.slut += 1;
    sendToLog("<span style='color: #399500;'>" + maps.dorms.keyData["1"].name + ": ???</span>");
    sendToLog("He gives you a weird look. Thankfully, nobody else was watching. You decide to walk away and never speak of this again.");
    mapDialogue.gribbletharp.comeHereOften = false;
}

function friendlyClassmate3B() {
    sendToLog("<span style='color: #399500;'>" + maps.dorms.keyData["1"].name + ": Oh really? The shut-in mage hasn't seen me around? I'm truly baffled.</span>");
    sendToLog("You appear to lack a counterargument to this.");
}

function friendlyClassmate3C() {
    sendToLog("You decide you do not care about this man's existence.")
    mapDialogue.gribbletharp.comeHereOften = false;
}

//shadyClassmate
function clickShadyClassmate(position) {
    sendPlayerLeft(position);
    sendToLog("You approach the individual tucked away in the corner. Despite the sunglasses on his face, you can tell he's watching you as you walk up to him.");
    choiceToLog("Why are you skulking around?", shadyClassmateA);
    choiceToLog("?", shadyClassmateB);
    choiceToLog("Where can I get shades like that?", shadyClassmateC);
}

function shadyClassmateA() {
    sendToLog("He glances around for a moment, then cautiously opens up his trenchcoat.");
    sendToLog("From within, he slowly pulls out a toad. It is very warty, and you do not like looking at it.");
    sendClickLog(maps.dorms.keyData["4"].name + ": I beg of you. Buy my [click:shadyClassmateA1]toad[/click]", "#453f4a");
}

function shadyClassmateA1() {
    sendToLog("He looks at you with pleading eyes.");
    sendClickLog(maps.dorms.keyData["4"].name + ": Please, I need this.", "#453f4a");
    sendToLog("You are not touching that toad.");
    sendToLog("He looks disappointed, and solemnly places the toad back in his trenchcoat.");
    sendClickLog(maps.dorms.keyData["4"].name + ": Well, perhaps I can interest you in [click:shadyClassmateA1_1]something else[/click]...", "#453f4a");
}
function shadyClassmateA1_1() {
    mapBox.classList.add("show");
    mapBox.appendChild(shadyShop);
}

function shadyClassmateB() {
}

function shadyClassmateC() {
}



//Doors
function checkLock(position) {

}


function doorUp(position) {
    console.log("Clicked Up Door");
    let doorMessage = getRandomInt(1, 2);
    if (doorMessage === 1) {
        sendToLog("Not your room, asshole.");
    } else if (doorMessage === 2) {
        sendToLog("It's locked.");
    }
    killPlayer();
    sendPlayerDown(position);
}

function doorDown(position) {
    console.log("Clicked Down Door");
    let doorMessage = getRandomInt(1, 2);
    if (doorMessage === 1) {
        sendToLog("Not your room, asshole.");
    } else if (doorMessage === 2) {
        sendToLog("It's locked.");
    }
    sendPlayerUp(position);
}


//Player movement handlers
function killPlayer() {
    let replacedKeys = currentMap.keys.map(str => str.replace(/@/g, "."));
    currentMap.keys = replacedKeys;
    let replacedTiles = currentMap.tiles.map(str => str.replace(/@/g, "."));
    currentMap.tiles = replacedTiles;
    console.log(currentMap);
}

function sendPlayerDown(position) {
    killPlayer();
    const rowLength = 32;
    const row = (Math.floor(position / (rowLength + 1))+1);
    const col = position % (rowLength + 1);
    if (col < rowLength) {
        currentMap.tiles[row] = replaceCharAt(currentMap.tiles[row], col, '@');
        currentMap.keys[row] = replaceCharAt(currentMap.keys[row], col, '@');
    }
    console.log(currentMap);
    window.mage.maps[currentMapName] = currentMap;
    fillMap(currentMap);
}

function sendPlayerUp(position) {
    killPlayer();
    const rowLength = 32;
    const row = (Math.floor(position / (rowLength + 1))-1);
    const col = position % (rowLength + 1);
    if (col < rowLength) {
        currentMap.tiles[row] = replaceCharAt(currentMap.tiles[row], col, '@');
        currentMap.keys[row] = replaceCharAt(currentMap.keys[row], col, '@');
    }
    console.log(currentMap);
    window.mage.maps[currentMapName] = currentMap;
    fillMap(currentMap);
}

function sendPlayerLeft(position) {
    killPlayer();
    const rowLength = 32;
    const row = (Math.floor(position / (rowLength + 1)));
    const col = (position % (rowLength + 1))-1;
    if (col < rowLength) {
        currentMap.tiles[row] = replaceCharAt(currentMap.tiles[row], col, '@');
        currentMap.keys[row] = replaceCharAt(currentMap.keys[row], col, '@');
    }
    console.log(currentMap);
    window.mage.maps[currentMapName] = currentMap;
    fillMap(currentMap);
}

function sendPlayerRight(position) {
    killPlayer();
    const rowLength = 32;
    const row = (Math.floor(position / (rowLength + 1)));
    const col = (position % (rowLength + 1))+1;
    if (col < rowLength) {
        currentMap.tiles[row] = replaceCharAt(currentMap.tiles[row], col, '@');
        currentMap.keys[row] = replaceCharAt(currentMap.keys[row], col, '@');
    }
    console.log(currentMap);
    window.mage.maps[currentMapName] = currentMap;
    fillMap(currentMap);
}

let mapFunctions = {
    clickPlayer: clickPlayer,
    doorHome: doorHome,
    doorUp: doorUp,
    doorDown: doorDown,
    clickFriendlyClassmate: clickFriendlyClassmate,
    clickShadyClassmate: clickShadyClassmate,
}

//---------------------------//
// Map Rendering             //
//---------------------------//
function fillMap(map) {
    const mapDisplay = document.getElementById('worldMapDisplay');
    if (mapDisplay) {
        // Clear the map display
        mapDisplay.innerHTML = '';
        // Fill the map display
        let displayTiles = map.tiles.join('\n').split("");
        for (let i = 0; i < displayTiles.length; i++) {
            displayTiles[i] = "<span>" + displayTiles[i] + "</span>";
        }
        displayTiles = displayTiles.join("");
        document.getElementById("worldMapDisplay").innerHTML = displayTiles;

        // Create fake map
        let fakeMap = map.keys.join('\n').split("");
        const allSpans = mapDisplay.getElementsByTagName("span");

        for (let i = 0; i < fakeMap.length; i++) {
            const key = fakeMap[i];
            const keyData = map.keyData[key];
            if (!keyData) continue;

            // Coloring logic
            if (keyData.color && keyData.color !== "ignore") {
                let colorValue;
                if (keyData.color.startsWith("#")) {
                    colorValue = keyData.color;
                } else {
                    colorValue = resolveGlobal(keyData.color);
                }
                allSpans[i].style.color = colorValue;
            }

            // Hover logic
            if (keyData.hoverTitle) {
                if (keyData.hoverText !== "ignore") {
                    allSpans[i].style.cursor = "pointer";
                    allSpans[i].style.userSelect = "none";
                    allSpans[i].addEventListener("mouseover", function () {
                        hoverBox2.classList.add('show');
                        setMapText(keyData.hoverTitle, keyData.hoverText);
                    });
                } else {
                    allSpans[i].style.cursor = "default";
                    allSpans[i].style.userSelect = "none";
                }
                allSpans[i].addEventListener("mouseout", function () {
                    hoverBox2.classList.remove('show');
                });
                allSpans[i].addEventListener('mousemove', function (e) {
                    hoverBox2.style.left = (e.pageX + 10) + 'px';
                    hoverBox2.style.top = (e.pageY + 10) + 'px';
                });
            }

            // Click logic
            if (keyData.fn && mapFunctions[keyData.fn]) {
                allSpans[i].addEventListener("click", function () {
                    clearActives("worldmap"); 
                    mapFunctions[keyData.fn](i, keyData);
                });
            }
        }
    }
}


//---------------------------//
// Hoverbox                  //
//---------------------------//

function setMapText(title, text) {
    const hoverMapTitle = document.getElementById('hoverMapTitle');
    const hoverMapText = document.getElementById('hoverMapText');

    hoverMapTitle.innerHTML = title;
    hoverMapText.innerHTML = text;
}