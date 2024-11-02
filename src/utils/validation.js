const validator = require("validator");

const validateSignUpData = (req) =>{

    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Please enter your name");
    }
    else if(firstName.length < 4 || firstName.length >50){
        throw new Error("Firstname should have 4 to 50 characters");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("enter a strong password");
    }
}

module.exports = validateSignUpData;