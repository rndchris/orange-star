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

var activeRecipe;


function addIngredientButton(){
    let ingredientName = document.querySelector("#ingredientNameInput").value;
    let ingredientQuantity = document.querySelector("#quantityInput").value;
    let ingredientEssential = document.querySelector("#essentialInput").checked;

    const newIngredient = {
        name: ingredientName,
        quantity: ingredientQuantity,
        essential: ingredientEssential,
    }

    if (ingredientName){
        activeRecipe.ingredients.push(newIngredient);
        drawIngredientsinEditor(activeRecipe);
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

function addFullMenuItemButton(){
    updateActiveRecipe()
    addRecipe(activeRecipe);
}

async function addRecipe(recipe){
    const response = await fetch("./api/recipe", {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(recipe),
    })
    getMenu();
    console.log(response);
    return response;
}

function updateActiveRecipe(){
    let recipeCategory = document.querySelector("#categoryInput");
    let recipeTitle = document.querySelector("#itemInput");
    let recipeCookTime = document.querySelector("#cookTimeInput");
    let recipeDirections = document.querySelector("#directionsInput");

    activeRecipe.title = recipeTitle.value;
    activeRecipe.category = recipeCategory.value;
    activeRecipe.cookTime = recipeCookTime.value;
    activeRecipe.directions = recipeDirections.value;

    displayRecipe(activeRecipe, "#recipe");
}

function drawIngredientsinEditor(recipe){
    let recipeIngredients = document.querySelector("#recipeIngredients");
    let ingredientsHTML = "<ul>"
    for (let i=0; i<recipe.ingredients.length; i++){
        ingredientsHTML = ingredientsHTML + "<li ingredientIndex=\"" + i + "\">" + recipe.ingredients[i].quantity + " " + recipe.ingredients[i].name + " " + ingredientNeeded(recipe.ingredients[i].essential) + "</li>";
    }
    ingredientsHTML = ingredientsHTML + "</ul>"
    recipeIngredients.innerHTML = ingredientsHTML;

    makeIngredientsClickable();
}

function makeIngredientsClickable(){
    let renderedMenu = document.querySelectorAll("#recipeIngredients li");
    for (var i = 0; i<renderedMenu.length; i++){
        renderedMenu[i].addEventListener("click", function(){
            let removeIndex = this.getAttribute("ingredientIndex");
            activeRecipe.ingredients.splice(removeIndex, 1);
            this.remove();
        })
    }
}

function ingredientNeeded(isEssential){
    if (isEssential){
        return "👁️";
    } else {
        return "";
    }
}

function displayRecipe(recipe, elementID = "#recipe"){
    let recipeElement = document.querySelector(elementID);
    var recipeHTML = "<h3>"+ recipe.title + "</h3><p>Cook Time: "+ recipe.cookTime + "</p><h4>Ingredients</h4><ul>";
    recipe.ingredients.forEach(element => {
        recipeHTML = recipeHTML + "<li>" + element.quantity + " " + element.name + " " + ingredientNeeded(element.essential) + "</li>";
    });
    recipeHTML = recipeHTML + "</ul><h4>Directions</h4><p>" + recipe.directions + "</p>";
    recipeElement.innerHTML = recipeHTML;
}

async function getRecipe(recipeID){
    const response = await fetch("./api/recipe/" + recipeID, {
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
    await displayGroceryList();
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