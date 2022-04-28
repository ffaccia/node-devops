const express = require("express");

const authControllers = require("../controllers/authControllers");

const router = express.Router();


router
    .route("/signup")
    .post(authControllers.signUp);

router
    .route("/login")
    .post(authControllers.login);

router
    .route("/get/all")
    .get(authControllers.getAllUsers);


router
    .route("/get/:id")
    .get(authControllers.getOneUserId);



module.exports = router;    

