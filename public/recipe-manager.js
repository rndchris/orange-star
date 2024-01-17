drawRecipes()
clearRecipeEditor();

async function drawRecipes(){
    let recipeList = document.querySelector("#recipeList");
    let recipes = await getRecipes();
    let recipesHTML = "<ul>"

    for (let i=0; i<recipes.length; i++){
        recipesHTML+= "<li recipeid=\"" + recipes[i].id + "\">";
        recipesHTML+= recipes[i].title;
        recipesHTML+= "</li>"
    }

    recipesHTML+= "</ul>";
    recipeList.innerHTML = recipesHTML;

    makeRecipeListClickable();
}

function makeRecipeListClickable(){
    let ingredientBullets = document.querySelectorAll("#recipeList li");
    for (let i=0; i<ingredientBullets.length; i++){
        ingredientBullets[i].addEventListener("click", function(){
            console.log(this.getAttribute("recipeid"));
            //displayRecipeFromLibrary(this.getAttribute("recipeid"), "#recipe");
            editRecipeClick(this.getAttribute("recipeid"))
        })
    }
}

async function editRecipeClick(recipeID){
    const recipe = await getRecipe(recipeID);
    drawRecipeForEditing(recipe);
}

async function saveRecipeManagerButton(){
    const recipe = editorRecipe();
    if (recipe.id){
        await sendUpdatedRecipe(recipe);
        await drawRecipes();
    } else {
        alert("Click Save as New Recipe. Recipe does not currently exit");
    }
}

async function deleteRecipeButton(){
    const recipe = editorRecipe();
    if (recipe.id){
        await deleteRecipe(recipe.id);
        await drawRecipes();
        clearRecipeEditor();
    } else {
        alert("Can't Delete. Recipe does not currently exit");
    }
}

function linkRecipeButton(){
    const recipe = editorRecipe();
    if (recipe.id){
        let category = prompt("What menu category should this item be added to?");
        if (category){
            addMenuItem(category, recipe.title, recipe.id);
        }
    } else {
        alert("Recipe must be saved before linking to menu.");
    }
    
}

async function newRecipeManagerButton(){
    const recipe = editorRecipe();
    console.log(recipe);
    if (recipe.title && recipe.cookTime){
        let createdRecipe = await addRecipe(recipe);
        console.log(createdRecipe);
        drawRecipeForEditing(createdRecipe);
        linkRecipeButton();
        drawRecipes();
    } else {
        alert("Enter at least a title and a cook time");
    }
}