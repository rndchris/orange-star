//Variable declaration
var menu = [];

//Main
getMenu();

function addMenuItemButton(){
    addMenuItem(document.querySelector("#categoryText").value, document.querySelector("#menuItemText").value, document.querySelector("#recipeNumberText").value) ;
}

async function addMenuItem(categoryText, titleText, recipeNumber){
    const content = {
        category: categoryText,
        title: titleText,
        recipe: recipeNumber,
    }
    const response = await fetch("./api/menu/add", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(content),
    })
    getMenu();
    console.log(response);
    return response;
}

//Functionland
function getMenu(){
    fetch("./api/menu")
        .then((response) => {
            return response.json();
            }
        )
        .then((json) => {
            menu = json;
            drawMenu(menu);
        })
    }

//Menu Drawing Functions
function drawMenu(menu){
    /*
    Creates HTML to display Menu Object
    What happens if multiple event listeners are added?
    */
    menu = createDisplayableMenu(menu);

    //convert to displayable object

    let menuHTML = "";
    for (let i = 0; i<menu.length; i++){
        menuHTML = menuHTML + "<div class=\"content\"><h3>" + menu[i].category + "</h3><ul>";
        for (let j = 0; j<menu[i].items.length; j++){
            menuHTML = menuHTML + "<li class=\"menuItem\" menuid=\"" + menu[i].items[j].id + "\">" + menu[i].items[j].title + "</li>";
        }
        menuHTML = menuHTML + "</ul></div>";
    }
    document.querySelector("#menu").innerHTML = menuHTML;
    makeMenuClickable();
}

function createDisplayableMenu(menu){
    displayMenu = []
    for (let i = 0; i<menu.length; i++){
        categoryIndex = getMenuCategoryIndex(menu[i].category, displayMenu);
        if (categoryIndex == -1){
            displayMenu.push({
                category: menu[i].category,
                items: [menu[i]],
            })
        } else {
            displayMenu[categoryIndex].items.push(menu[i]);
        }
    }
    return displayMenu;
}

function getMenuCategoryIndex(itemCategory, menu){
    /*Returns -1 if category not found */
    for (let categoryIndex = 0; categoryIndex < menu.length; categoryIndex++){
      if (itemCategory == menu[categoryIndex].category){
        return categoryIndex;
      }
    }
    return -1;
  }

function makeMenuClickable(){
    let renderedMenu = document.querySelectorAll(".menuItem");
    for (var i = 0; i<renderedMenu.length; i++){
        renderedMenu[i].addEventListener("click", function(){
            clickMenuItem(this.getAttribute("menuid"));
            clickAnimation(this);
        })
    }
}

async function removeMenuItem(itemID){
    const response = await fetch("./api/menu/" + itemID, {
        method: "Delete",
    })
    getMenu();
    return response;    
}

async function unlinkMenuItem(itemID){
    const response = await fetch("./api/unlinkMenuItem/" + itemID, {
        method: "Delete",
    })
    getMenu();
    return response;
}

function lookupMenuIndex(menuID){
    for (let i=0; i<menu.length;i++){
        if (menuID == menu[i].id){
            return i;
        }
    }
}

async function clickMenuItem(menuID){
    switch(document.querySelector("#clickAction").value){
        case "remove":
                await unlinkMenuItem(menuID);
                getMenu();
            break;
        case "recipe":
            console.log(menu[lookupMenuIndex(menuID)].recipe);
            activeRecipe = await getRecipe(menu[lookupMenuIndex(menuID)].recipe);
            displayRecipe(activeRecipe);
            break;
        case "grocery":
            console.log(menu[lookupMenuIndex(menuID)].recipe);
            addRecipeToGroceryList(await getRecipe(menu[lookupMenuIndex(menuID)].recipe))
            break;
        case "cook":
            console.log(menu[lookupMenuIndex(menuID)].recipe);
            removeRecipeFromInventory(await getRecipe(menu[lookupMenuIndex(menuID)].recipe))
            break;
    }
    //switch statement to determine action based on current mode
        //add to grocery list
        //determine when I need to start cooking
        //add to master menu
        //remove from current menu
}

function whatCanICook(){
    fetch("./api/menu/inventory")
        .then((response) => {
            return response.json();
            }
        )
        .then((json) => {
            menu = json;
            drawMenu(menu);
        })
}