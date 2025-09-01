//---------------------------//
// Hoverbox                  //
//---------------------------//
window.game = window.game || {};
game.shopItems = {
  orb: {
    desc: 'A mana orb that gathers and stores ambient mana from the environment.',
    effect: '+1 Mana/s <br> +50 Max Mana',
    flavor: 'Surprisingly unponderable.',
    resourceNeed: ['gold'],
    costs: [5],
    ratio: 1.2,
    resourceGet: ['orb']
  },
  shadyInk: {
    desc: 'A cartridge of CMYK printer ink.',
    effect: '+1 Ink',
    flavor: 'ERROR: OUT OF CYAN. PLEASE REPLACE CARTRIDGE.',
    resourceNeed: ['gold'],
    costs: [1],
    ratio: 1,
    resourceGet: ['ink']
  },
  shadyFrog: {
    desc: () => `He is very ugly and warty, but ${mage.maps.dorms.keyData[4].name} tells you it's where he gets all his ink from.`,
    effect: '+.001 Ink/s',
    flavor: () => {
      const options = [
        "Thankfully, I can just milk some more from my creature.",
        "Little do they know, it was harvested from my creature.",
        "The creature whimpered, he knows it's time for another milking session."
      ];
      return options[Math.floor(Math.random() * options.length)];
    },
    resourceNeed: ['gold'],
    costs: [100],
    ratio: 1,
    resourceGet: ['frog']
  }
};

let shopItems = game.shopItems;

const hoverBox = document.getElementById('hoverBox');
const buyOrbBtn = document.getElementById('buyOrbBtn');

let desc = typeof shopItems.orb.desc === 'function' ? shopItems.orb.desc() : shopItems.orb.desc;
let flavor = typeof shopItems.orb.flavor === 'function' ? shopItems.orb.flavor() : shopItems.orb.flavor;

function setBuyText(desc, costs, effect, flavor, resourceNeed) {
  const hoverBuyDesc = document.getElementById('hoverBuyDesc');
  const hoverBuyCost = document.getElementById('hoverBuyCost');
  const hoverBuyEffect = document.getElementById('hoverBuyEffect');
  const hoverBuyFlavor = document.getElementById('hoverBuyFlavor');

  hoverBuyDesc.innerHTML = desc;

  // Format costs and resourceNeed arrays
  let costLines = '';
  if (Array.isArray(costs) && Array.isArray(resourceNeed) && costs.length === resourceNeed.length) {
    for (let i = 0; i < costs.length; i++) {
      costLines += `${costs[i]} ${resourceNeed[i]}`;
      if (i < costs.length - 1) costLines += '<br>';
    }
  } else if (typeof costs === 'string') {
    costLines = costs;
  } else {
    costLines = '';
  }
  hoverBuyCost.innerHTML = costLines;

  hoverBuyEffect.innerHTML = effect;
  // If flavor is a function, call it
  hoverBuyFlavor.innerHTML = (typeof flavor === 'function') ? flavor() : flavor;
}





// Event delegation for all shopBuyBtn buttons (works for dynamic elements)
const shopBtnNames = new Set();

document.body.addEventListener('mouseover', function (e) {
  const btn = e.target.closest('.shopBuyBtn');
  if (!btn) return;
  let btnName = btn.textContent ? btn.textContent.trim() : (btn.id || '[unnamed button]');
  shopBtnNames.add(btnName);
  const itemKey = btn.dataset.item;
  const item = shopItems[itemKey];
  console.log('[mouseover] btn:', btn, 'itemKey:', itemKey, 'item:', item);
  if (!item) {
    console.log('[mouseover] No item found for key:', itemKey);
    return;
  }
  hoverBox.classList.add('show');
  console.log('[mouseover] hoverBox shown');
  let desc = typeof item.desc === 'function' ? item.desc() : item.desc;
  let flavor = typeof item.flavor === 'function' ? item.flavor() : item.flavor;
  // Calculate dynamic costs
  const bought = mage.shopCount[itemKey]?.bought || 0;
  const dynamicCosts = item.costs.map((cost, i) => {
    let ratio = 1;
    if (Array.isArray(item.ratio)) {
      ratio = item.ratio[i] !== undefined ? item.ratio[i] : 1;
    } else if (typeof item.ratio === 'number') {
      ratio = item.ratio;
    }
    return Math.floor(cost * Math.pow(ratio, bought));
  });
  setBuyText(desc, dynamicCosts, item.effect, flavor, item.resourceNeed);
  const hoverBoxBuy = document.getElementById('hoverBoxBuy');
  if (checkIfEnoughResources(item.resourceNeed, dynamicCosts)) {
    hoverBoxBuy.classList.remove('broke');
    console.log('[mouseover] Player can afford item');
  } else {
    hoverBoxBuy.classList.add('broke');
    console.log('[mouseover] Player cannot afford item');
  }
});

