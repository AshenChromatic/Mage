window.defaults = window.defaults || {};
window.mage = window.mage || {};
defaults.stuff = {
    playerColor: "#ff0000ff",
    slut: 0,
    whatMusic: null
};

defaults.resources = {
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

function getResource(resource) {
  return mage.resources[resource];
}

defaults.progress = {
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

defaults.shopCount = {
  orb: {
    bought: 0
  },
  shadyInk: {
    bought: 0
  },
  shadyFrog: {
    bought: 0
  }
};

defaults.mapManager = defaults.mapManager || {};
defaults.mapManager.dialogue = {
    gribbletharp: {
        affection: 0,
        comeHereOften: true,
        named: false,
        hideBody: true,
        shadyGuy: false
    },
    shadyClassmate: {
        affection: 0,
        shadyShop: false,
        shades: false,
        interacted: false
    },
    goodClassmate: {
        affection: 0,
        alive: true,
        first: true,
        specialPlingus: false,
        killedHim: false
    },
    evilClassmate: {
        affection: 0,
        alive: true,
        first: true,
        specialPlingus: false,
        killedHer: false,
        acceptBribe: false,
        denyBribe: false
    }
}

function deepMergeDefaults(target, defaults, overrides) {
    for (const key in defaults) {
        if (
            typeof defaults[key] === 'object' &&
            defaults[key] !== null &&
            !Array.isArray(defaults[key])
        ) {
            if (!target[key]) target[key] = {};
            deepMergeDefaults(target[key], defaults[key]);
        } else if (!(key in target)) {
            target[key] = defaults[key];
        }
    }
    // If overrides is provided, merge its properties into target, overwriting existing data
    if (overrides && typeof overrides === 'object') {
        for (const key in overrides) {
            if (
                typeof overrides[key] === 'object' &&
                overrides[key] !== null &&
                !Array.isArray(overrides[key])
            ) {
                if (!target[key] || typeof target[key] !== 'object') {
                    target[key] = {};
                }
                deepMergeDefaults(target[key], {}, overrides[key]);
            } else {
                target[key] = overrides[key];
            }
        }
    }
    //Manual overrides for Reasons
    if (mage.maps) {
    if (mage.maps.dorms.keyData["3"]) {
        if (mage.maps.dorms.keyData["3"].name === "tbd") {
            mage.maps.dorms.keyData["3"].name = "Good Classmate";
        }
    }
    if (mage.maps.dorms.keyData["2"]) {
        if(mage.maps.dorms.keyData["2"].name === "tbd") {
            mage.maps.dorms.keyData["2"].name = "Evil Classmate";
        }
    }
    }   
}

deepMergeDefaults(window.mage, window.defaults);