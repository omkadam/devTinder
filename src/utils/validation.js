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


const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills",
    ]

    // here we are looping through the req.body and checking for every field which is comming from req.body and if the field is includes inside the allowedEditFields array then go for edit

    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field))

    return isEditAllowed

}
module.exports = {validateSignUpData, validateEditProfileData};