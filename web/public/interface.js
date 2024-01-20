const screens = [
    ".menuAndRecipeViewer",
    ".inventoryViewer",
    ".recipeEditor",
    ".jigsaw",
    ".soloGrocery"
];

function hideAll(){
    screens.forEach((screen) => {
        document.querySelector(screen).classList.add("hidden");
    })
}

function viewMenuAndRecipeViewer(){
    hideAll();
    drawMenu();
    displayGroceryList();
    let groceryViewer = document.querySelector(".groceryListViewer");
    let recipeBlock = document.querySelector(".recipesAndGrocery");
    recipeBlock.appendChild(groceryViewer);
    document.querySelector(".menuAndRecipeViewer").classList.remove("hidden");
}

function viewGroceryList(){
    hideAll();
    displayGroceryList();
    document.querySelector(".soloGrocery").classList.remove("hidden");
    let groceryViewer = document.querySelector(".groceryListViewer");
    let grocerySolo = document.querySelector(".soloGrocery");
    grocerySolo.appendChild(groceryViewer);
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