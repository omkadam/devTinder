const validator = require('validator')

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error ("Firstname or lastname required")
    } else if (!validator.isEmail(emailId)){
        throw new Error ("Email id not valid")
    } else if(!validator.isStrongPassword(password)){
        throw new Error ("enter strong password")
    }
}

module.exports = validateSignUpData;