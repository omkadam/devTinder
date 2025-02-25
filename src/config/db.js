// inside this file we will write logic to connect to our db

const mongoose = require('mongoose')

const connectDb = async () => {
    try {
        mongoose.connect("mongodb://localhost:27017/devTinder")
    } catch (error) {
        console.log("db error", error)
    }
}



module.exports = connectDb;