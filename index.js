import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dbInfo from "./database.js";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
//import fs from "fs";

const app = express();
const port = 3500;

//connect to database
const db = new pg.Client(dbInfo)
db.connect();


//middleware
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
    res.sendFile(__dirname + "/public/app.html");
  })

app.get("/recipes", async (req, res) => {
  res.sendFile(__dirname + "/public/recipes.html");
})

//MENU API Endpoints////////////////////////////////////////////////////////////////////////////////////////////////
async function getMenuItem(menuID){
  const result = await db.query("SELECT * FROM menu WHERE id = " + menuID + ";");
  return result.rows[0];
}

app.delete("/api/unlinkMenuItem/:id", async (req, res) => {
  const deleteId = parseInt(req.params.id);
  unlinkMenuItem(deleteId);
  //menu = menu.filter((menu) => menu.id != deleteId);
  res.send("Item Removed");

})

async function unlinkMenuItem(itemId){
  const deleteItem = await getMenuItem(itemId);
  const menuDelete = await db.query("DELETE FROM menu WHERE id = " + itemId + ";");
}


app.delete("/api/menu/:id", async (req, res) => {
  const deleteId = parseInt(req.params.id);
  removeMenuItem(deleteId);
  //menu = menu.filter((menu) => menu.id != deleteId);
  res.send("Item Removed");

})

async function removeMenuItem(itemId){
  const deleteItem = await getMenuItem(itemId);
  const recipeDelete = await db.query("DELETE FROM recipes WHERE id = " + deleteItem.recipe + ";");
  const menuDelete = await db.query("DELETE FROM menu WHERE id = " + itemId + ";");
}

app.get("/api/menu", async (req, res) => {
    const result = await db.query("SELECT * FROM menu ORDER BY category,title;");
    //console.log(result.rows);
    res.json(result.rows);
  })

app.get("/api/menu/inventory", async (req, res) => {
  const menu = await db.query("SELECT * FROM menu;");
  let inventory = await getList("inventory");
  var cookable = [];

  for (let i=0; i<menu.rows.length; i++){
    let ingredients = [];
    let recipe = await getRecipe(menu.rows[i].recipe);
    recipe.ingredients.forEach((ingredient) => {
      if (ingredient.essential){
        ingredients.push(ingredient.name);
      }  
    })
    //console.log(haveAllIngredients(ingredients, inventory));
    //console.log(ingredients);
    //console.log(inventory);
    if (haveAllIngredients(ingredients, inventory)){
      cookable.push(menu.rows[i]);
    }
  }
  //console.log(cookable);    
  res.json(cookable);
})

//return ingredients that are not in any complete recipe
app.get("/api/jigsaw", async (req, res) => {
  const menu = await db.query("SELECT * FROM menu;");
  let inventory = await getList("inventory");
  var cookable = [];

  for (let i=0; i<menu.rows.length; i++){
    let ingredients = [];
    let recipe = await getRecipe(menu.rows[i].recipe);
    recipe.ingredients.forEach((ingredient) => {
      if (ingredient.essential){
        ingredients.push(ingredient.name);
      }  
    })
    if (haveAllIngredients(ingredients, inventory)){
      for (let w=0; w<ingredients.length; w++){
        cookable.push(ingredients[w]);
      }
    }
  }

  console.log(cookable);
  //subtract cookable ingredients from inventory
  for (let k=0;k<cookable.length;k++){
    inventory = inventory.filter(e => e != cookable[k]);
  }

  let jigsawReport = [];
  let recipes = await getRecipes();

  //parse ingredients;
  recipes.forEach((recipe) => {
    recipe.ingredients = JSON.parse(recipe.ingredients);
  })
  
  for (let x=0; x<inventory.length; x++){
    jigsawReport.push({
      ingredient: inventory[x],
      recipes: getRecipesUsingIngredient(inventory[x],recipes)
      }
    )
  }
  
  res.json(jigsawReport);
});

function getRecipesUsingIngredient(ingredient, recipes){
  let ingredientRecipes = [];
  for (let i=0; i<recipes.length; i++){
    if (isIngredientUsed(ingredient, recipes[i])){
      ingredientRecipes.push(recipes[i]);
    }
  }
  return ingredientRecipes;
}

function isIngredientUsed(ingredient, recipe){
  for (let i=0; i<recipe.ingredients.length; i++){
    if (recipe.ingredients[i].name == ingredient){
      return true;
    }
  }
  return false;
}

