function searchFilter(searchArea,searchItems, searchTerm){
    //let area = document.querySelector(searchArea);
    let items = document.querySelectorAll(searchArea + " " + searchItems);
    if (searchTerm){
        for (let i = 0; i < items.length; i++){
            if (items[i].innerHTML.toLowerCase().includes(searchTerm.toLowerCase())){
                items[i].classList.remove("hidden");
            } else {
                items[i].classList.add("hidden");
            }
        }
    } else {
        for (let i = 0; i < items.length; i++){
          items[i].classList.remove("hidden");       
        }
    }
}

function initializeSearchInput(inputQuerySelector, searchArea, searchItems){
    searchInput = document.querySelector(inputQuerySelector)
    searchInput.addEventListener("keyup", () => {
        searchFilter(searchArea, searchItems, searchInput.value);
    })
}

function hideEmptyMenuCategories(){
    let searchObjects = document.querySelectorAll("#menu div");
    let visible = true;
    let hideCheckObjects;
    for (let i = 0; i < searchObjects.length; i++){
        hideCheckObjects = searchObjects[i].children[1].children;
        visible = false;
        for (let k=0; k< hideCheckObjects.length; k++){
            if (!hideCheckObjects[k].classList.contains("hidden")){
                visible = true;
            }
        }
        if (visible){
            searchObjects[i].classList.remove("hidden");
        } else {searchObjects[i].classList.add("hidden")}
    }
}



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
    displayJigsawReport();
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

function exchangeUnhideRecipeViewer(){
    if (document.querySelector(".recipeViewer").classList.contains("hidden")){
        document.querySelector(".recipeViewer").classList.remove("hidden");
    }
}

function exchangeHideRecipeViewer(){
    if (!document.querySelector(".recipeViewer").classList.contains("hidden")){
        document.querySelector(".recipeViewer").classList.add("flyout");
        setTimeout(() => {
            document.querySelector(".recipeViewer").classList.add("hidden");
            document.querySelector(".recipeViewer").classList.remove("flyout");
        }, 500);
    }
}

function flyOut(element){
    element.classList.add("flyout");
    setTimeout(() => {
        element.classList.add("hidden");
        element.classList.remove("flyout");
    }, 300)
}

function flyIn(element){
    element.classList.add("flyin");
    element.classList.remove("hidden");
    setTimeout(() => {
        //element.classList.add("hidden");
        element.classList.remove("flyin");
    }, 300)
}