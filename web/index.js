import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dbInfo from "./database.js";
import authInfo from "./auth.js";
console.log(authInfo);

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
//import fs from "fs";
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 500,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
 })

const app = express();
const port = 3500;

//connect to database
const db = new pg.Client(dbInfo)
db.connect();


//middleware
app.use(limiter);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(authorize);


//Authenticator Middleware
async function authorize(req, res, next){
  if (authInfo.reverseProxy === true){
    try {
      let username = req.headers[authInfo.userHeader];
      if (username !== undefined){
        req.userId = await getOrCreateUser(username);
        next();
        return;
      }
    } catch {
      res.status(500).send("Authentication Error");
      return;
    }
  }

  //forced/disabled auth
  if (authInfo.user){
    req.userId = await getOrCreateUser(authInfo.user);
    next();
    return;
  }

  //If no other authentication method completes, send unauthorized
  res.sendFile(__dirname + "/views/login.html")
}

async function getOrCreateUser(username){
    let userId = await getUserID(username);
    if (userId === ""){
      userId = await createUser(username);
    }
    return userId
}

async function getUserID(username){
  let query = "SELECT * FROM users WHERE username = $1";
  let result = await db.query(query,[username]);
  if (!result.rows.length){
    return "";
  } else {
    return result.rows[0].id;
  }
}

async function createUser(username){
  let query = "INSERT INTO users (username) VALUES ($1) RETURNING *";
  let result = await db.query(query,[username]);
  if (!result.rows.length){
    console.log("USER CREATION FAILED");
    return null;
  } else {
    return result.rows[0].id;
  }
}

//GET for main pages
app.get("/", async (req, res) => {
    res.sendFile(__dirname + "/views/app.html");
  })

app.get("/recipes", async (req, res) => {
  res.sendFile(__dirname + "/views/recipes.html");
})

//MENU API Endpoints////////////////////////////////////////////////////////////////////////////////////////////////
async function getMenuItem(menuID, userId){
  const result = await db.query("SELECT * FROM menu WHERE id = " + menuID + " AND userid = $1;", [userId]);
  return result.rows[0];
}

app.delete("/api/unlinkMenuItem/:id", async (req, res) => {
  const deleteId = parseInt(req.params.id);
  unlinkMenuItem(deleteId, req.userId);
  //menu = menu.filter((menu) => menu.id != deleteId);
  res.send("Item Removed");

})

async function unlinkMenuItem(itemId, userId){
  const menuDelete = await db.query("DELETE FROM menu WHERE id = $1 AND userid = ;",[itemId, userId]);
}


app.delete("/api/menu/:id", async (req, res) => {
  const deleteId = parseInt(req.params.id);
  removeMenuItem(deleteId, req.userId);
  //menu = menu.filter((menu) => menu.id != deleteId);
  res.send("Item Removed");

})

async function removeMenuItem(itemId, userId){
  const deleteItem = await getMenuItem(itemId, userId);
  const recipeDelete = await db.query("DELETE FROM recipes WHERE id = $1 AND userid = $2;",[deleteItem.recipe, userId]);
  const menuDelete = await db.query("DELETE FROM menu WHERE id = $1 AND userid = $2;", [itemId, userId]);
}

app.get("/api/menu", async (req, res) => {
    const result = await db.query("SELECT * FROM menu WHERE userid = $1 ORDER BY category,title;", [req.userId]);
    res.json(result.rows);
  })

