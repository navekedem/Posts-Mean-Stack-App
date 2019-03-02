const express = require('express');
const Post = require('../models/post')
const router = express.Router();
const multer = require('multer');
const authCheck = require('../middlewares/check-auth')

const MIME_Type_Map = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',

};


const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    const isValid = MIME_Type_Map[file.mimetype];
    let error = new Error('Inavlid Mime Type');
    if(isValid){
      error = null;
    }
    cb(error,"backend/images");
  },
  filename: (req,file,cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_Type_Map[file.mimetype];
    cb(null, name+"-"+ Date.now() + "." + ext);
  }


})


router.post("",authCheck ,multer({storage: storage}).single('image'),(req, res, next) => {
  const url = req.protocol + "://" + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  console.log(post);
  post.save().then(resultPost => {
    res.status(201).json({
      message: "Post added",
      post: {
        ...resultPost,
        id: resultPost._id
      }
    }).catch(error => {
      res.status(500).json({
        message: "Creating post failed"
      })
    });
  });

});

router.put("/:id",authCheck,multer({storage: storage}).single('image'),(req,res,next) => {
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + "://" + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({_id: req.params.id , creator: req.userData.userId}, post).then(result => {
    if(result.n > 0) {
      res.status(200).json({message: "Post Update Sucsseful"});
    }else {
      res.status(401).json({message: "User Not Auth"})
    }

  }).catch(error => {
    res.status(500).json({
      message: "Update post failed"
    })
  });
})



router.get("/:id",(req,res,next) => {
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post);

    }else{
      res.status(404).json({message: "Post Not Found"});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fethcing post failed"
    })
  });
})

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const pageQuery = Post.find();
  let fetchPosts;
  if(pageSize && currentPage){
    pageQuery.skip(pageSize *(currentPage - 1)).limit(pageSize);
  }

  pageQuery.find().then(documents => {
    fetchPosts = documents;
    return Post.count();
  }).then(count => {
    res.status(200).json({
      message: "Posts SeccseusFully fetch",
      posts: fetchPosts,
      postsCount: count
    }).catch(error => {
      res.status(500).json({
        message: "Fethcing posts failed"
      })
    });
  });
});

router.delete("/:id",authCheck,(req,res,next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    if(result.n) {

      res.status(200).json({message: "Post Deleted"});
    }else {
      res.status(401).json({message: "User Not Auth"})
    }
  }).catch(error => {
    res.status(500).json({
      message: "Delete post failed"
    })
  });
});


module.exports = router;
