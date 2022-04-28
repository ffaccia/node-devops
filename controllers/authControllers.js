const User = require("../models/authModels");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {
    const { username, password } = req.body;
    //console.log(username);
    //console.log(password);
    const hashpassword = await bcrypt.hash(password, 12);
    //console.log(hashpassword);

    /* at first glance it may appears strange that i register new users without making a preemptive 
       check to see if that user already exists, but it's all done under the hood by mongo because
       username is set as unique, so inside try block and before status(201) i enter 'req.session.user = newUser"
    */
    try {
            const newUser = await User.create({
            username: username,
            password: hashpassword,
        });
        req.session.user = newUser;
        res.status(201).json({
            status: "success",
            data: {
                newUser,
            },
        });
    } catch (e) {
        res.status(400).json({
            status: "fail",
            error: e
        });
    }
}; 


exports.login = async (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    console.log(password);

    const user = await User.findOne({username: username});
    if (!user) {
        return res.status(404).json({
            status: "fail",
            message: `user ${username} not found!`
        });        
    }
    console.log("user pass=", user);
    const isCorrect = await bcrypt.compare(password, user.password);
    if(isCorrect) {
        req.session.user = user
        req.session.spaghetti = true

        res.status(200).json({
            status: "success"
        })
    } else {
        res.status(400).json({
            status: "fail",
            message: "incorrect username or password!"
        })
    }
}; 
 

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: "success",
            results: users.length,
            data: {
                users,
            },
        });
    } catch (e) {
        res.status(400).json({
            status: "fail",
        });
    }
};


exports.getOneUserId = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        console.log(user)
        res.status(200).json({
            status: "success",
            data: {
                user
            },
        });
    } catch (e) {
        res.status(400).json({
            status: "fail",
        });
    }
};

