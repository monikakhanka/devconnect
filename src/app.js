const express = require("express");
const {adminAuth, userAuth}  = require("./middlewares/auth");

const app = express();


// Handle Auth middleware
// handle admin auth
app.use("/admin", adminAuth);

// handle user auth
app.use("/user", userAuth, (req, res, next) => {
    res.send("All user data sent");
});

app.get("/admin/getAllData",(req, res, next) => {
    res.send("All data sent");
});

app.get("/admin/deleteUser", (req, res, next) => {
    res.send("Deleted user");
});



app.listen(3000, ()=>{
    console.log("Server listening")
});