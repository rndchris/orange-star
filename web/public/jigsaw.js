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
    for (let i=0; i<jigsawReport.length; i++){
        jigsawHTML+= "<div class=\"content jigsawrecipe\" recipeid=\"" + jigsawReport[i].id + "\">";
        jigsawHTML+= "<h3>" + jigsawReport[i].title + "</h3><ul>"
        for (let k=0; k<jigsawReport[i].ingredients.length; k++){
            let ingredient = jigsawReport[i].ingredients[k].name
            jigsawHTML+= "<li>" + ingredient + ingredientNeeded(ingredient) + inInventory(ingredient) + inGroceryList(ingredient) + "</li>";
        }
        jigsawHTML+= "</ul></div>";
    }
    document.querySelector("#jigsawReport").innerHTML = jigsawHTML;
    makeJigsawClickable();
}

function makeJigsawClickable(){
    let renderedMenu = document.querySelectorAll("#jigsawReport div");
    for (var i = 0; i<renderedMenu.length; i++){
        renderedMenu[i].addEventListener("click", async function(){
            let recipe = await getRecipe(this.getAttribute("recipeid"));
            addRecipeToGroceryList(recipe);
            clickAnimation(this);
        })
    }
}

function jigsawMagicButton(){
    displayJigsawReport();
}