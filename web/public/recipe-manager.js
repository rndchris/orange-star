drawRecipes()
clearRecipeEditorButton();

document.querySelector("#editCookTime").addEventListener("keyup", function cookTimePressed(event){
    if (event.key === "Tab"){
        addEditorIngredientButton();
        this.removeEventListener("keyup", cookTimePressed)
    }
})

function makeIngredientsKeyable(){
    let ingredientInputs = document.querySelectorAll(".ingredientWorkingArea input")
    for (var i = 0; i<ingredientInputs.length; i++){
        if (i === ingredientInputs.length - 1){
            ingredientInputs[i].addEventListener("keyup", function pressed(event){
                if (event.key  === "Tab"){
                    addEditorIngredientButton();
                    this.removeEventListener("keyup", pressed);
                }
            })
        }
    }
    for (var i = 0; i<ingredientInputs.length; i++){
        if (i === ingredientInputs.length - 1){
            ingredientInputs[i].addEventListener("keyup", function(event){
                if (event.key  === "Enter"){
                    this.checked = !this.checked;
                }
                if (event.key === "ArrowDown"){
                    document.querySelector("#editDirections").focus();
                }
            })
        }
    }
}

function addEditorIngredientButton(){
    addEditorIngredient();
    makeIngredientsKeyable();
}

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
            editRecipeClick(this.getAttribute("recipeid"));
            unhideSaved();
            clickAnimation(this);
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
        clearRecipeEditorButton();
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
        unhideSaved();
        drawRecipes();
    } else {
        alert("Enter at least a title and a cook time");
    }
}

function unhideSaved(){
    let buttons = [
        "#saveRecipeManagerButton",
        "#deleteRecipeButton",
        "#linkRecipeButton"
    ]
    buttons.forEach((button) => {
        if (document.querySelector(button).classList.contains("hidden")){
            document.querySelector(button).classList.remove("hidden");
        }
    })
}

function hideSaved(){
    let buttons = [
        "#saveRecipeManagerButton",
        "#deleteRecipeButton",
        "#linkRecipeButton"
    ]
    buttons.forEach((button) => {
        if (!document.querySelector(button).classList.contains("hidden")){
            document.querySelector(button).classList.add("hidden");
        }
    })
}

function clearRecipeEditorButton(){
    clearRecipeEditor();
    hideSaved();
    document.querySelector("#editCookTime").value = 0;
    document.querySelector("#editItem").focus();
}