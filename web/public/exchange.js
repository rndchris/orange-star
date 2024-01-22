function makeExchangeTableClickable(){
    let exchangeRecipeList = document.querySelectorAll(".exchangeData");
    for (let i=0; i<exchangeRecipeList.length;i++){
        exchangeRecipeList[i].addEventListener("click", async () => {
            let exchangeId = exchangeRecipeList[i].getAttribute("exchangeid")
            console.log(exchangeId);
            activeRecipe = await getExchangeRecipe(exchangeId);
            console.log(activeRecipe);
            displayActiveRecipe();
            let author = exchangeRecipeList[i].getAttribute("author");
            if (author === "true" && document.querySelector("#unshareButton").classList.contains("hidden")){
                document.querySelector("#unshareButton").classList.remove("hidden");
            } else if (author !== "true" && !document.querySelector("#unshareButton").classList.contains("hidden")){
                document.querySelector("#unshareButton").classList.add("hidden");
            }
            if (document.querySelector(".recipeViewer").classList.contains("hidden")){
                exchangeUnhideRecipeViewer();
            }
        })
    }
}

async function getExchangeRecipe(exchangeId){
    const response = await fetch("./api/exchange/" + exchangeId, {
        method: "GET",
    })
    return response.json();    
}

async function addExchangeRecipeButton(){
    activeRecipe.category = prompt("What menu category would you like to add this recipe to?");
    addRecipe(activeRecipe);
    alert("Recipe saved to your library.");
}

async function unshareRecipeButton(){
    await unshareRecipe(activeRecipe.id);
    exchangeHideRecipeViewer();
    console.log(document.querySelectorAll(".exchangeData"))
    let rows = document.querySelectorAll(".exchangeData");
    for (let i=0;i<rows.length;i++){
        console.log(rows[i].getAttribute("exchangeid"));
        console.log(activeRecipe.id);
        if (rows[i].getAttribute("exchangeid") == activeRecipe.id){
            rows[i].remove();
        }
    }
}

async function unshareRecipe(itemID){
    const response = await fetch("./api/exchange/" + itemID, {
        method: "DELETE",
    })
    console.log(response);
    return response;
}