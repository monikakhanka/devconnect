const express = require("express");
const profileRouter = express.Router();

const {userAuth} = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
const { findOneAndUpdate } = require("../models/user");

profileRouter.get("/profile/view", userAuth, async(req, res)=>{

    // here first userAuth middleware will be called to authenticate the user using jwt token
    // middleware will return the user in req.user which is send in response
    try{
    const user = req.user;    
    res.send(user);
    }catch(err){
        res.status(400).send("Error: "+ err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res)=>{
    try{
        if(!validateProfileEditData(req)){
            throw new Error("Invalid Edit data");
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key] ));

        await loggedInUser.save();
        res.json({message: `${loggedInUser.firstName}, your profile updated successfully`, data: loggedInUser});
    }catch(err){
        res.status(400).send("ERROR:"+ err.message);
    }
})


module.exports = profileRouter;