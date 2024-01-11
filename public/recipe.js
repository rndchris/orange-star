testRecipe = {
    id: 1,
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

displayRecipe(testRecipe, "#recipe");

function displayRecipe(recipe, elementID){
    recipeElement = document.querySelector(elementID);
    var recipeHTML = "<h3>"+ recipe.title + "</h3><p>Cook Time: "+ recipe.cookTime + "</p><h4>Ingredients</h4><ul>";
    recipe.ingredients.forEach(element => {
        recipeHTML = recipeHTML + "<li>" + element.quantity + " " + element.name + "</li>";
    });
    recipeHTML = recipeHTML + "</ul><h4>Directions</h4><p>" + recipe.directions + "</p>";
    recipeElement.innerHTML = recipeHTML;
}