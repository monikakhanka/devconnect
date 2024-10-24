const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        validate(value){
            if(!["Male", "Female", "Others"].includes(value)){
                throw new Error("Gender data is invalid");
            }
        }
    },
    skills:{
        type: [],
    },
    photoUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNKfj6RsyRZqO4nnWkPFrYMmgrzDmyG31pFQ&s",
    },
    about:{
        type: String,
        maxlength: 100
    }
},{timestamps: true});

module.exports = mongoose.model("User", userSchema);