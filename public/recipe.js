testRecipe = {
    id: 1,
    category: "Sweets",
    title: "Pound Cake",
    cookTime: 2,
    ingredients: [
        {name: "flour", quantity: "1 cup", inventory: true, excludeGrocery: false},
        {name: "butter", quantity: "1 cup"},
        {name: "sugar", quantity: "1 cup"},
        {name: "eggs", quantity: "1 cup"},
    ],
    directions: "Preheat oven to 365 F. Mix the stuff. Put it in a pan and bake it."
}

var activeRecipe = testRecipe;


displayRecipe(testRecipe, "#recipe");
displayRecipeInEditor(testRecipe);

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
    updateActiveRecipe();
    addMenuItem(activeRecipe.category, activeRecipe.title)
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

function displayRecipe(recipe, elementID){
    let recipeElement = document.querySelector(elementID);
    var recipeHTML = "<h3>"+ recipe.title + "</h3><p>Cook Time: "+ recipe.cookTime + "</p><h4>Ingredients</h4><ul>";
    recipe.ingredients.forEach(element => {
        recipeHTML = recipeHTML + "<li>" + element.quantity + " " + element.name + "</li>";
    });
    recipeHTML = recipeHTML + "</ul><h4>Directions</h4><p>" + recipe.directions + "</p>";
    recipeElement.innerHTML = recipeHTML;
}