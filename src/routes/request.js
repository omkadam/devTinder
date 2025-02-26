// all the connection requests related api will be handled here

const express = require('express')
const User = require('../models/user')
const requestRouter = express.Router()
const userAuth = require('../middleware/auth')

requestRouter.post('.sendConnectionRequest', userAuth,  async (req,res) => {
    const user = req.user
    console.log('sending a connection req')
    res.send(user.firstName + "sent the connection request")
})

module.exports = requestRouter