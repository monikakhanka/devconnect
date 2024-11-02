const express = require("express");
const profileRouter = express.Router();

const {userAuth} = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, async(req, res)=>{

    // here first userAuth middleware will be called to authenticate the user using jwt token
    // middleware will return the user in req.user which is send in response
    try{
    const user = req.user;    
    res.send(user);
    }catch(err){
        res.status(400).send("Error: "+ err.message);
    }
});


module.exports = profileRouter;