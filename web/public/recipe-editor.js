var workingRecipe = {
    ingredients: []
}

function drawRecipeForEditing(recipe){
    //var editMenuId = document.querySelector("#editMenuId");
    var editRecipeId = document.querySelector("#editRecipeId");
    //var editCategory = document.querySelector("#editCategory");
    var editItem = document.querySelector("#editItem");
    var editCookTime = document.querySelector("#editCookTime");
    var editDirections = document.querySelector("#editDirections");

    console.log(editRecipeId);
    editRecipeId.value = recipe.id;
    //editCategory.value = recipe.category;
    editItem.value = recipe.title;
    editCookTime.value = recipe.cookTime;
    editDirections.value = recipe.directions;

    drawEditorIngredients(recipe);
}

function drawEditorIngredients(recipe){
    var ingredientWorkingArea = document.querySelector(".ingredientWorkingArea");
    let ingredientHTML = "<ul>";

    for (let i=0; i<recipe.ingredients.length; i++){
        ingredientHTML = ingredientHTML + "<li><input class=\"ingredientName\" value=\"" + recipe.ingredients[i].name + "\">";
        ingredientHTML = ingredientHTML + "<input class=\"ingredientQuantity\" value=\"" + recipe.ingredients[i].quantity + "\">"
        //ingredientHTML = ingredientHTML + "<input class=\"ingredientEssential\" type=\"checkbox\" checked=\"" + checked(recipe.ingredients[i].essential) + "\">"
        ingredientHTML = ingredientHTML + "<input class=\"ingredientEssential\" type=\"checkbox\">"
        ingredientHTML = ingredientHTML + "</li>"
    }

    ingredientHTML = ingredientHTML + "</ul>"

    ingredientWorkingArea.innerHTML = ingredientHTML;

    updateEditorCheckboxes(recipe);
}

function updateEditorCheckboxes(recipe){
    let ingredientCheckboxes = document.querySelectorAll(".ingredientWorkingArea .ingredientEssential");
    for (let i = 0; i<ingredientCheckboxes.length; i++){
        ingredientCheckboxes[i].checked = recipe.ingredients[i].essential;
    }
}

function checked(isChecked){
    if (isChecked){
        return "true";
    } else {
        return "false";
    }
}

function addEditorIngredient(){
    let ingredientHTML = "<input class=\"ingredientName\" placeholder=\"Item\">";
    ingredientHTML = ingredientHTML + "<input class=\"ingredientQuantity\" placeholder=\"Quantity\">"
    ingredientHTML = ingredientHTML + "<input class=\"ingredientEssential\" type=\"checkbox\">"

    let ingredientWorkingArea = document.querySelector(".ingredientWorkingArea ul");
    let ingredientBullet = document.createElement('li')
    ingredientBullet.innerHTML = ingredientHTML;
    ingredientWorkingArea.appendChild(ingredientBullet);    
    
}

async function editRecipeButton(){
    const recipe = await getRecipe(activeRecipe.id);
    drawRecipeForEditing(recipe);
    viewRecipeEditor();
}

function editorRecipe(){
        var editRecipeId = document.querySelector("#editRecipeId");
        var editItem = document.querySelector("#editItem");
        var editCookTime = document.querySelector("#editCookTime");
        var editDirections = document.querySelector("#editDirections");

        var ingredients = getEditorIngredients();

        var recipe = {
            id: editRecipeId.value,
            title: editItem.value,
            cookTime: editCookTime.value,
            directions: editDirections.value,
            ingredients: ingredients,
        }

        return recipe;
}

function getEditorIngredients(){
    let ingredients = [];
    let names = document.querySelectorAll(".ingredientName");
    let quantity = document.querySelectorAll(".ingredientQuantity");
    let essential = document.querySelectorAll(".ingredientEssential");

    for (i=0; i<names.length; i++){
        if (names[i].value){
            ingredients.push({
                name: names[i].value,
                quantity: quantity[i].value,
                essential: essential[i].checked,
            })
        }
    }

    return ingredients;
}

async function sendUpdatedRecipe(recipe){
    const response = await fetch("./api/recipe/" + recipe.id, {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(recipe),
    })
    getMenu();
    console.log(response);
    return response;
}
function updateRecipeButton(){
    const recipe = editorRecipe();
    sendUpdatedRecipe(recipe);
    viewMenuAndRecipeViewer();
    displayRecipe(recipe, "#recipe");
}

function clearRecipeEditor(){
    //var editMenuId = document.querySelector("#editMenuId");
    document.querySelector("#editRecipeId").value = null;
    //var editCategory = document.querySelector("#editCategory");
    document.querySelector("#editItem").value = null;
    document.querySelector("#editCookTime").value = null;
    document.querySelector("#editDirections").value = null;
    document.querySelector(".ingredientWorkingArea").innerHTML = "<ul></ul>";
}