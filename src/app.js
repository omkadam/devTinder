const express = require('express');
const app = express();
const connectDb = require('./config/db')
const User = require('./models/user')
const validateSignUpData = require('./utils/validation')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const userAuth = require('./middleware/auth')

app.use(express.json());
app.use(cookieParser())


app.post('/signup', async (req,res) => {
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
        console.log("something went wrong while adding the user", error)
    }
})

app.get('/user', async (req,res) => {
    const userEmail = req.body.emailId
    try {
        const user = await User.find({emailId: userEmail})
        res.send(user)
    } catch (error) {
        console.log(error)
    }
})

app.get('/feed', async (req,res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        console.log(error)
    }
})

app.post('/login', async (req,res) => {
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

// now as we generated our token and pack that token into cookie now lets say we want to secure our /profile route then to do so..

app.get('/profile', userAuth, async (req,res) => {

    console.log("this is protected route and you are entered into it")
    res.send("this is protected route and you got your response as you are authenticated person")
})




connectDb().then(() => {
    console.log("connected to db")
    app.listen(7777, () => {
        console.log("app is listening on port 7777")
    })
})
.catch((err) => {
    console.log("DB Error")
})