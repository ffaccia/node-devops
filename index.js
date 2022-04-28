const express = require('express');
const mongoose = require('mongoose');

const session = require("express-session");
//const redis = require("redis")
let RedisStore = require("connect-redis")(session)

// redis@v4
const { createClient } = require("redis")




const postRouter = require("./routes/postRoutes")
const authRouter = require("./routes/authRoutes")

//import express from './node_modules/express';
const app = express();

const { MONGO_IP, MONGO_PORT, MONGO_USER, MONGO_PASSWORD, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');

let redisClient = createClient({
    legacyMode: true, 
    //host: REDIS_URL,
    //port: REDIS_PORT
    url: `${REDIS_URL}:${REDIS_PORT}` 
})
redisClient.connect().catch(console.error)

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
const connOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useFindAndModify: false
}

const connectWithRetry = () => {
    mongoose
        .connect(mongoURL, connOptions)
        //.connect("mongodb://francesco:password@mongo:27017/?authSource=admin")
        //.connect("mongodb://francesco:password@127.0.0.1:27017")
        .then(() => console.log("Successfully connected to MongoDb"))
        .catch((e) => {
            console.log(`Errors ${e} occurred in connecting to MongoDb`)
            setTimeout(connectWithRetry, 5000)
        })
}

connectWithRetry()

app.use(
    session({
    store: new RedisStore({client: redisClient}),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 60000
    }
}))

app.use(function (req, res, next) {
    if (!req.session) {
      return next(new Error("oh no! Connection lost!")) // handle error
    }
    next() // otherwise continue
  })


app.use(express.json())



app.get("/api/v1", (req, res) => {
    res.send("<h1 style='color:#444'>Hi there you4! (started again from docker-compose)</h1>");
});


app.use("/api/v1/posts", postRouter )
app.use("/api/v1/user", authRouter )
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Process listening on port ${port}`));

