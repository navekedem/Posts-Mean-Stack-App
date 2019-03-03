const express = require('express');
const router = express.Router();
const multerFile = require("../middlewares/multer");
const PostController = require("../controllers/post-controller")
const authCheck = require('../middlewares/check-auth')



router.post("",authCheck ,multerFile, PostController.createPost);

router.put("/:id",authCheck,multerFile, PostController.updatePost)


router.get("/:id", PostController.getPost)

router.get("", PostController.getPosts);

router.delete("/:id",authCheck, PostController.deletePost);


module.exports = router;
