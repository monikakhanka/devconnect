const express = require("express");
const requestsRouter = express.Router();
const {userAuth} = require("../middlewares/auth");

requestsRouter.post("/sendConnectionRequest", userAuth, async (req, res)=>{
    const user = req.user;
    console.log(user.firstName+" sending connection request");
    res.send(user.firstName+ " connection request sent");
});


module.exports = requestsRouter;