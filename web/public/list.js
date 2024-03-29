function initializeListInput(){
    document.querySelector("#groceryInput").addEventListener("keyup", function(event){
        if (event.key === "Enter"){
            addGroceryButton();
        }
    })

    document.querySelector("#inventoryInput").addEventListener("keyup", function(event){
        if (event.key === "Enter"){
            addInventoryButton();
        }
    })
}

async function displayGroceryList(){
    const groceryList = await listGET("grocery");
    displayList(groceryList, "#groceryList");
}

async function displayInventoryList(){
    const groceryList = await listGET("inventory");
    displayList(groceryList, "#inventoryList");
}

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

async function addToList(item, listSelector){
    if (item != ""){
        if (listSelector == "#groceryList"){
            await listAPI([item],"PUT","grocery");
            //list.push(item);
            displayGroceryList();
        } else if (listSelector == "#inventoryList"){
            await listAPI([item],"PUT","inventory");
            //inventory.push(item);
            displayInventoryList();
        }
    }
}

async function removeFromList(item, listSelector){
    if (listSelector == "#groceryList"){
        await listAPI([item],"DELETE","grocery");
        //list = list.filter(list => list !== item);
        displayGroceryList();
    } else if (listSelector == "#inventoryList"){
        await listAPI([item],"DELETE","inventory");
        //inventory = inventory.filter(inventory => inventory !== item);
        displayInventoryList();
    }
}

async function listClicked(item, listSelector){
    let clickSelection = "#groceryClickAction"
    if (listSelector == "#inventoryList"){clickSelection = "#inventoryClickAction"};
    switch(document.querySelector(clickSelection).value){
        case "remove":
            await removeFromList(item, listSelector);
            await displayGroceryList();
            displayActiveRecipe();
            break;
        case "buy":
            await listAPI([item],"PUT", "inventory");
            await listAPI([item],"DELETE", "grocery");
            await displayGroceryList();
            displayActiveRecipe();
            break;
    }
}

function makeListClickable(listSelector){
    let renderedMenu = document.querySelectorAll(listSelector + " li");
    for (var i = 0; i<renderedMenu.length; i++){
        renderedMenu[i].addEventListener("click", function(){
            listClicked(this.innerHTML, listSelector);
            clickAnimation(this);
        })
    }
}

async function addGroceryButton(){
    //addToList(document.querySelector("#groceryInput").value, "#groceryList");
    await listAPI([document.querySelector("#groceryInput").value],"PUT","grocery/force");
    await displayGroceryList();
    displayActiveRecipe();
    document.querySelector("#groceryInput").value = "";
    
}

async function addInventoryButton(){
    await addToList(document.querySelector("#inventoryInput").value, "#inventoryList");
    document.querySelector("#inventoryInput").value = "";
}

async function listAPI(items, method, list){
    const response = await fetch("./api/" + list, {
        method: method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(items),
    })
}

async function goShopping(){
    const response = await fetch("./api/grocery/buy", {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
    })
}

async function listGET(list){
    const response = await fetch("./api/" + list, {
        method: "GET",
        headers: {'Content-Type': 'application/json'}
    })
    return response.json();
}

async function goShoppingButton(){
    await goShopping();
    await displayGroceryList();
    await displayInventoryList();
    if (!document.querySelector(".menuAndRecipeViewer").classList.contains("hidden") && !document.querySelector("#fullMenuButton").classList.contains("hidden")){
        whatCanICook();
    }
    displayActiveRecipe();
}

async function bombGroceryList(){
    let list = document.querySelectorAll("#groceryList li");
    let groceryList = [];
    for (let i=0; i<list.length; i++){
        groceryList.push(list[i].innerHTML)
    }
    console.log(groceryList);
    await listAPI(groceryList,"DELETE","grocery");
    await displayGroceryList();
    displayActiveRecipe();
}