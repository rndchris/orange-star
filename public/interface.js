const screens = [
    ".menuAndRecipeViewer",
    ".inventoryViewer",
    ".groceryListViewer",
    ".recipeEditor",
    ".jigsaw"
];

function hideAll(){
    screens.forEach((screen) => {
        document.querySelector(screen).classList.add("hidden");
    })
}

function viewMenuAndRecipeViewer(){
    hideAll();
    drawMenu();
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

function viewRecipeEditor(){
    hideAll();
    document.querySelector(".recipeEditor").classList.remove("hidden");
}

function viewJigsaw(){
    hideAll();
    document.querySelector(".jigsaw").classList.remove("hidden");

}

function clickAnimation(element){
    if (element.classList.contains("clicked")){
        element.classList.remove("clicked");
        //line below resets animation
        void document.querySelector(".content").offsetWidth;

    }
    element.classList.add("clicked");
}