app.get("/api/menu/inventory", async (req, res) => {
  const menu = await db.query("SELECT * FROM menu WHERE userid = $1 ORDER BY category,title;", [req.userId]);
  let inventory = await getList("inventory", req.userId);
  var cookable = [];

  for (let i=0; i<menu.rows.length; i++){
    let ingredients = [];
    let recipe = await getRecipe(menu.rows[i].recipe, req.userId);
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
  const menu = await db.query("SELECT * FROM menu WHERE userid = $1;", [req.userId]);
  let inventory = await getList("inventory", req.userId);
  var cookable = [];

  for (let i=0; i<menu.rows.length; i++){
    let ingredients = [];
    let recipe = await getRecipe(menu.rows[i].recipe, req.userId);
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

  //console.log(cookable);
  //subtract cookable ingredients from inventory
  for (let k=0;k<cookable.length;k++){
    inventory = inventory.filter(e => e != cookable[k]);
  }

  let jigsawReport = [];
  let recipes = await getRecipes(req.userId);

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
  const menuItem = await getMenuItem(menuId, req.userId);
  res.json(menuItem);
})



//Recipe API Endpoints////////////////////////////////////////////////////////////////////////////////////////////////

app.delete("/api/recipe/:id", async (req, res) => {
  const deleteId = parseInt(req.params.id);
  removeRecipe(deleteId, req.userId);
  //menu = menu.filter((menu) => menu.id != deleteId);
  res.send("Item Removed");

})

async function removeRecipe(itemId, userId){
  const deleteItem = await getRecipe(itemId, userId);
  //make sure to remove all linked menu items
  if (deleteItem.id){
    const menuDelete = await db.query("DELETE FROM menu WHERE recipe = $1 AND userId = $2;", [deleteItem.id, userId]);
    const recipeDelete = await db.query("DELETE FROM recipes WHERE id = $1 AND userId = $2;", [deleteItem.id, userId]);
  }
}

app.get("/api/recipe", async (req, res) => {
  const query = "SELECT * FROM recipes WHERE userid = $1 ORDER BY title;";
  const result = await db.query(query, [req.userId]);

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
  
  const query = "SELECT * FROM recipes WHERE id = $1 AND userid = $2;";
  const result = await db.query(query, [recipeId, req.userId]);

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
  const query = "INSERT INTO recipes (title,cooktime,ingredients,directions,userid) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
  const result = await db.query(query, [req.body.title, req.body.cookTime, JSON.stringify(req.body.ingredients), req.body.directions, req.userId]);

  if (req.body.category){
    const menuQuery = "INSERT INTO menu (title, category, recipe, userid) VALUES ($1, $2, $3, $4)";
    const menuResult = await db.query(menuQuery, [req.body. title,req.body.category, result.rows[0].id, req.userId]);
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
  const menuQuery = "INSERT INTO menu (title, category, recipe, userid) VALUES ($1, $2, $3, $4)";
  console.log(menuQuery);
  const menuResult = await db.query(menuQuery,[req.body.title, req.body.category, req.body.recipe, req.userId]);
  res.json(menuResult);
})

app.put("/api/recipe/:id", async (req, res) => {
  const recipeId = parseInt(req.params.id);
  const query = "UPDATE recipes SET \
      title = $1, \
      cookTime = $2, \
      ingredients = $3, \
      directions = $4 \
    WHERE id = $5 \
    AND userid = $6;";
  
  console.log(query);
  const result = await db.query(query, [req.body.title, req.body.cookTime, JSON.stringify(req.body.ingredients), req.body.directions, recipeId, req.userId]);

  //console.log(result);

  res.json(result.rows[0]); 
})

async function getRecipe(recipeID, userId){
  const query = "SELECT * FROM recipes WHERE id = $1 AND userid = $2;";

  const result = await db.query(query, [recipeID, userId]);

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
async function getRecipes(userId){
  const query = "SELECT * FROM recipes WHERE userid = $1;";
  const result = await db.query(query, [userId]);
  return result.rows;
}

//Grocery/Inventory API Endpoints////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/api/grocery", async (req, res) => {
  const result = await getList("grocery", req.userId);
  res.json(result);
});

app.get("/api/inventory", async (req, res) => {
  const result = await getList("inventory", req.userId);
  res.json(result);
});

app.put("/api/grocery", async (req, res) => {
  console.log(req.body);
  await addToGroceryListIfNotInInventory(cleanArray(req.body), req.userId);
  res.send("SUCESSFUL");
});

app.put("/api/grocery/force", async (req, res) => {
  console.log(req.body);
  await addToList(cleanArray(req.body), "grocery", req.userId);
  res.send("SUCESSFUL");
});

app.put("/api/grocery/buy", async (req, res) => {
  console.log(req.body);
  const groceryList = await getList("grocery", req.userId);
  addToList(groceryList, "inventory", req.userId);
  await removeFromList(groceryList, "grocery", req.userId);
  res.send("SUCESSFUL");
});

app.put("/api/inventory", async (req, res) => {
  console.log(req.body);
  await addToList(cleanArray(req.body), "inventory", req.userId);
  res.send("SUCESSFUL");
});

app.delete("/api/grocery", async (req, res) => {
  let items = cleanArray(req.body);
  console.log(items);
  removeFromList(items, "grocery", req.userId);
  res.send("SUCESSFUL");
});

app.delete("/api/inventory", async (req, res) => {
  console.log(req.body);
  removeFromList(cleanArray(req.body), "inventory", req.userId);
  res.send("SUCESSFUL");
});

async function getList(listID, userId){
  const result = await db.query("SELECT * FROM " + getListTableName(listID) + " WHERE userid = $1 ORDER BY name;",[userId]);
  let theList = [];
  for (let i=0; i<result.rows.length; i++){
    theList.push(result.rows[i].name);
  }
  return theList;
}

async function addToList(items, listID, userId){
  let currentList = await getList(listID, userId);
  console.log(currentList);
  let query = "INSERT INTO " + getListTableName(listID) + " (name, userid) VALUES ($1,$2)";
  if (typeof(items) !== "string"){
    for (let i=0; i<items.length;i++){
      if (currentList.filter(e => e == items[i]).length == 0){
        let result = await db.query(query, [items[i], userId]);
      }
    }
  }
}

async function addToGroceryListIfNotInInventory(items, userId){
  let inventoryList = await getList("inventory", userId);
  let pushList = []
  if (typeof(items) !== "string"){
    for (let i = 0; i<items.length; i++){
      if (!inventoryList.includes(items[i])){
        pushList.push(items[i]);
      }
    }
    if (pushList.length > 0){
      console.log(pushList);
      await addToList(pushList, "grocery", userId);
    }
  }
}

async function removeFromList(items, listID, userId){
  if (typeof(items) !== "string"){
    for (let i=0;i<items.length;i++){
      let query = "DELETE FROM " + getListTableName(listID) + " WHERE name = $1 AND userid = $2";
      let result = await db.query(query,[items[i], userId]);
    }
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

function cleanArray(variable){
  if (!(variable instanceof Array)) { // Prevents DoS.
    return [];
  }
  return variable;
}