var db = require('../db/index.js');
var UCtrl = require('./userControllers.js');

module.exports = {
  //this needs to increment points
  likePost: function(req, res) {
    //Need userid and postid to create a like instance
    //Copy and pasted this, not sure how it works yet
    var pid = req.body.id_post;
    var uid = req.body.id_user;
    var liked = "apple";
    //check if post is like or not

    db.Like.findOne({
      where: { 
        UserId: uid,
        PostId: pid
      }
    })
    .then(function(like) {
      if (like) {
        liked = true;
      } else {
        liked = false;
      }
    //Increase or Decrease likes for User_Post 
      db.Post.findOne({
        where: {
          id: pid
        }
        //why not include here
      })
      .then(function(post){
        console.log("Promise after post");
        //Increase or decrease like_count for Post
        if (post){ 
          post.updateAttributes({
            like_count: liked ? post.like_count - 1 : post.like_count + 1
          });
        }
        //WHOAWHOAWHOA whats the order of this promise without a then into a return?
        // keep going
        
        return db.User.findById(post.UserId);
      })
      .then(function(user) {
        return user.updateAttributes({
          post_like_count: liked ? user.post_like_count - 1 : user.post_like_count + 1
        });
      })
      .then(function() {
        if ( liked ) {
          db.Like.findOne({
            where: { 
              UserId: uid,
              PostId: pid
            },
          })
          .then(function(like){
            return like.destroy({ force: true });
          })
          .then(function(id){
            if (id) {
              //send some sort of thing
              res.send(id);
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
      });
      
    });
  
    //if the like exists already
  }

};


