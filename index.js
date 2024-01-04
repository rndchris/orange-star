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

app.get("/api/menu", async (req, res) => {
    res.json(menu);
  })

app.get("/", async (req, res) => {
    res.sendFile(__dirname + "/public/app.html");
  })

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });