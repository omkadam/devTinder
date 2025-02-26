// all the authentication related routes will be handled inside this file

// how to create an express router?
const express = require('express')
const {validateSignUpData} = require('../utils/validation')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authRouter = express.Router()


// previosly what we was doing is app.get, app.post etc so now insted of app. what we are going to do is authRouter.get,authRouter.post etc

authRouter.post('/signup', async (req,res) => {
    try {
        // validation of data
        validateSignUpData(req)
        const {firstName, lastName, emailId, password} = req.body
        // encrypt the password
        const passwordHash = await bcrypt.hash(password,10);
        const user = new User ({
            firstName: firstName,
            lastName: lastName,
            emailId: emailId,
            password: passwordHash
        })
        await user.save()
        res.send("user added success")
    } catch (error) {
        res.status(400).send("something went wrong")
    }
})

authRouter.post('/login', async (req,res) => {
    try {
        const {emailId, password} = req.body
        const user = await User.findOne({emailId:emailId})
        if(!user){
            throw new Error ("User not found")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(isPasswordValid){
            // create a json web token
            const token = await jwt.sign({_id: user._id}, "KADAM@13")
            // add token to cookie and send response back to user
            console.log(token)
            res.cookie("token", token)
            res.send("login success")
        } else {
            res.send("password didn't match")
        }
    } catch (error) {
        res.status(400).send("Error while login")
    }
})

authRouter.post('/logout', async (req,res) => {
    // here we are simply destroying the cookie
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("Logged out success")
})





module.exports = authRouter