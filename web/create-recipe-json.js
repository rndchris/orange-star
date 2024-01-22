import pg from "pg";
import dbInfo from "./database.js";
import fs from "fs";

//connect to database
const db = new pg.Client(dbInfo)
db.connect();

writeJSON(62, "starter-recipes.json");

async function writeJSON(userId,filename){
  let recipes = await getRecipes(userId);
  fs.writeFile(filename,JSON.stringify(recipes),() => {
    console.log("happy?");
  })
  console.log("file written");
}

async function getRecipes(userId){
    const query = "SELECT * FROM recipes LEFT JOIN menu on menu.recipe=recipes.id WHERE recipes.userid = $1;";
    const result = await db.query(query, [userId]);
  
    //console.log(result);
    let response = [];
      for (let i = 0; i< result.rows.length; i++){
        let ingredients = JSON.parse(result.rows[i].ingredients);
        response.push({
          id: result.rows[i].id,
          title: result.rows[i].title,
          cookTime: result.rows[i].cooktime,
          ingredients: ingredients,
          directions: result.rows[i].directions,
          category: result.rows[i].category
        });
      }

    console.log(response);
  
    return response;
}
