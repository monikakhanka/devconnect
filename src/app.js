const express = require("express");
const connectDB = require("./config/database")
const User = require("./models/user");
const validator = require("validator");
const validateSignUpData = require("./utils/validation");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

// sign up api for adding user in db
app.post("/signup", async (req, res) => {

    try{
    // validation of data 
    validateSignUpData(req);

    const {password, firstName, lastName, emailId} = req.body;
    // encryption of password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const user = new User({
        firstName, 
        lastName,
        password: passwordHash,
        emailId 
    });

    await user.save();
    res.send("user added sucessfully");
    }catch(err){
        res.status(400).send("error adding user to db:" + err.message);
    }
});


// post api to login the user
app.post("/login", async (req, res) => {
    const { emailId, password } = req.body;
    try{
    const user = await User.findOne({emailId: emailId});

        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){
            res.send("user successfully logged in");
        }else{
            throw new Error("Invalid credentials")
        }
    }catch(err){
        res.status(400).send("Error "+ err);
    }
});


// get a user from db using email id
app.get("/user", async (req, res) => {
    const userEmail= req.body.emailId;
    try {
        const user = await User.findOne({emailId : userEmail});
        if(!user){
            res.status(404).send("user not found");
        }else{
            res.send(user);
        }
    }catch(err){
        res.status(400).send("something went wrong");
    }
})

// get all users from the db
app.get("/feed", async(req, res) => {
  try{
    const users = await User.find({});
    res.send(users);
  }catch(err){
    res.status(400).send("error getting data"+ err);
  }
});


// delete a user from db 
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;

    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("user successfully deleted");
    }catch(err){
        res.status(400).send("Something went wrong");   
    }
});

// updating a user in db using findByIdAndUpdate
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try{
        
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender","skills"];
    const isUpdateAllowed = Object.keys(data).every((k)=> ALLOWED_UPDATES.includes(k));
    
    if(!isUpdateAllowed){
        throw new Error("Update not allowed");
    }

    const user = await User.findByIdAndUpdate(userId, data, {returnDocument: "after", runValidators: true});
    console.log(user);
    res.send("user data updated");

    }catch(err){
        res.status(400).send("Something went wrong "+ err.message);   
    }

});

// finding a user with emailId and updating it
app.patch("/user", async (req, res) => {
    const emailId = req.body.emailId;
    const data = req.body;
    try{
    const user = await User.findOneAndUpdate({emailId: emailId}, data);
    console.log(user);
    res.send("user data updated");

    }catch(err){
        res.status(400).send("Something went wrong");   
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
