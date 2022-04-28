const express = require("express");

const postControllers = require("../controllers/postControllers");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


router
    .route("/")
    .get(postControllers.getAllPosts)
    .post(protect, postControllers.createPost);

router
    .route("/:id")
    .get(postControllers.getOnePost)
    .patch(postControllers.updatePost)
    .delete(postControllers.deletePost);


module.exports = router;    

