list = ["butter", "sugar", "eggs", "flour"];
inventory = ["eggs", "paprika"];

displayList(list, "#groceryList");
displayList(inventory, "#inventoryList");

function displayList(list, listSelector){
    listElement = document.querySelector(listSelector);
    let listHTML = "<ul>"
    list.forEach(element => {
        listHTML = listHTML + "<li>" + element + "</li>";
    });
    listHTML = listHTML + "</ul>";
    listElement.innerHTML = listHTML
    makeListClickable(listSelector);
}

function addToList(item, listSelector){
    if (item != ""){
        if (listSelector == "#groceryList" && list.filter(e => e == item).length == 0){
            list.push(item);
            displayList(list, "#groceryList");
        } else if (listSelector == "#inventoryList" && inventory.filter(e => e == item).length == 0){
            inventory.push(item);
            displayList(inventory, "#inventoryList");
        }
    }
}

function removeFromList(item, listSelector){
    if (listSelector == "#groceryList"){
        list = list.filter(list => list !== item);
        displayList(list, "#groceryList");
    } else if (listSelector == "#inventoryList"){
        inventory = inventory.filter(inventory => inventory !== item);
        displayList(inventory, "#inventoryList");
    }
}

function listClicked(item, listSelector){
    let clickSelection = "#groceryClickAction"
    if (listSelector == "#inventoryList"){clickSelection = "#inventoryClickAction"};
    switch(document.querySelector(clickSelection).value){
        case "remove":
            removeFromList(item, listSelector);
            break;
    }
}

function makeListClickable(listSelector){
    let renderedMenu = document.querySelectorAll(listSelector + " li");
    for (var i = 0; i<renderedMenu.length; i++){
        renderedMenu[i].addEventListener("click", function(){
            listClicked(this.innerHTML, listSelector);;
        })
    }
}

function addGroceryButton(){
    addToList(document.querySelector("#groceryInput").value, "#groceryList");
}

function addInventoryButton(){
    addToList(document.querySelector("#inventoryInput").value, "#inventoryList");
}