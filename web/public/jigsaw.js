async function getJigsawReport(){
    const response = await fetch("./api/jigsaw", {
        method: "GET",
        headers: {'Content-Type': 'application/json'}
    })
    return response.json();
}

async function displayJigsawReport(){
    const jigsawReport = await getJigsawReport();
    let jigsawHTML = "";
    for (let i=0; i<jigsawReport.recipes.length; i++){
        jigsawHTML+= "<div class=\"content jigsawrecipe\" recipeid=\"" + jigsawReport.recipes[i].id + "\">";
        jigsawHTML+= "<h3>" + jigsawReport.recipes[i].title + "</h3><ul>"
        for (let k=0; k<jigsawReport.recipes[i].ingredients.length; k++){
            let ingredient = jigsawReport.recipes[i].ingredients[k].name
            jigsawHTML+= "<li>" + ingredient + ingredientNeeded(jigsawReport.recipes[i].ingredients[k].essential) + inInventory(ingredient) + inGroceryList(ingredient) + "</li>";
        }
        jigsawHTML+= "</ul>";
        console.log(haveAllIngredients(jigsawReport.recipes[i]));
        if (haveAllIngredients(jigsawReport.recipes[i])){
            jigsawHTML+= "<p style=\"width: 200px;\">Added because " + jigsawReport.recipes[i].orphanIngredient + " is not used in inventory calculations.</p>"
        }
        jigsawHTML+= "</div>";
    }
    if (jigsawReport.unusedIngredients.length){jigsawHTML+= "<div style=\"background-color: rgba(0,255,255,.3);\" class=\"content\" id=\"Unused Ingredients\"><h3>Unused Ingredients</h3><p>These ingredients are in your inventory, but are not used in any recipes.<p><ul>";
    for (let i=0; i<jigsawReport.unusedIngredients.length; i++){
        jigsawHTML+= "<li>" + jigsawReport.unusedIngredients[i] + "</li>";
    }
    jigsawHTML+= "</ul></div>"}
    document.querySelector("#jigsawReport").innerHTML = jigsawHTML;
    makeJigsawClickable();
}

function makeJigsawClickable(){
    let renderedMenu = document.querySelectorAll(".jigsawrecipe");
    for (var i = 0; i<renderedMenu.length; i++){
        renderedMenu[i].addEventListener("click", async function(){
            let recipe = await getRecipe(this.getAttribute("recipeid"));
            addRecipeToGroceryList(recipe);
            let checkMenu = await onMenu(recipe.id)
            if (!checkMenu){
                let category = prompt("This item needs to be added to your menu. What category should it be added to?");
                addMenuItem(category, recipe.title, recipe.id);
            }
            clickAnimation(this);
        })
    }
}

async function onMenu(recipeId){
    let menu = await getMenu();
    let matches = menu.filter(e => e.recipe == recipeId)
    if (!matches.length){
        return false;
    } else {
        return true;
    }
}

function jigsawMagicButton(){
    displayJigsawReport();
}