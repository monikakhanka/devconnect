const jwt = require("jsonwebtoken");
const User = require("../models/user");
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET; 

const userAuth = async (req, res, next) => {
    // Read token from req cookies
    // validate the token
    // find the user
    try{
    const {token} = req.cookies;
    if(!token){
        return res.status(401).send("Please log in")
    }
    // const decodedObj = await jwt.verify(token, "DEV@India$987");
    const decodedObj = await jwt.verify(token, jwtSecret);
    const {_id} = decodedObj;
    const user = await User.findById(_id);

    if(!user){
        throw new Error("User not found");
    }
    // attaching user to the request and returning it to next request
    req.user = user; 
    next();
}catch(err){
    res.status(400).send("ERROR"+ err.message);
}
};
module.exports = { userAuth };