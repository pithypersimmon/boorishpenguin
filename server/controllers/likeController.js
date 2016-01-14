var db = require('../db/index.js');
var UCtrl = require('./userControllers.js');

module.exports = {
  //this needs to increment points
  likePost: function(req, res) {
    //Need userid and postid to create a like instance
    //Copy and pasted this, not sure how it works yet
    var pid = req.body.id_question;
    var uid = req.body.id_user;
    var liked;
    //check if post is like or not
    db.Like.findOne({
      where: { 
        UserId: uid,
        PostId: pid
      },
    })
    .then(function(like) {
      if (like) {
        liked = true;
      } else {
        liked = false;
      }
    });


    //Increase or Decrease likes for User_Post 
    db.Post.findOne({
      where: {
        pid: pid
      }
    })
    .then(function(post){
      //Increase or decrease like_count for Post
      post.updateAttributes({
        like_count: liked ? like_count + 1 : like_count - 1
      });
      //WHOAWHOAWHOA whats the order of this promise without a then into a return?
      // keep going
      return db.User.findById(post.UserId);
    })
    .then(function(user) {
      return user.updateAttributes({
        post_like_count: liked ? post_like_count + 1 : post_like_count - 1
      });
    });

    //if the like exists already
    if ( liked ) {
      db.Like.findOne({
        where: { 
          UserId: uid,
          PostId: pid
        },
      })
      .then(function(like){
        return like.destroy();
      })
      .then(function(id){
        if (id) {
          res.sendStatus(204);
        }
      });
    //there hasn't been a like
    } else {
      db.Like.create({
        UserId: uid,
        PostId: pid
      })
      .then(function(like){
        res.status(201).json(like);
      });
    }
  }



  // unlikePost: function(req, res) {
  //   var pid = req.body.id_question;
  //   var uid = req.body.id_user;
    

  //   //Decrease likes for User_Post 
  //   db.Post.findOne({
  //     where: {
  //       pid: pid
  //     }
  //   })
  //   .then(function(post){
  //     //Decrease like_count for Post
  //     post.updateAttributes({
  //       like_count: like_count - 1
  //     });
  //     //WHOAWHOAWHOA whats the order of this promise without a then into a return?
  //     // keep going
  //     return db.User.findById(post.UserId);
  //   })
  //   .then(function(user) {
  //     return user.updateAttributes({
  //       post_like_count: post_like_count - 1
  //     });
  //   });

  //   //Remove the like from the store
    
  // }

};


