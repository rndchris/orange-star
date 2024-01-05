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

function makeMenuClickable(){
    let renderedMenu = document.querySelectorAll(".menuItem");
    for (var i = 0; i<renderedMenu.length; i++){
        renderedMenu[i].addEventListener("click", function(){
            console.log(this.innerHTML);
            console.log(this.getAttribute("menuid"));
        })
    }
}

function clickMenuItem(menuID){
    console.log(menuID);
    //switch statement to determine action based on current mode
        //add to grocery list
        //determine when I need to start cooking
        //add to master menu
        //remove from current menu
}

//API for interacting with server (Get menu, etc)