document.body.addEventListener('mousemove', function (e) {
  const btn = e.target.closest('.shopBuyBtn');
  if (!btn) return;
  // Calculate intended position
  let left = e.pageX + 10;
  let top = e.pageY + 10;
  // Prevent going off bottom of viewport
  if (hoverBox) {
    const hoverBoxRect = hoverBox.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    // If the box would go off the bottom, adjust top
    if (top + hoverBoxRect.height > viewportHeight) {
      top = viewportHeight - hoverBoxRect.height - 5; // 5px margin from bottom
      if (top < 0) top = 0;
    }
    hoverBox.style.left = left + 'px';
    hoverBox.style.top = top + 'px';
  }
});

document.body.addEventListener('mouseout', function (e) {
  const btn = e.target.closest('.shopBuyBtn');
  if (!btn) return;
  // Only trigger if the mouse is leaving the button, not moving to a child
  if (!btn.contains(e.relatedTarget)) {
    hoverBox.classList.remove('show');
    console.log('[mouseleave] hoverBox hidden');
  }
});

document.body.addEventListener('click', function (e) {
  const btn = e.target.closest('.shopBuyBtn');
  if (!btn) return;
  let btnName = btn.textContent ? btn.textContent.trim() : (btn.id || '[unnamed button]');
  shopBtnNames.add(btnName);
  const itemKey = btn.dataset.item;
  const item = shopItems[itemKey];
  console.log('[click] btn:', btn, 'itemKey:', itemKey, 'item:', item);
  if (!item) {
    console.log('[click] No item found for key:', itemKey);
    return;
  }
  // Calculate dynamic costs
  const bought = mage.shopCount[itemKey]?.bought || 0;
  const dynamicCosts = item.costs.map((cost, i) => {
    const ratio = (item.ratio && item.ratio[i] !== undefined) ? item.ratio[i] : 1;
    return Math.floor(cost * Math.pow(ratio, bought));
  });
  // Attempt to buy
  if (buy(item.resourceNeed, dynamicCosts, item.resourceGet[0]) === true) {
    // For each resource gained, show its display if not already visible
    item.resourceGet.forEach(resName => {
      const resources = window.mage.resources;
      if (resources[resName] && resources[resName].displayId) {
        const displayElement = document.getElementById(resources[resName].displayId);
        if (displayElement && !displayElement.classList.contains('show')) {
          displayElement.classList.add('show');
          resources[resName].visible = true;
        }
        // Also try to show a parent div if it exists (e.g., orbDiv)
        const divId = resName + 'Div';
        const divElement = document.getElementById(divId);
        if (divElement && !divElement.classList.contains('show')) {
          divElement.classList.add('show');
        }
        // Also try to show the display container if it exists (e.g., orbDisplay)
        const displayContainerId = resName + 'Display';
        const displayContainer = document.getElementById(displayContainerId);
        if (displayContainer && !displayContainer.classList.contains('show')) {
          displayContainer.classList.add('show');
        }
      }
    });
  }
  console.log('[click] buy attempted for', itemKey);
});

setTimeout(() => {
  console.log('Shop buy button event listeners (delegated) will respond for:', Array.from(shopBtnNames));
}, 0);



//---------------------------//
// Buyers                    //
//---------------------------//

const buyer = game.shopItems;

function checkIfEnoughResources(resourceNeed, costs) {
  const resources = window.mage.resources;
  if (!Array.isArray(resourceNeed)) resourceNeed = [resourceNeed];
  if (!Array.isArray(costs)) costs = [costs];

  if (resourceNeed.length !== costs.length) {
    console.error('resources and costs not paired up');
    return false;
  }

  // Check if the player has enough resources
  for (let i = 0; i < resourceNeed.length; i++) {
    if (resources[resourceNeed[i]].amount < costs[i]) {
      console.error('You are too broke in ' + resources[resourceNeed[i]].name);
      return false;
    }
    return true;
  }
}

