// in this file we will define a schema for connection between the 2 users

const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema({
    // now we will define what is there in a connection request what exactly we are going to store here is there is a user who is sending the connection request to another user so for that we will need the identity of both the sender and reciever and we also want the status of that connection request

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignore", "interested", "accepted", "rejected"],
            message: `{VALUE} is not supported`
        },
        required: true
    }
}, {
    timestamps: true
});

// schema validation dekhenge kaise kaarte hai toh , yaha apan check karenge ki toUserId is not same as fromUserId 

connectionRequestSchema.pre("save", function (){
    // ye .pre mtlb ye main code me jaha apan .save kaar rahe hai uske pehle run hooga/ check hooga
    const connectionRequest = this

    // check if fromUserId is same as ToUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error ("cannot send connection request to yourself")
    }
    next();
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequestModel", connectionRequestSchema)

module.exports = ConnectionRequestModel