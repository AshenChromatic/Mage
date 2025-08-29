

window.defaults = window.defaults || {};
  defaults.maps = {
    dorms: {
      name: "dorms",
      tiles: [
        "################################",
        "#......==......==......==CD...B#",
        "#......==......==......==.....B#",
        "#......==......==......==......#",
        "#......==......==......==......#",
        "#=-=======-=======-=======-====#",
        "#....o....................@....#",
        "#..............................#",
        "#..............................#",
        "#..............................#",
        "#....=====-=======-=======-====#",
        "#....==......==......==......==#",
        "#....==......==......==......==#",
        "#....==......==......==......==#",
        "#....==......==......==......==#",
        "|....==========================#",
        "|....==========================#",
        "#....==......==......==......==#",
        "#....==......==......==......==#",
        "#....==......==......==......==#",
        "#....==......==......==......==#",
        "#....=====-=======-=======-====#",
        "#.............................o#",
        "#..............................#",
        "#..............................#",
        "#...oo.........................#",
        "#=-=======-=======-=======-====#",
        "#......==......==......==......#",
        "#......==......==......==......#",
        "#......==......==......==......#",
        "#......==......==......==......#",
        "################################"
      ],
      keys: [
        "################################",
        "#......==......==......==CD...B#",
        "#......==......==......==.....B#",
        "#......==......==......==......#",
        "#......==......==......==......#",
        "#=6=======6=======6=======5====#",
        "#....1....................@....#",
        "#..............................#",
        "#..............................#",
        "#..............................#",
        "#....=====7=======7=======7====#",
        "#....==......==......==......==#",
        "#....==......==......==......==#",
        "#....==......==......==......==#",
        "#....==......==......==......==#",
        "|....==========================#",
        "|....==========================#",
        "#....==......==......==......==#",
        "#....==......==......==......==#",
        "#....==......==......==......==#",
        "#....==......==......==......==#",
        "#....=====6=======6=======6====#",
        "#.............................4#",
        "#..............................#",
        "#..............................#",
        "#...23.........................#",
        "#=7=======7=======7=======7====#",
        "#......==......==......==......#",
        "#......==......==......==......#",
        "#......==......==......==......#",
        "#......==......==......==......#",
        "################################"
      ],
      keyData: {
        "@": {
          type: "player",
          color: "window.mage.playerColor",
          hoverTitle: "You",
          hoverText: "It's you! You've not seen nearly enough use lately.",
          fn: "clickPlayer"
        },
        "1": {
          type: "npc",
          name: "Friendly Classmate",
          dialogue: "tbd",
          color: "#399500",
          hoverTitle: "Friendly Classmate",
          hoverText: "He stays right down the hall from you. Despite this, you have never really talked to him because you have better things to do.",
          fn: "clickFriendlyClassmate"
        },
        "2": {
          type: "npc",
          name: "Evil Classmate",
          dialogue: "tbd",
          color: "#5700ae",
          hoverTitle: "Evil Classmate",
          hoverText: "Seems to be busy in a wizard duel with Good Classmate",
          fn: "clickEvilClassmate"
        },
        "3": {
          type: "npc",
          name: "Good Classmate",
          dialogue: "tbd",
          color: "#ffb700",
          hoverTitle: "Good Classmate",
          hoverText: "Seems to be busy in a wizard duel with Evil Classmate",
          fn: "clickGoodClassmate"
        },
        "4": {
          type: "npc",
          name: "Shady Classmate",
          dialogue: "tbd",
          color: "#453f4a",
          hoverTitle: "Shady Classmate",
          hoverText: "He's wearing sunglasses indoors and a trenchcoat with black stains on it.",
          fn: "clickShadyClassmate"
        },
        "5": {
          type: "doorHome",
          locked: false,
          color: "#00c0c0",
          hoverTitle: "Your Dorm",
          hoverText: "Click to go back home.",
          fn: "doorHome"
        },
        "6": {
          type: "door",
          locked: true,
          dialogue: "tbd",
          color: "ignore",
          hoverTitle: "Dorm Door",
          hoverText: "Not yours.",
          fn: "doorUp"
        },
        "7": {
          type: "door",
          locked: true,
          dialogue: "tbd",
          color: "ignore",
          hoverTitle: "Dorm Door",
          hoverText: "Not yours.",
          fn: "doorDown"
        },
        ".": {
          color: "#D3D3D3",
          hoverTitle: "ignore",
          hoverText: "ignore"
        },
        "C": {
          type: "decor",
          color: "ignore",
          hoverTitle: "PC",
          hoverText: "Has seen way, way too much use lately."
        },
        "D": {
          type: "decor",
          color: "ignore",
          hoverTitle: "Desk",
          hoverText: "Has seen a little use lately. Mostly for eating dino nuggies."
        },
        "B": {
          type: "decor",
          color: "ignore",
          hoverTitle: "Bed",
          hoverText: "It's just a mattress on the floor. Has not seen nearly enough use lately."
        },
        "x" : {
          color: "#ff0000",
          hoverTitle: "ignore",
          hoverText: "ignore"
        }
      }
    }
  }
  window.forceDefaults = window.forceDefaults || {};
  window.forceDefaults.maps = window.forceDefaults.maps || {};
  window.forceDefaults.maps.dorms = window.forceDefaults.maps.dorms || {};
  window.forceDefaults.maps.dorms.keyData = window.forceDefaults.maps.dorms.keyData || {};
  window.forceDefaults.maps.dorms.keyData["2"] = window.forceDefaults.maps.dorms.keyData["2"] || {};
  window.forceDefaults.maps.dorms.keyData["2"].color = "#5700AE";