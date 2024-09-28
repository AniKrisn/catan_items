const tree = {
    "Primary Items": {
      "Wood": {},
      "Water": {},
      "Ore": {},
      "Oil": {},
      "Salt": {}
    },
    "Secondary Items": {
      "Pulp": { "combination": ["Wood", "Water"] },
      "Slurry": { "combination": ["Water", "Ore"] },
      "Brine": { "combination": ["Water", "Salt"] },
      "Emulsion": { "combination": ["Water", "Oil"] },
      "Charcoal": { "combination": ["Wood", "Ore"] },
      "Preserved Wood": { "combination": ["Wood", "Salt"] },
      "Resin": { "combination": ["Wood", "Oil"] },
      "Flux": { "combination": ["Ore", "Salt"] },
      "Lubricant": { "combination": ["Ore", "Oil"] },
      "Soap": { "combination": ["Salt", "Oil"] }
    },
    "Triplet Items": {
      "Composite Material": { "combination": ["Water", "Wood", "Ore"] },
      "Pickled Wood": { "combination": ["Water", "Wood", "Salt"] },
      "Water-resistant Coating": { "combination": ["Water", "Wood", "Oil"] },
      "Electrolyte Solution": { "combination": ["Water", "Ore", "Salt"] },
      "Drilling Mud": { "combination": ["Water", "Ore", "Oil"] },
      "Hydraulic Fluid": { "combination": ["Water", "Salt", "Oil"] },
      "Metal Alloy": { "combination": ["Wood", "Ore", "Salt"] },
      "Smelting Mixture": { "combination": ["Wood", "Ore", "Oil"] },
      "Preserved Timber": { "combination": ["Wood", "Salt", "Oil"] },
      "Galvanizing Mixture": { "combination": ["Ore", "Salt", "Oil"] }
    },
    "Tertiary Items": {
      "Salt Paper": { "combination": ["Pulp", "Brine"] },
      "Advanced Filtration Medium": { "combination": ["Slurry", "Charcoal"] },
      "Weather-Resistant Lumber": { "combination": ["Emulsion", "Preserved Wood"] },
      "Metal-Infused Polymer": { "combination": ["Resin", "Ore"] },
      "Hydraulic Cement": { "combination": ["Soap", "Water"] },
      "Self-Lubricating Composite": { "combination": ["Composite Material", "Oil"] },
      "Conductive Timber": { "combination": ["Electrolyte Solution", "Wood"] },
      "Advanced Drilling Compound": { "combination": ["Drilling Mud", "Salt"] },
      "Nanoparticle Suspension": { "combination": ["Metal Alloy", "Emulsion"] },
      "Metallic Paper": { "combination": ["Galvanizing Mixture", "Pulp"] }
    }
  };
  
  // Populate the list tree with items
  function populateTree() {
    const primaryList = document.getElementById('primary-list');
    const secondaryList = document.getElementById('secondary-list');
    const tertiaryList = document.getElementById('tertiary-list');
  
    // Populate Primary Items
    Object.keys(tree["Primary Items"]).forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      primaryList.appendChild(li);
    });
  
    // Populate Secondary Items
    Object.keys(tree["Secondary Items"]).forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      secondaryList.appendChild(li);
    });
  
    // Populate Tertiary Items
    Object.keys(tree["Tertiary Items"]).forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      tertiaryList.appendChild(li);
    });
  }
  
  // Collapse/Expand functionality for list tree
  const collapsibles = document.getElementsByClassName("collapsible");
  
  for (let i = 0; i < collapsibles.length; i++) {
    collapsibles[i].addEventListener("click", function() {
      this.classList.toggle("active");
      const content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
  
  // Initialize the list tree on page load
  populateTree();
  
  // Existing autocomplete and item details functionality
  const allItems = { ...tree["Primary Items"], ...tree["Secondary Items"], ...tree["Triplet Items"], ...tree["Tertiary Items"] };
  const itemInput = document.getElementById('item-input');
  const itemDetails = document.getElementById('item-details');
  const itemName = document.getElementById('item-name');
  const combinationsList = document.getElementById('combinations-list');
  const componentsList = document.getElementById('components-list');
  
  function autocomplete(input, items) {
    let currentFocus;
  
    input.addEventListener("input", function() {
      const val = this.value;
      closeAllLists();
      if (!val) return false;
      currentFocus = -1;
  
      const list = document.createElement("DIV");
      list.setAttribute("id", this.id + "autocomplete-list");
      list.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(list);
  
      Object.keys(items).forEach(item => {
        if (item.slice(0, val.length).toUpperCase() === val.toUpperCase()) {
          const option = document.createElement("DIV");
          option.innerHTML = `<strong>${item.slice(0, val.length)}</strong>${item.slice(val.length)}`;
          option.innerHTML += `<input type='hidden' value='${item}'>`;
  
          option.addEventListener("click", function() {
            input.value = this.getElementsByTagName("input")[0].value;
            closeAllLists();
            showItemDetails(input.value);
          });
          
          list.appendChild(option);
        }
      });
    });
  
    input.addEventListener("keydown", function(e) {
      let x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode === 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode === 38) {
        currentFocus--;
        addActive(x);
      } else if (e.keyCode === 13) {
        e.preventDefault();
        if (currentFocus > -1 && x) x[currentFocus].click();
      }
    });
  
    function addActive(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = x.length - 1;
      x[currentFocus].classList.add("autocomplete-active");
    }
  
    function removeActive(x) {
      [...x].forEach(item => item.classList.remove("autocomplete-active"));
    }
  
    function closeAllLists(elmnt) {
      const items = document.getElementsByClassName("autocomplete-items");
      [...items].forEach(item => {
        if (elmnt !== item && elmnt !== input) {
          item.parentNode.removeChild(item);
        }
      });
    }
  
    document.addEventListener("click", function(e) {
      closeAllLists(e.target);
    });
  }
  
  function showItemDetails(item) {
    itemDetails.style.display = 'block';
    itemName.textContent = item;
  
    const combinations = getCombinations(item);
    combinationsList.innerHTML = '';
    combinations.forEach(combo => {
      const li = document.createElement('li');
      li.textContent = combo;
      combinationsList.appendChild(li);
    });
  
    const components = getComponents(item);
    componentsList.innerHTML = '';
    components.forEach(component => {
      const li = document.createElement('li');
      li.textContent = component;
      componentsList.appendChild(li);
    });
  }
  
  function getCombinations(item) {
    return Object.keys(allItems).filter(product =>
      allItems[product].combination && allItems[product].combination.includes(item)
    );
  }
  
  function getComponents(item) {
    return allItems[item] && allItems[item].combination ? allItems[item].combination : [];
  }
  
  autocomplete(itemInput, allItems);
  