//Variable declaration
var menu = [];

//Main
getMenu();

function addMenuItemButton(){
    addMenuItem(document.querySelector("#categoryText").value, document.querySelector("#menuItemText").value);
}

async function addMenuItem(categoryText, titleText){
    const content = {
        category: categoryText,
        title: titleText,
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
        menuHTML = menuHTML + "<div class=\"content\"><h2>" + menu[i].category + "</h2><ul>";
        for (let j = 0; j<menu[i].items.length; j++){
            console.log(menu[i].items[j].id)
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
        console.log(menu[i].category)
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
            console.log(this.innerHTML);
            console.log(this.getAttribute("menuid"));
            clickMenuItem(this.getAttribute("menuid"));
        })
    }
}

async function removeMenuItem(itemID){
    const response = await fetch("./api/menu/" + itemID, {
        method: "Delete",
    })
    getMenu();
    console.log(response);
    return response;
}

function clickMenuItem(menuID){
    console.log(menuID);
    console.log(document.querySelector("#clickAction").value)
    switch(document.querySelector("#clickAction").value){
        case "remove":
                console.log("Attempting Removal");
                removeMenuItem(menuID);
                getMenu();
            break;
    }
    //switch statement to determine action based on current mode
        //add to grocery list
        //determine when I need to start cooking
        //add to master menu
        //remove from current menu
}

//API for interacting with server (Get menu, etc)