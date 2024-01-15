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
        jigsawHTML+= "<h3>Suggestions for: " + jigsawReport[i].ingredient + "</h3><ul>"
        for (let j=0;j<jigsawReport[i].recipes.length; j++){
            jigsawHTML+= "<li recipeid=\"" + jigsawReport[i].recipes[j].id + "\">" + jigsawReport[i].recipes[j].title + "</li>";
        }
        if (!jigsawReport[i].recipes.length){jigsawHTML+= "<p>No recipes currently use this ingredient</p>"}
        jigsawHTML+= "</ul>";
    }
    document.querySelector("#jigsawReport").innerHTML = jigsawHTML;
    makeJigsawClickable();
}

function makeJigsawClickable(){
    let renderedMenu = document.querySelectorAll("#jigsawReport li");
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