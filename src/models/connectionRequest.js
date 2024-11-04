const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum:{
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        },
        required: true
    }
}, {timestamps: true});

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;

    // check if the user is same as sender
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot sent connection request to self");
    }

    next();
});

connectionRequestSchema.index({fromUserId: 1, toUserId: 1});
const connectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = connectionRequest;