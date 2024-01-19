import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dbInfo from "./database.js";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
//import fs from "fs";
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 500, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
})

const app = express();
const port = 3500;

//connect to database
const db = new pg.Client(dbInfo)
db.connect();


//middleware
app.use(limiter)
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
  const menuDelete = await db.query("DELETE FROM menu WHERE id = $1;",[itemId]);
}


app.delete("/api/menu/:id", async (req, res) => {
  const deleteId = parseInt(req.params.id);
  removeMenuItem(deleteId);
  //menu = menu.filter((menu) => menu.id != deleteId);
  res.send("Item Removed");

})

async function removeMenuItem(itemId){
  const deleteItem = await getMenuItem(itemId);
  const recipeDelete = await db.query("DELETE FROM recipes WHERE id = $1;",[deleteItem.recipe]);
  const menuDelete = await db.query("DELETE FROM menu WHERE id = $1;", [itemId]);
}

app.get("/api/menu", async (req, res) => {
    const result = await db.query("SELECT * FROM menu ORDER BY category,title;");
    res.json(result.rows);
  })

app.get("/api/menu/inventory", async (req, res) => {
  const menu = await db.query("SELECT * FROM menu ORDER BY category,title;");
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
    const menuDelete = await db.query("DELETE FROM menu WHERE recipe = $1;", [deleteItem.id]);
    const recipeDelete = await db.query("DELETE FROM recipes WHERE id = $1;", [deleteItem.id]);
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
  
  const query = "SELECT * FROM recipes WHERE id = $1;";
  const result = await db.query(query, [recipeId]);

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
  const query = "INSERT INTO recipes (title,cooktime,ingredients,directions) VALUES ($1, $2, $3, $4) RETURNING *;";
  const result = await db.query(query, [req.body.title, req.body.cookTime, JSON.stringify(req.body.ingredients), req.body.directions]);

  if (req.body.category){
    const menuQuery = "INSERT INTO menu (title, category, recipe) VALUES ($1, $2, $3)";
    const menuResult = await db.query(menuQuery, [req.body. title,req.body.category, result.rows[0].id]);
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
  const menuQuery = "INSERT INTO menu (title, category, recipe) VALUES ($1, $2, $3)";
  console.log(menuQuery);
  const menuResult = await db.query(menuQuery,[req.body.title, req.body.category, req.body.recipe]);
  res.json(menuResult);
})

app.put("/api/recipe/:id", async (req, res) => {
  const recipeId = parseInt(req.params.id);
  const query = "UPDATE recipes SET \
      title = $1, \
      cookTime = $2, \
      ingredients = $3, \
      directions = $4 \
    WHERE id = $5;";
  
  console.log(query);
  const result = await db.query(query, [req.body.title, req.body.cookTime, JSON.stringify(req.body.ingredients), req.body.directions, recipeId]);

  //console.log(result);

  res.json(result.rows[0]); 
})

async function getRecipe(recipeID){
  const query = "SELECT * FROM recipes WHERE id = $1;";

  const result = await db.query(query, [recipeID]);

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
  await addToGroceryListIfNotInInventory(req.body);
  res.send("SUCESSFUL");
});

app.put("/api/grocery/force", async (req, res) => {
  console.log(req.body);
  await addToList(req.body, "grocery");
  res.send("SUCESSFUL");
});

app.put("/api/grocery/buy", async (req, res) => {
  console.log(req.body);
  const groceryList = await getList("grocery");
  addToList(groceryList, "inventory");
  await removeFromList(groceryList, "grocery");
  res.send("SUCESSFUL");
});

app.put("/api/inventory", async (req, res) => {
  console.log(req.body);
  await addToList(req.body, "inventory");
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
  let query = "INSERT INTO " + getListTableName(listID) + " (name) VALUES ($1)";
  for (let i=0; i<items.length;i++){
    let result = await db.query(query, [items[i]]);
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
    await addToList(pushList, "grocery");
  }
}

async function removeFromList(items, listID){
  for (let i=0;i<items.length;i++){
    let query = "DELETE FROM " + getListTableName(listID) + " WHERE name = $1";
    let result = await db.query(query,[items[i]]);
  }
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