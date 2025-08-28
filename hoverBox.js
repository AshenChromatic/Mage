//---------------------------//
// Hoverbox                  //
//---------------------------//

mage.shopItems = {
  orb: {
    desc: 'A mana orb that gathers and stores ambient mana from the environment.',
    effect: '+1 Mana/s <br> +50 Max Mana',
    flavor: 'Surprisingly unponderable.',
    resourceNeed: ['gold'],
    costs: [5],
    resourceGet: ['orb']
  },
  shadyInk: {
    desc: 'A cartridge of CMYK printer ink.',
    effect: '+1 Ink',
    flavor: 'ERROR: OUT OF CYAN. PLEASE REPLACE CARTRIDGE.',
    resourceNeed: ['gold'],
    costs: [1],
    resourceGet: ['Ink']
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
    resourceGet: ['Frog']
  }

};

let shopItems = mage.shopItems;


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
  setBuyText(desc, item.costs, item.effect, flavor, item.resourceNeed);
  const hoverBoxBuy = document.getElementById('hoverBoxBuy');
  if (checkIfEnoughResources(item.resourceNeed, item.costs)) {
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
  // Attempt to buy
  if (buy(item.resourceNeed, item.costs, item.resourceGet[0]) === true) {
    // For each resource gained, show its display if not already visible
    item.resourceGet.forEach(resName => {
      if (resource[resName] && resource[resName].displayId) {
        const displayElement = document.getElementById(resource[resName].displayId);
        if (displayElement && !displayElement.classList.contains('show')) {
          displayElement.classList.add('show');
          resource[resName].visible = true;
        }
        // Also try to show a parent div if it exists (e.g., orbDiv)
        const divId = resName + 'Div';
        const divElement = document.getElementById(divId);
        if (divElement && !divElement.classList.contains('show')) {
          divElement.classList.add('show');
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

const buyer = mage.shopItems;

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
        if (resource[resName] && resource[resName].displayId) {
          const displayElement = document.getElementById(resource[resName].displayId);
          if (displayElement && !displayElement.classList.contains('show')) {
            displayElement.classList.add('show');
            resource[resName].visible = true;
          }
          // Also try to show a parent div if it exists (e.g., orbDiv)
          const divId = resName + 'Div';
          const divElement = document.getElementById(divId);
          if (divElement && !divElement.classList.contains('show')) {
            divElement.classList.add('show');
          }
        }
      });
    }
    console.log('[click] buy attempted for', itemKey);
  });
});

deepMergeDefaults(window.mage, window.defaults);