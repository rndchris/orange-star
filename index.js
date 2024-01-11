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
    res.json(menu);
  })

app.post("/api/menu/add", (req, res) => {
  console.log(req.body);
    const id = menu.length + 1;
    menu.push({
      id: id,
      title: req.body.title,
      category: req.body.category,
    });
  res.send("SUCCESS");
  });

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