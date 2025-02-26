const express = require('express')
const User = require('../models/user')
const userAuth = require('../middleware/auth')
const {validateEditProfileData} = require('../utils/validation')
const profileRouter = express.Router()

// this is a profile view api
profileRouter.get('/profile/view', userAuth, async (req,res) => {
    try {
        const user = req.user;
        res.send(user)
    } catch (error) {
        res.status(400).send("ERROR")
    }
})


// this is the profile edit api

profileRouter.patch('/profile/edit', userAuth, async (req,res) => {
    try {
        if(!validateEditProfileData(req)){
            throw new Error ("invalid edit request")
        }
        const loggedInUser = req.user
        // aab joh abhi data user update karna chah raha hai woh req me aa raha hai toh abhi apan kya karenge ki woh saab keys ko loop karenge and jo jo key ka value change karna hai user ko woh karva dene ka logic likhenge
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))
        // now save the data into db
        await loggedInUser.save()
        
        res.send("profile edited successfully")
    } catch (error) {
        res.send("invalid edit req")
    }
})

module.exports = profileRouter;
