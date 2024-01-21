const screens = [
    ".menuAndRecipeViewer",
    ".inventoryViewer",
    ".recipeEditor",
    ".jigsaw",
    ".soloGrocery"
];

function startAnimation(){
    let showScreen = ".menuAndRecipeViewer";
    document.querySelector(showScreen).classList.add("flyin");
    document.querySelector(showScreen).classList.remove("hidden");
}

function hideAll(showScreen){
    screens.filter(e => e !== showScreen).forEach((screen) => {
        document.querySelector(screen).classList.add("flyout");
        setTimeout(() => {
            document.querySelector(screen).classList.add("hidden");
            document.querySelector(screen).classList.remove("flyout");
            document.querySelector(showScreen).classList.add("flyin");
            document.querySelector(showScreen).classList.remove("hidden");
        }, 300)
    })
}

function viewMenuAndRecipeViewer(){
    hideAll(".menuAndRecipeViewer");
    drawMenu();
    displayGroceryList();
    let groceryViewer = document.querySelector(".groceryListViewer");
    let recipeBlock = document.querySelector(".recipesAndGrocery");
    setTimeout(() => {
        recipeBlock.appendChild(groceryViewer);
    }, 300)       
}

function viewGroceryList(){
    displayGroceryList();
    let groceryViewer = document.querySelector(".groceryListViewer");
    let grocerySolo = document.querySelector(".soloGrocery");
    grocerySolo.appendChild(groceryViewer);
    hideAll(".soloGrocery");
}

function viewInventory(){
    hideAll(".inventoryViewer");
    displayInventoryList();
}

function viewRecipeEditor(){
    hideAll(".recipeEditor");
}

function viewJigsaw(){
    hideAll(".jigsaw");

}

function clickAnimation(element){
    if (element.classList.contains("clicked")){
        element.classList.remove("clicked");
        //line below resets animation
        void document.querySelector(".content").offsetWidth;

    }
    element.classList.add("clicked");
}

function unhideRecipeButons(){
    if (document.querySelector(".editorbar").classList.contains("hidden")){
        document.querySelector(".editorbar").classList.remove("hidden")
    }
}

function unhideRecipeViewer(){
    if (document.querySelector(".recipeViewer").classList.contains("hidden")){
        document.querySelector(".recipeViewer").classList.remove("hidden");
        document.querySelector(".menuViewer").classList.add("recipeViewerVisible");
    }
}

function hideRecipeViewer(){
    if (!document.querySelector(".recipeViewer").classList.contains("hidden")){
        document.querySelector(".recipeViewer").classList.add("flyout");
        setTimeout(() => {
            document.querySelector(".recipeViewer").classList.add("hidden");
            document.querySelector(".recipeViewer").classList.remove("flyout");
            document.querySelector(".menuViewer").classList.remove("recipeViewerVisible");
        }, 500);
    }
}