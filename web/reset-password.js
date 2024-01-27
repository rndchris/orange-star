import bcrypt from "bcryptjs";
import pg from "pg";
import dbInfo from "./database.js";

//connect to database
const db = new pg.Client(dbInfo)
db.connect();

async function setPassword(userId,password){
    let query = "INSERT INTO auth (id, salt, password) VALUES ($1,$2,$3)"
    var salt = bcrypt.genSaltSync(10);
    
    password = bcrypt.hashSync(password, salt);
  
    try {
        let result = await db.query(query, [userId,salt,password]);
        console.log("PASSWORD SET")
    } catch (error) {
        console.log(error);
        query = "UPDATE auth SET salt=$1,password=$2 WHERE id=$3";
        let result = await db.query(query, [salt, password, id]);
    }
  }
