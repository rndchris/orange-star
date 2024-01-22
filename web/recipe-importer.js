import pg from "pg";
import dbInfo from "./database.js";
import fs from "fs";

//connect to database
const db = new pg.Client(dbInfo)
db.connect();

const userId = 100;

var starterRecipes;
const filejson = fs.readFile("./starter-recipes.json", "utf8", (err, data) => {
    if (err) throw err;
    //console.log(JSON.parse(data));
    newUserRecipes(JSON.parse(data), userId);
    console.log("FINSHED");
})

async function newUserRecipes(starterRecipes, userId){
    for (let i=0; i<starterRecipes.length; i++){
      createRecipe(starterRecipes[i].title, starterRecipes[i].cookTime, starterRecipes[i].ingredients, starterRecipes[i].directions, userId, starterRecipes[i].category);
    }
  }
  
  async function createRecipe(title, cookTime, ingredients, directions, userId, category){
    const query = "INSERT INTO recipes (title,cooktime,ingredients,directions,userid) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
    const result = await db.query(query, [title, cookTime, JSON.stringify(ingredients), directions, userId]);
  
    if (category){
      const menuQuery = "INSERT INTO menu (title, category, recipe, userid) VALUES ($1, $2, $3, $4)";
      const menuResult = await db.query(menuQuery, [title, category, result.rows[0].id, userId]);
    }
  }
