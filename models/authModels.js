const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, "Username is mandatory and must be unique"],
        unique: true
    },

    password: {
        type: String,
        require: [true, "Password is mandatory"]
    }
})

const User = mongoose.model("User", userSchema);
module.exports = User