function haveAllIngredients(ingredients, inventory){
  for (let i=0;i<ingredients.length;i++){
    if (!inventory.includes(ingredients[i])){
      return false;
    }
  }
  return true;
}

app.get("/api/menu/:id", async (req, res) => {
  const menuId = parseInt(req.params.id);
  const menuItem = await getMenuItem(menuId);
  res.json(menuItem);
})



//Recipe API Endpoints////////////////////////////////////////////////////////////////////////////////////////////////

app.delete("/api/recipe/:id", async (req, res) => {
  const deleteId = parseInt(req.params.id);
  removeRecipe(deleteId);
  //menu = menu.filter((menu) => menu.id != deleteId);
  res.send("Item Removed");

})

async function removeRecipe(itemId){
  const deleteItem = await getRecipe(itemId);
  //make sure to remove all linked menu items
  if (deleteItem.id){
    const menuDelete = await db.query("DELETE FROM menu WHERE recipe = " + deleteItem.id + ";");
    const recipeDelete = await db.query("DELETE FROM recipes WHERE id = " + deleteItem.id + ";");
  }
}

app.get("/api/recipe", async (req, res) => {
  const query = "SELECT * FROM recipes ORDER BY title;";
  const result = await db.query(query);

  //console.log(result);
  let response = [];
    for (let i = 0; i< result.rows.length; i++){
      let ingredients = JSON.parse(result.rows[i].ingredients);
      response.push({
        id: result.rows[i].id,
        title: result.rows[i].title,
        cookTime: result.rows[i].cooktime,
        ingredients: ingredients,
        directions: result.rows[i].directions
      });
    }

  res.json(response);
})


app.get("/api/recipe/:id", async (req, res) => {
  const recipeId = parseInt(req.params.id);
  
  const query = "SELECT * FROM recipes WHERE id = " + recipeId + ";";
  const result = await db.query(query);

  //console.log(result);

  let ingredients = JSON.parse(result.rows[0].ingredients);

  const response = {
    id: result.rows[0].id,
    title: result.rows[0].title,
    cookTime: result.rows[0].cooktime,
    ingredients: ingredients,
    directions: result.rows[0].directions
  }
  res.json(response);
})

app.put("/api/recipe/", async (req, res) => {

  console.log("PUT REQUEST RECIEVED");
  const valueString = "'" + req.body.title + "','" + req.body.cookTime + "','" + JSON.stringify(req.body.ingredients) + "','" + req.body.directions + "'";
  const query = "INSERT INTO recipes (title,cooktime,ingredients,directions) VALUES (" + valueString + ") RETURNING *;";
  const result = await db.query(query);

  if (req.body.category){
    const menuValueString = "'" + req.body.title + "','" + req.body.category + "'," + result.rows[0].id;
    const menuQuery = "INSERT INTO menu (title, category, recipe) VALUES (" + menuValueString + ")";
    const menuResult = await db.query(menuQuery);
  }
  console.log(result.rows[0]);

  let ingredients = JSON.parse(result.rows[0].ingredients);

  
  const response = {
    id: result.rows[0].id,
    title: result.rows[0].title,
    cookTime: result.rows[0].cooktime,
    ingredients: ingredients,
    directions: result.rows[0].directions
  }

  res.json(response); 
})

app.post("/api/menu/add", async (req, res) => {
  const menuValueString = "'" + req.body.title + "','" + req.body.category + "'," + req.body.recipe;
  const menuQuery = "INSERT INTO menu (title, category, recipe) VALUES (" + menuValueString + ")";
  console.log(menuQuery);
  const menuResult = await db.query(menuQuery);
  res.json(menuResult);
})

app.put("/api/recipe/:id", async (req, res) => {
  const recipeId = parseInt(req.params.id);
  const valueString = "title = '" + req.body.title + "', cookTime = '" + req.body.cookTime + "', ingredients = '" + JSON.stringify(req.body.ingredients) + "', directions = '" + req.body.directions + "'";
  const query = "UPDATE recipes SET " + valueString + " WHERE id = " + recipeId + ";";
  
  console.log(query);
  const result = await db.query(query);

  //console.log(result);

  res.json(result.rows[0]); 
})

