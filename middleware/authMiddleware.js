const protect = (req, res, next) => {
    const {user} = req.session;
    const user2 = req.session.user
    console.log("---òò---")
    console.log(user)
    console.log(user2)
    console.log(user);

    if(!user) 
        return res.status(401).json({status: "fail", message: "unauthorized"});
    
    req.user = user;

    next();
}

module.exports = protect;