const express = require('express');

const Post = require('../models/post')
const router = express.Router();
const multer = require('multer');

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


router.post("", multer({storage: storage}).single('image'),(req, res, next) => {
  const url = req.protocol + "://" + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
  });
  console.log(post);
  post.save().then(resultPost => {
    res.status(201).json({
      message: "Post added",
      post: {
        ...resultPost,
        id: resultPost._id
      }
    });
  });

});

router.put("/:id",multer({storage: storage}).single('image'),(req,res,next) => {
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + "://" + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({message: "Post Update Sucsseful"});
  })
})



router.get("/:id",(req,res,next) => {
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post);
      
    }else{
      res.status(404).json({message: "Post Not Found"});
    }
  })
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
    });
  });
});

router.delete("/:id", (req,res,next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message: "Post Deleted"});
  });
});


module.exports = router;
