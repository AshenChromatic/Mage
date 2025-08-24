let currentMap = {};
let currentMapName = "";

async function loadMap(mapName) {
  try {
    const response = await fetch(`maps/${mapName}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    currentMap = await response.json();   // turn JSON text → JS object
    currentMapName = mapName;             // remember which file we loaded

    console.log(`Loaded ${mapName}:`, currentMap);

    fillMap(currentMap.tiles);

  } catch (err) {
    console.error("Error loading JSON:", err);
  }
}

currentMapName = "dorms";

// Render the map as soon as the Rune tab appears
window.addEventListener('DOMContentLoaded', function() {
    const mapDisplay = document.getElementById('worldMap');
    if (mapDisplay) {
        console.log("Map Display On Screen");
        loadMap(currentMapName);
    }
});

function fillMap(tiles) {
    const mapDisplay = document.getElementById('worldMapDisplay');
    if (mapDisplay) {
        // Clear the map display
        mapDisplay.innerHTML = '';
        // Fill the map display
        displayTiles = tiles.join('\n');
        mapDisplay.textContent = displayTiles;
    }
}