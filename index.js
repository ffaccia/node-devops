const express = require('express');
const mongoose = require('mongoose');
const postRouter = require("./routes/postRoutes"
)

//import express from './node_modules/express';
const app = express();

const { MONGO_IP, MONGO_PORT, MONGO_USER, MONGO_PASSWORD } = require('./config/config');

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

app.use(express.json())



app.get("/", (req, res) => {
    res.send("<h1 style='color:#444'>Hi there you4! (started again from docker-compose)</h1>");
});

app.use("/api/v1/posts", postRouter )
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Process listening on port ${port}`));