async function getRecipe(recipeID){
  const query = "SELECT * FROM recipes WHERE id = " + recipeID + ";";

  const result = await db.query(query);

  //console.log(result);

  let ingredients = JSON.parse(result.rows[0].ingredients);

  const response = {
    id: result.rows[0].id,
    title: result.rows[0].title,
    cookTime: result.rows[0].cooktime,
    ingredients: ingredients,
    directions: result.rows[0].directions
  }

  return response;
}

//note: returns ingredients as json string;
async function getRecipes(){
  const query = "SELECT * FROM recipes;";
  const result = await db.query(query);
  return result.rows;
}

//Grocery/Inventory API Endpoints////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/api/grocery", async (req, res) => {
  const result = await getList("grocery");
  res.json(result);
});

app.get("/api/inventory", async (req, res) => {
  const result = await getList("inventory");
  res.json(result);
});

app.put("/api/grocery", async (req, res) => {
  console.log(req.body);
  addToGroceryListIfNotInInventory(req.body);
  res.send("SUCESSFUL");
});

app.put("/api/grocery/force", async (req, res) => {
  console.log(req.body);
  addToList(req.body, "grocery");
  res.send("SUCESSFUL");
});

app.put("/api/grocery/buy", async (req, res) => {
  console.log(req.body);
  const groceryList = await getList("grocery");
  addToList(groceryList, "inventory");
  removeFromList(groceryList, "grocery");
  res.send("SUCESSFUL");
});

app.put("/api/inventory", async (req, res) => {
  console.log(req.body);
  addToList(req.body, "inventory");
  res.send("SUCESSFUL");
});

app.delete("/api/grocery", async (req, res) => {
  console.log(req.body);
  removeFromList(req.body, "grocery");
  res.send("SUCESSFUL");
});

app.delete("/api/inventory", async (req, res) => {
  console.log(req.body);
  removeFromList(req.body, "inventory");
  res.send("SUCESSFUL");
});

async function getList(listID){
  const result = await db.query("SELECT * FROM " + getListTableName(listID) + " ORDER BY name;");
  let theList = [];
  for (let i=0; i<result.rows.length; i++){
    theList.push(result.rows[i].name);
  }
  return theList;
}

async function addToList(items, listID){
  let currentList = await getList(listID);
  console.log(currentList);
  let query = "INSERT INTO " + getListTableName(listID) + " (name) VALUES ";
  let valuesList = ""
  console.log(items);
  for (let i = 0; i<items.length; i++){
    if (!currentList.includes(items[i])){
      //let result = await db.query("INSERT INTO " + getListTableName(listID) + " (name) VALUES ('" + items[i] + "');");
      valuesList = valuesList + "('" + items[i] + "')"
      //console.log(valuesList);
      //console.log(items.length);
      //don't put comma's after final item
      if (i != items.length - 1){
        valuesList = valuesList + ",";
      }
    }
  }
  //if final character is , in values list, pull it off
  if (valuesList.slice(valuesList.length - 1) == ","){
    valuesList = valuesList.slice(0, valuesList.length -1);
  }
  if (valuesList.length){
    query = query + valuesList + ";";
    console.log(query);
    let result = await db.query(query);
  }
}

async function addToGroceryListIfNotInInventory(items){
  let inventoryList = await getList("inventory");
  let pushList = []
  for (let i = 0; i<items.length; i++){
    if (!inventoryList.includes(items[i])){
      pushList.push(items[i]);
    }
  }
  if (pushList.length > 0){
    console.log(pushList);
    addToList(pushList, "grocery");
  }
}

async function removeFromList(items, listID){
  let query = "";
  for (let i = 0; i<items.length; i++){
    //let result = await db.query("DELETE FROM " + getListTableName(listID) + " WHERE name = '" + items[i] +"';");
    query = query + "DELETE FROM " + getListTableName(listID) + " WHERE name = '" + items[i] +"'; "
  }
  console.log(query);
  let result = await db.query(query);
}

function getListTableName(listID){
  if (listID == "grocery"){
    return "grocery_list";
  } else if (listID == "inventory"){
    return "inventory"; 
  }
}

//listener///////////////////////////////////////////////////////////////////////////////////

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  //Menu Library Functions*********************************************************************

function getMenuCategoryIndex(itemCategory){
  /*Returns -1 if category not found */
  for (let categoryIndex = 0; categoryIndex < menu.length; categoryIndex++){
    if (itemCategory == menu[categoryIndex].category){
      return categoryIndex;
    }
  }
  return -1;
}