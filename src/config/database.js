const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const connectDB = async() => {
    await mongoose.connect("mongodb+srv://monika:W4xLd3jXYEUe6nsa@cluster0.rshmv.mongodb.net/devConnect");
};



module.exports = connectDB;
