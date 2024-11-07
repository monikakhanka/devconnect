const express = require("express");
const requestsRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestsRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res)=>{
    try{
        // coming from userAuth
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // status validation
        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status type: "+status});
        }

        // check if toUserId exist in db or not
         const toUserExistsInDb = await User.findById(toUserId);
         if(!toUserExistsInDb){
             return res.status(404).json({message: "Requested user not found!"})
         } 

        // check if requesting self
        // if(fromUserId == toUserId){
        //     return res.status(400).json({message: "Invalid connection request!!"});
        // }

       
        // check if the connection request already exist
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [{fromUserId, toUserId}, {fromUserId: toUserId, toUserId: fromUserId}] 
        });

        if(existingConnectionRequest){
            return res.status(400).json({message: "Connection request already sent"});
        }


        const connectionRequest = new ConnectionRequest({
            fromUserId, 
            toUserId,
            status
        });

        const connectionData = await connectionRequest.save();
        res.json({
            message: toUserExistsInDb.firstName+" is "+ status +" by "+req.user.firstName  ,
            data: connectionData
        });

    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }

});


requestsRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) =>{
 try{
    const loggedInUser = req.user;
    const { status, requestId} = req.params;
    
    // validate status
    const allowedStatus = ["accepted", "rejected"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({message: "Status not allowed"});
    }

    const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
    });

    if(!connectionRequest){
        return res.status(404).json({message: "Connection request not found"});
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();
    res.json({message: "Connection request "+ status, data});

 }catch(err){
    res.status(400).send("ERROR: "+ err.message);
 }      
})


module.exports = requestsRouter;