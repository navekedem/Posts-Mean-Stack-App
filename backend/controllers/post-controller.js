const Post = require('../models/post');


exports.createPost = (req, res, next) => {
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
};

exports.updatePost = (req,res,next) => {
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
};

exports.getPost = (req,res,next) => {
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
};

exports.getPosts = (req, res, next) => {
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
};

exports.deletePost = (req,res,next) => {
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
}