function buy(resourceNeed, costs, resourceGet) {
  const resources = window.mage.resources;
  if (!checkIfEnoughResources(resourceNeed, costs)) {
    console.error('Not enough resources to buy');
    return;
  }
  // Deduct costs from resources and update the display
  for (let i = 0; i < resourceNeed.length; i++) {
    resources[resourceNeed[i]].amount -= costs[i];
    const displayId = resources[resourceNeed[i]].displayId;
    const displayElement = document.getElementById(displayId);
    if (displayElement) {
      displayElement.innerHTML = resources[resourceNeed[i]].amount;
    }
  }
  // Add the resource gained
  resources[resourceGet].amount += 1;
  const displayId = resources[resourceGet].displayId;
  const displayElement = document.getElementById(displayId);
  if (displayElement) {
    displayElement.innerHTML = resources[resourceGet].amount;
  }
  //Increase max resource if applicable
  if (resources[resourceGet].increaseMax && resources[resourceGet].increaseMaxBy) {
    const target = resources[resources[resourceGet].increaseMax];
    if (target) {
      target.max += resources[resourceGet].increaseMaxBy;
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


// Enhanced buy logic for all shopBuyBtn buttons
document.querySelectorAll('.shopBuyBtn').forEach(btn => {
  btn.addEventListener('mouseover', function () {
    const itemKey = btn.dataset.item;
    const item = shopItems[itemKey];
    console.log('[mouseover] btn:', btn, 'itemKey:', itemKey, 'item:', item);
    if (!item) {
      console.log('[mouseover] No item found for key:', itemKey);
      return;
    }
    hoverBox.classList.add('show');
    console.log('[mouseover] hoverBox shown');
    let desc = typeof item.desc === 'function' ? item.desc() : item.desc;
    setBuyText(desc, item.costs, item.effect, item.flavor, item.resourceNeed);
    const hoverBoxBuy = document.getElementById('hoverBoxBuy');
    if (checkIfEnoughResources(item.resourceNeed, item.costs)) {
      hoverBoxBuy.classList.remove('broke');
      console.log('[mouseover] Player can afford item');
    } else {
      hoverBoxBuy.classList.add('broke');
      console.log('[mouseover] Player cannot afford item');
    }
  });

  btn.addEventListener('mousemove', function (e) {
    hoverBox.style.left = (e.pageX + 10) + 'px';
    hoverBox.style.top = (e.pageY + 10) + 'px';
  });

  btn.addEventListener('mouseleave', function () {
    hoverBox.classList.remove('show');
    console.log('[mouseleave] hoverBox hidden');
  });

  btn.addEventListener('click', function () {
    const itemKey = btn.dataset.item;
    const item = shopItems[itemKey];
    console.log('[click] btn:', btn, 'itemKey:', itemKey, 'item:', item);
    if (!item) {
      console.log('[click] No item found for key:', itemKey);
      return;
    }
    // Attempt to buy
    if (buy(item.resourceNeed, item.costs, item.resourceGet[0]) === true) {
      // For each resource gained, show its display if not already visible
      item.resourceGet.forEach(resName => {
        console.log('[resource display] Checking resource:', resName, mage.resources[resName]);
        if (mage.resources[resName] && mage.resources[resName].displayId) {
          const displayElement = document.getElementById(mage.resources[resName].displayId);
          console.log('[resource display] displayElement:', displayElement);
          if (displayElement && !displayElement.classList.contains('show')) {
            displayElement.classList.add('show');
            mage.resources[resName].visible = true;
            console.log('[resource display] Made visible:', mage.resources[resName].displayId);
          } else if (displayElement) {
            console.log('[resource display] Already visible:', mage.resources[resName].displayId);
          } else {
            console.warn('[resource display] No display element found for:', mage.resources[resName].displayId);
          }
          // Also try to show a parent div if it exists (e.g., orbDiv)
          const divId = resName + 'Div';
          const divElement = document.getElementById(divId);
          console.log('[resource display] divElement:', divElement);
          if (divElement && !divElement.classList.contains('show')) {
            divElement.classList.add('show');
            console.log('[resource display] Made parent div visible:', divId);
          } else if (divElement) {
            console.log('[resource display] Parent div already visible:', divId);
          } else {
            console.warn('[resource display] No parent div found for:', divId);
          }

          // Also try to show the display container if it exists (e.g., orbDisplay)
          const displayId = resName + 'Display';
          const displayContainer = document.getElementById(displayId);
          console.log('[resource display] displayContainer:', displayContainer);
          if (displayContainer && !displayContainer.classList.contains('show')) {
            displayContainer.classList.add('show');
            console.log('[resource display] Made display container visible:', displayId);
          } else if (displayContainer) {
            console.log('[resource display] Display container already visible:', displayId);
          } else {
            console.warn('[resource display] No display container found for:', displayId);
          }
        } else {
          console.warn('[resource display] Resource or displayId missing for:', resName, mage.resources[resName]);
        }
      });
    }
    console.log('[click] buy attempted for', itemKey);
  });
});

