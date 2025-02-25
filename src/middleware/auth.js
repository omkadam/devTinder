const jwt = require('jsonwebtoken')
const User = require("../models/user")

const userAuth = async (req,res,next) => {
    try {
        const {token} = req.cookies
        const decodedObj = await jwt.verify(token, "KADAM@13")
        const {_id} = decodedObj
        const user = await User.findById(_id)
        if(!user){
            throw new Error ("User does not found")
        }
        req.user = user
        next()
    } catch (error) {
        throw new Error ("something went wrong")
    }
}

module.exports = userAuth;