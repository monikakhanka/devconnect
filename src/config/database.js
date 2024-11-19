const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;
const connectDB = async() => {
    await mongoose.connect(databaseUrl);
};



module.exports = connectDB;
