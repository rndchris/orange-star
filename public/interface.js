const screens = [
    ".menuItemEditor",
    ".menuAndRecipeViewer",
    ".inventoryViewer",
    ".groceryListViewer",
    ".recipeEditor"
]

viewMenuAndRecipeViewer();

function hideAll(){
    screens.forEach((screen) => {
        document.querySelector(screen).classList.add("hidden");
    })
}

function viewMenuAndRecipeViewer(){
    hideAll();
    getMenu();
    document.querySelector(".menuAndRecipeViewer").classList.remove("hidden");
}

function viewGroceryList(){
    hideAll();
    displayGroceryList();
    document.querySelector(".groceryListViewer").classList.remove("hidden");
}

function viewInventory(){
    hideAll();
    displayInventoryList();
    document.querySelector(".inventoryViewer").classList.remove("hidden");
}

function viewEditor(){
    hideAll();
    document.querySelector(".menuItemEditor").classList.remove("hidden");
}

function viewRecipeEditor(){
    hideAll();
    document.querySelector(".recipeEditor").classList.remove("hidden");
}