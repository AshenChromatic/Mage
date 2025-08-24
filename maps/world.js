let currentMap = {};
let currentMapName = "";
function resolveGlobal(path) {
    return path.split('.').reduce(function (obj, prop) {
        return obj && obj[prop];
    }, window);
}

//Load Map
async function loadMap(mapName) {
    try {
        const response = await fetch(`maps/${mapName}.json`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        currentMap = await response.json();   // turn JSON text → JS object
        currentMapName = mapName;             // remember which file we loaded

        console.log(`Loaded ${mapName}:`, currentMap);

        fillMap(currentMap);

    } catch (err) {
        console.error("Error loading JSON:", err);
    }
}


currentMapName = "dorms";

// Render the map as soon as the Map tab appears
window.addEventListener('DOMContentLoaded', function () {
    const mapDisplay = document.getElementById('worldMap');
    if (mapDisplay) {
        console.log("Map Display On Screen");
        loadMap(currentMapName);
    }
});

// Render the map
function fillMap(map) {
    const mapDisplay = document.getElementById('worldMapDisplay');
    if (mapDisplay) {
        // Clear the map display
        mapDisplay.innerHTML = '';
        // Fill the map display
        displayTiles = map.tiles.join('\n');
        displayTiles = displayTiles.split("");
        for (let i = 0; i < displayTiles.length; i++) {
            displayTiles[i] = "<span>" + displayTiles[i] + "</span>";
        }
        displayTiles = displayTiles.join("");
        console.log(displayTiles);
        document.getElementById("worldMapDisplay").innerHTML = displayTiles;

        //Create fake map
        let fakeMap = map.keys.join('\n');
        fakeMap = fakeMap.split("");

        //Iterate through all keys, check fakemap for each key and apply color and clickable function to each based on the position
        const allSpans = mapDisplay.getElementsByTagName("span");
        for (let key in map.keyData) {
            for (let i = 0; i < fakeMap.length; i++) {
                if (fakeMap[i] === key) {
                    console.log("found match for " + key);
                    //Coloring logic
                    if (map.keyData[key].color) {
                        const colorString = map.keyData[key].color;
                        if (colorString !== "ignore") {
                            if (colorString.startsWith("#")) {
                                colorValue = colorString;
                            } else {
                            colorValue = resolveGlobal(colorString);
                            }
                            allSpans[i].style.color = colorValue;
                        }
                    }

                    // Hover logic
                    if (map.keyData[key].hoverTitle) {
                        if (map.keyData[key].hoverText !== "ignore") {
                                allSpans[i].style.cursor = "pointer";
                                console.log("Found hover title for " + key);
                                allSpans[i].addEventListener("mouseover", function () {
                                    hoverBox.classList.add('show');
                                    console.log("Hovering over", key);
                                    setMapText(
                                    map.keyData[key].hoverTitle,
                                    map.keyData[key].hoverText
                                    );
                            });
                        }
                        else {
                            allSpans[i].style.cursor = "default";
                            allSpans[i].style.userSelect = "none";
                        }
                        allSpans[i].addEventListener("mouseout", function () {
                            hoverBox.classList.remove('show');
                            console.log("Stopped hovering", key);
                        });
                        allSpans[i].addEventListener('mousemove', function (e) {
                            hoverBox.style.left = (e.pageX + 10) + 'px';
                            hoverBox.style.top = (e.pageY + 10) + 'px';
                        });
                    }

                    // Click logic
                    if (map.keyData[key].onClick) {
                        allSpans[i].addEventListener("click", function () {
                            map.keyData[key].onClick(i);
                        });
                    }
                }
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