const express = require("express");
const authRouter = express.Router();
const validateSignUpData = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {

    try{
    // validation of data 
    validateSignUpData(req);

    const {password, firstName, lastName, emailId} = req.body;
    // encryption of password
    const passwordHash = await bcrypt.hash(password, 10);

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


authRouter.post("/login", async (req, res) => {
    const { emailId, password } = req.body;
    try{
    const user = await User.findOne({emailId: emailId});

        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            const token = await user.getJWT();
            res.cookie("token", token)
            res.send("user successfully logged in");
        }else{
            throw new Error("Invalid credentials")
        }
    }catch(err){
        res.status(400).send("Error "+ err);
    }
});


module.exports = authRouter;
