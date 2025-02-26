// all the connection requests related api will be handled here

const express = require('express')
const User = require('../models/user')
const requestRouter = express.Router()
const userAuth = require('../middleware/auth')
const ConnectionRequest = require('../models/connectionRequests')

// this api is for to send the connection request to userID (from userID is the person who is loggedin already think about it..)
requestRouter.post('/request/send/:status/:toUserId', userAuth,  async (req,res) => {
    // as we are using middleware userAuth here toh apan ko req me user bhi milega kyu ki woh middleware me jaa ke dekho apan ne user ko send kiya hai waha se req.user = user and this req.user is the loggedin user

    try {
        const fromUserId = req.user._id
        // toUserId will come from your params 
        const toUserId = req.params.toUserId
        const status = req.params.status

        const allowedStatus = ["ignored", "interested"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status type"})
        }

        // check if the person exist in your db or not nhi toh attacker kuch bhi random id laa ke url me pass kar denge aur woh fake entry hoo jaegi

        const toUser = await User.findById(toUserId)
        if(!toUser){
            return res.status(404).json({message: "User does not exist in db and still you are making a req to that user"})
        }

        // check if there is an existing connection request
        
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId:fromUserId}
            ]
        })

        if (existingConnectionRequest) {
            return res.status(400).send({message: "connection request already exists"})
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const data = await connectionRequest.save()
        res.json({message: "connection req sent success", data})
    } catch (error) {
        res.status(400).send("ERROR" + error.message)
    }
})

module.exports = requestRouter