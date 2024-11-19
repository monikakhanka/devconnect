const express = require("express");
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation");
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

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
        expires: new Date(Date.now() + 8 *3600000),
        sameSite: 'None'
    });
    res.json({message: "User created successfully", data: savedUser});

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
            res.cookie("token", token, { sameSite: 'None'})
            res.send(user);
        }else{
            throw new Error("Invalid credentials")
        }
    }catch(err){
        res.status(400).send("Error: "+ err.message);
    }
});


authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null ,{
        expires: new Date(Date.now()),
        sameSite: 'None'    // set expiry to now
    });
    
    res.json({message: "user logged out successfully"});
});


module.exports = authRouter;
