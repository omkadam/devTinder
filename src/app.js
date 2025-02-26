const express = require('express');
const app = express();
const connectDb = require('./config/db')
const cookieParser = require('cookie-parser')


app.use(express.json());
app.use(cookieParser())


// import all the router over here

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')

// now we imported all our routes now how to use that routes? so to do so use app.use and pass your router as a middleware

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)





connectDb().then(() => {
    console.log("connected to db")
    app.listen(7777, () => {
        console.log("app is listening on port 7777")
    })
})
.catch((err) => {
    console.log("DB Error")
})







