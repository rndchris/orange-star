const screens = [
    ".menuItemEditor",
    ".menuAndRecipeViewer",
    ".inventoryViewer",
    ".groceryListViewer"
]

viewMenuAndRecipeViewer();

function hideAll(){
    screens.forEach((screen) => {
        document.querySelector(screen).classList.add("hidden");
    })
}

function viewMenuAndRecipeViewer(){
    hideAll();
    document.querySelector(".menuAndRecipeViewer").classList.remove("hidden");
}

function viewGroceryList(){
    hideAll();
    document.querySelector(".groceryListViewer").classList.remove("hidden");
}

function viewInventory(){
    hideAll();
    document.querySelector(".inventoryViewer").classList.remove("hidden");
}

function viewEditor(){
    hideAll();
    document.querySelector(".menuItemEditor").classList.remove("hidden");
}