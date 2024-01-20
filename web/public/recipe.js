testRecipe = {
    id: 1,
    category: "Sweets",
    title: "Pound Cake",
    cookTime: 2,
    ingredients: [
        {name: "flour", quantity: "1 cup"},
        {name: "butter", quantity: "1 cup"},
        {name: "sugar", quantity: "1 cup"},
        {name: "eggs", quantity: "1 cup"},
    ],
    directions: "Preheat oven to 365 F. Mix the stuff. Put it in a pan and bake it."
}

var activeRecipe = {
    ingredients: []
};

var newRecipe = {
    ingredients: []
}


function addIngredientButton(){
    let ingredientName = escapeHTML(document.querySelector("#ingredientNameInput").value);
    let ingredientQuantity = escapeHTML(document.querySelector("#quantityInput").value);
    let ingredientEssential = document.querySelector("#essentialInput").checked;

    const newIngredient = {
        name: ingredientName,
        quantity: ingredientQuantity,
        essential: ingredientEssential,
    }

    if (ingredientName){
        newRecipe.ingredients.push(newIngredient);
        drawIngredientsinEditor(newRecipe);
    }
    
}

function displayRecipeInEditor(recipe){
    let recipeCategory = document.querySelector("#categoryInput");
    let recipeTitle = document.querySelector("#itemInput");
    let recipeCookTime = document.querySelector("#cookTimeInput");
    let recipeDirections = document.querySelector("#directionsInput");

    recipeCategory.value = recipe.category;
    recipeTitle.value = recipe.title;
    recipeCookTime.value = recipe.cookTime;
    drawIngredientsinEditor(recipe);
    recipeDirections.value = recipe.directions;
}

function clearRecipeEditor(){
    let recipeCategory = document.querySelector("#categoryInput");
    let recipeTitle = document.querySelector("#itemInput");
    let recipeCookTime = document.querySelector("#cookTimeInput");
    let recipeDirections = document.querySelector("#directionsInput");

    newRecipe = {
        ingredients: []
    };
    
    recipeCategory.value = "";
    recipeTitle.value = "";
    recipeCookTime.value = "0";
    drawIngredientsinEditor(newRecipe);
    recipeDirections.value = "";
}

async function addRecipe(recipe){
    const response = await fetch("./api/recipe", {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(recipe),
    })
    data = response.json()
    //getMenu();
    //console.log(response);
    return data;
}

function updateActiveRecipe(){
    let recipeCategory = document.querySelector("#categoryInput");
    let recipeTitle = document.querySelector("#itemInput");
    let recipeCookTime = document.querySelector("#cookTimeInput");
    let recipeDirections = document.querySelector("#directionsInput");

    activeRecipe.title = escapeHTML(recipeTitle.value);
    activeRecipe.category = escapeHTML(recipeCategory.value);
    activeRecipe.cookTime = escapeHTML(recipeCookTime.value);
    activeRecipe.directions = escapeHTML(recipeDirections.value);

    displayRecipe(activeRecipe, "#recipe");
}

function escapeHTML(str){
    return new Option(str).innerHTML;
}

function ingredientNeeded(isEssential){
    if (isEssential){
        return "👁️";
    } else {
        return "";
    }
}

function displayRecipe(recipe, elementID = "#recipe"){
    //compute dinner time
    let dinnerHour = escapeHTML(document.querySelector("#hours").value);
    let dinnerMin = escapeHTML(document.querySelector("#minutes").value);
    let dinnerMinString
    if (dinnerMin < 10){
        dinnerMinString = "0" + dinnerMin.toString();
    } else {
        dinnerMinString = dinnerMin.toString();
    }
    let dinnerTime = "" + dinnerHour + ":" + dinnerMinString;
    let dinnerSum = dinnerHour*1 + dinnerMin/60;
    if (dinnerSum < 0){dinnerSum+=12};
    console.log(dinnerSum);
    let startSum = dinnerSum - recipe.cookTime;
    let startHour = Math.floor(startSum);
    let startMin = Math.floor((startSum - Math.floor(startSum))*60);
    let startMinString
    if (startMin < 10){
        startMinString = "0" + startMin.toString();
    } else {
        startMinString = startMin.toString();
    }
    let startTime = "" + startHour + ":" + startMinString;

    //draw recipe
    let recipeElement = document.querySelector(elementID);
    var recipeHTML = "<h3>"+ recipe.title + "</h3><p>Cook Time: "+ recipe.cookTime + "</p>";
    recipeHTML+= "<p>Start Cooking by " + startTime + " in order to have dinner ready by " + dinnerTime + "</p>"
    recipeHTML+= "<h4>Ingredients</h4><ul>";
    recipe.ingredients.forEach(element => {
        recipeHTML = recipeHTML + "<li ingredientName=\"" + element.name + "\">" + element.quantity + " " + element.name + " " + ingredientNeeded(element.essential) + "</li>";
    });
    recipeHTML = recipeHTML + "</ul><h4>Directions</h4><p>" + recipe.directions + "</p>";
    recipeElement.innerHTML = recipeHTML;
    makeRecipeClickable()
}

function makeRecipeClickable(){
    let ingredientBullets = document.querySelectorAll("#recipe li");
    for (let i=0; i<ingredientBullets.length; i++){
        ingredientBullets[i].addEventListener("click", function(){
            activeRecipe.ingredients = activeRecipe.ingredients.filter(e => e.name != this.getAttribute("ingredientName"));
            displayRecipe(activeRecipe, "#recipe");
            console.log(this.getAttribute("ingredientName"));
        })
    }
}

async function getRecipe(recipeID){
    const response = await fetch("./api/recipe/" + recipeID, {
        method: "GET",
    })

    return response.json();
}

async function getRecipes(){
    const response = await fetch("./api/recipe", {
        method: "GET",
    })

    return response.json();
}

function addRecipeToGroceryListButton(){
    addRecipeToGroceryList(activeRecipe);
};

function cookRecipeButton(){
    removeRecipeFromInventory(activeRecipe);
};

async function addRecipeToGroceryList(recipe){
    const ingredients = []
    for (let i=0; i<recipe.ingredients.length; i++){
        if (recipe.ingredients[i].essential){
            ingredients.push(recipe.ingredients[i].name);
        }
    }
    await listAPI(ingredients,"PUT","grocery");
    displayGroceryList();
}

async function removeRecipeFromInventory(recipe){
    const ingredients = []
    for (let i=0; i<recipe.ingredients.length; i++){
        if (recipe.ingredients[i].essential){
            ingredients.push(recipe.ingredients[i].name);
        }
    }
    await listAPI(ingredients,"DELETE","inventory");
    displayInventoryList();
}

async function deleteRecipe(itemID){
    const response = await fetch("./api/recipe/" + itemID, {
        method: "DELETE",
    })
    console.log(response)
    return response;
}