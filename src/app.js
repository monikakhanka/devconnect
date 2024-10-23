const express = require("express");
const connectDB = require("./config/database")
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
    console.log(req.body);

    const {firstName, lastName, emailId, password } = req.body;
    const user = new User(req.body);

    try{
        await user.save();
    res.send("user added sucessfully");
    }catch(err){
        res.status(400).send("error adding user to db:" + err.message);
    }
});


connectDB().then(()=>{
    console.log("Database connection successful");
    app.listen(3000, ()=>{
        console.log("Server listening")
    });
})
.catch(err => {
    console.log("Db cannot be connected");
})
