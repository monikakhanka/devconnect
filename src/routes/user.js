const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const USER_SAFE_DATA = "firstName lastName photoUrl about skills age";

// get all the pending connection request for loggedIn user
userRouter.get("/user/requests/recieved", userAuth, async(req, res)=>{
    try{
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested"
    }).populate("fromUserId", USER_SAFE_DATA);
    // }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({message: "Connections requests of user: "+loggedInUser.firstName, data: connectionRequests});
    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }

});


// get all the connection where the status is accepted
userRouter.get("/user/connections", userAuth,async(req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [  
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA ).populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequest.map((row)=> {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({message: "Connections of "+ loggedInUser.firstName, data: data});
    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
});

userRouter.get("/user/feed", userAuth, async (req, res)=>{
    try{
        const loggedInUser = req.user;

        const page = req.query.page;
        let limit = req.query.limit;
        limit = limit > 50 ? 50: limit; 
        const skip = (page - 1) * limit;

        // find all connection requests(sent + received)
        const connectionRequest = await ConnectionRequest.find({
            $or: [{fromUserId: loggedInUser._id }, {toUserId: loggedInUser}]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((connReq) => {
            hideUsersFromFeed.add(connReq.fromUserId.toString());
            hideUsersFromFeed.add(connReq.toUserId.toString());
        });

        const users = await User.find({
            $and: [{_id: {$nin: Array.from(hideUsersFromFeed)}},
            { _id: {$ne: loggedInUser._id}}]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.json({data: users});

    }catch(err){
        res.status(400).json({message: "ERROR: "+ err.message});
    }
});

module.exports = userRouter;