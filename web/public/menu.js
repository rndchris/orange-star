//Variable declaration
var menu = [];

//Main

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
    //drawMenu();
    console.log(response);
    return response;
}

async function getMenu(){
    const menu = await fetch("/api/menu");
    return menu.json();
}

//Menu Drawing Functions
async function drawMenu(menu){
    if (!menu){
        menu = await getMenu();
    }
    if (menu.length == 0){
        document.querySelector("#menu").innerHTML = "<p>You menu is currently empty. Add some recipes in the <a href=\"/recipes\">Recipe Manager</a> or visit the <a href=\"/exchange\">Recipe Exchange</a>."
        return;
    }

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
    drawMenu();
    return response;    
}

async function unlinkMenuItem(itemID){
    const response = await fetch("./api/unlinkMenuItem/" + itemID, {
        method: "Delete",
    })
    drawMenu();
    return response;
}

function lookupMenuIndex(menuID,menu){
    for (let i=0; i<menu.length;i++){
        if (menuID == menu[i].id){
            return i;
        }
    }
}

async function clickMenuItem(menuID){
    let menu = await getMenu();
    switch(document.querySelector("#clickAction").value){
        case "remove":
                await unlinkMenuItem(menuID);
                drawMenu();
            break;
        case "recipe":
            console.log(lookupMenuIndex(menuID,menu));
            console.log(menu[lookupMenuIndex(menuID,menu)].recipe);
            activeRecipe = await getRecipe(menu[lookupMenuIndex(menuID,menu)].recipe);
            unhideRecipeViewer();
            unhideRecipeButons();
            displayRecipe(activeRecipe);
            break;
        case "grocery":
            console.log(menu[lookupMenuIndex(menuID,menu)].recipe);
            addRecipeToGroceryList(await getRecipe(menu[lookupMenuIndex(menuID,menu)].recipe))
            break;
        case "cook":
            console.log(menu[lookupMenuIndex(menuID,menu)].recipe);
            removeRecipeFromInventory(await getRecipe(menu[lookupMenuIndex(menuID,menu)].recipe))
            break;
        case "category":
            const newCategory = prompt("What should the new menu category be?");
            await updateMenuItem(menu[lookupMenuIndex(menuID,menu)].id, menu[lookupMenuIndex(menuID,menu)].title, newCategory);
            drawMenu();
            break;
    }
}

async function updateMenuItem(menuId, title, category){
    const request = {
        title: title,
        category: category,
        id: menuId
    }
    console.log(request);
    const response = await fetch("./api/menu/" + menuId, {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(request),
    })
    data = response.json()
    return data;
}

function whatCanICook(){
    document.querySelector("#menuBasedOnInventoryButton").classList.add("hidden");
    if (document.querySelector("#fullMenuButton").classList.contains("hidden")){document.querySelector("#fullMenuButton").classList.remove("hidden")}
    fetch("./api/menu/inventory")
        .then((response) => {
            return response.json();
            }
        )
        .then((json) => {
            menu = json;
            drawMenu(json);
        })
}

function fullMenuButton(){
    document.querySelector("#fullMenuButton").classList.add("hidden");
    if (document.querySelector("#menuBasedOnInventoryButton").classList.contains("hidden")){document.querySelector("#menuBasedOnInventoryButton").classList.remove("hidden")}
    drawMenu();
}
