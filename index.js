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

var menu = [
  {title: "Chips and Guac", id: 1, category: "Appetizers"},
  {title: "Trisuits and Hummus", id: 2, category: "Appetizers"},
  {title: "Mixed Nuts", id: 3, category: "Appetizers"},
  {title: "Frozen Fruit", id: 4, category: "Appetizers"},
  {title: "Rice and Beans", category: "Main Course"},
  {title: "Beef Stew", category: "Main Course"},
  {title: "Curry", category: "Main Course"},
  {title: "Chili", category: "Main Course"},
  {title: "Hot Chocolate", category: "Sweet Stuff"},
  {title: "Quick Bread", category: "Sweet Stuff"},
  {title: "Cake", category: "Sweet Stuff"},
  {title: "Ice Cream", category: "Sweet Stuff"},
];

app.get("/", async (req, res) => {
    res.sendFile(__dirname + "/public/app.html");
  })

//MENU API Endpoints////////////////////////////////////////////////////////////////////////////////////////////////
app.delete("/api/menu/:id", async (req, res) => {
  const deleteId = parseInt(req.params.id);
  menu = menu.filter((menu) => menu.id != deleteId);
  res.send("Item Removed");

})

app.get("/api/menu", async (req, res) => {
    const result = await db.query("SELECT * FROM menu;");
    console.log(result.rows);
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
    console.log(haveAllIngredients(ingredients, inventory));
    console.log(ingredients);
    console.log(inventory);
    if (haveAllIngredients(ingredients, inventory)){
      cookable.push(menu.rows[i]);
    }
  }
  console.log(cookable);    
  res.json(cookable);
})

function haveAllIngredients(ingredients, inventory){
  for (let i=0;i<ingredients.length;i++){
    if (!inventory.includes(ingredients[i])){
      return false;
    }
  }
  return true;
}

app.post("/api/menu/add", (req, res) => {
  console.log(req.body);
    const id = menu.length + 1;
    menu.push({
      id: id,
      title: req.body.title,
      category: req.body.category,
      recipe: req.body.recipe,
    });
  res.send("SUCCESS");
  });

//Recipe API Endpoints////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/api/recipe/:id", async (req, res) => {
  const recipeId = parseInt(req.params.id);
  
  const query = "SELECT * FROM recipes WHERE id = " + recipeId + ";";
  const result = await db.query(query);

  console.log(result);

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

  const menuValueString = "'" + req.body.title + "','" + req.body.category + "'," + result.rows[0].id;
  const menuQuery = "INSERT INTO menu (title, category, recipe) VALUES (" + menuValueString + ")";
  const menuResult = await db.query(menuQuery);

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
  const result = await db.query("SELECT * FROM " + getListTableName(listID));
  let theList = [];
  for (let i=0; i<result.rows.length; i++){
    theList.push(result.rows[i].name);
  }
  return theList;
}

async function addToList(items, listID){
  let currentList = await getList(listID);
  for (let i = 0; i<items.length; i++){
    if (!currentList.includes(items[i])){
      let result = await db.query("INSERT INTO " + getListTableName(listID) + " (name) VALUES ('" + items[i] + "');");
    }
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
  addToList(pushList, "grocery");
}

async function removeFromList(items, listID){
  for (let i = 0; i<items.length; i++){
    let result = await db.query("DELETE FROM " + getListTableName(listID) + " WHERE name = '" + items[i] +"';");
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