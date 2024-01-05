import express from "express";
import bodyParser from "body-parser";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
//import fs from "fs";

const app = express();
const port = 3500;

//middleware
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var menu = [
    {
        category: "Appetizers",
        items: [
            {title: "Chips and Guac", id: 1},
            {title: "Trisuits and Hummus", id: 2},
            {title: "Mixed Nuts", id: 3},
            {title: "Frozen Fruit"}
        ]
    },
    {
        category: "Main Courses",
        items: [
            {title: "Rice and Beans"},
            {title: "Beef Stew"},
            {title: "Curry"},
            {title: "Chili"}
        ]
    },
    {
        category: "Sweet Stuff",
        items: [
            {title: "Hot Chocolate"},
            {title: "Quick Bread"},
            {title: "Cake"},
            {title: "Ice Cream"}
        ]
    },
];

app.get("/", async (req, res) => {
    res.sendFile(__dirname + "/public/app.html");
  })

//API Endpoints
app.delete("/api/menu/:id", async (req, res) => {
  //Remove menu item to be coded here
})

app.get("/api/menu", async (req, res) => {
    res.json(menu);
  })

app.post("/api/menu/add", (req, res) => {
  console.log(req.body);
  let categoryIndex = getMenuCategoryIndex(req.body.category);

  //create category if it doens't exist
  if (categoryIndex == -1){
    categoryIndex = menu.length + 1;
    menu.push({
      category: req.body.category,
      items: [{
        id: 1,
        title: req.body.title,
      }],
    });
    res.send("SUCCESS");
  } else {
  const newMenuItem = {
    id: menu[categoryIndex].items.length + 1,
    title: req.body.title,
  };
  menu[categoryIndex].items.push(newMenuItem);
  
  console.log("Item Added")
  console.log(newMenuItem)

  res.send("SUCCESS");
}

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