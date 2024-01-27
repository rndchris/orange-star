import Express from "express";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const app = Express();
const port = 3001;

app.use(cookieParser());
app.use(createSession);

async function createSession(userId, sessionLength = 0){
    let cookie = crypto.randomBytes(64).toString("hex");
    let query = "INSERT INTO sessions (userid, cookie, session_created) VALUES ($1,$2,$3);"
    try {
        await db.query(query, [userId, cookie])
    } catch (error) {
        console.log(error);
        cookie = "";
    }
    return cookie;
    //res.cookie("session", cookie, { httpOnly: true, maxAge: sessionLength});
}

async function getSession(cookie){
    let userId;
    let query = "SELECT id FROM sessions UPDATE SET last_seen = $1 WHERE cookie = $2"
    try {
        userId = await db.query(query, [Date(), cookie]);
    } catch (error) {
        console.log(error);
    }
    return userId;
}

async function endSession(cookie){
    let query = "DELETE FROM sessions WHERE cookie = $1";
    let result = await db.query(query, [cookie]);
}

async function clearAllSessions(userId){
    let query = "DELETE FROM sessions WHERE id = $1";
    let result = await db.query(query, [userId]);
}

async function setPassword(userId,password){
    let query = "INSERT INTO auth (id, salt, password) VALUES ($1,$2,$3)"
    var salt = bcrypt.genSaltSync(10);
    
    password = bcrypt.hashSync(password, salt);

    try {
        let result = await db.query(query, [userId,salt,password]);
    } catch (error) {
        console.log(error);
        query = "UPDATE auth SET salt=$1,password=$2 WHERE id=$3";
        let result = await db.query(query, [salt, password, id]);
    }
}

async function confirmPassword(userId, password){
    let query = "SELECT salt,password FROM auth WHERE id = $1"
    let result = await db.query(query, [userId]);
    //let salt = result.rows[0].salt;
    let hash = result.rows[0].password;

    if (bcrypt.compareSync(password, hash)){
        return true;
    } else {
        return false;
    }
}


app.get("/", async (req, res) => {
    console.log(req.cookies)
    res.render("login.ejs");
  })


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});