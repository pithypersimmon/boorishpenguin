var db = require('../db/index.js');
var UCtrl = require('./userControllers.js');

module.exports = {
  likePost: function(req, res) {
    //Need userid and postid to create a like instance
    //Copy and pasted this, not sure how it works yet
    var pid = req.body.id_question;
    var uid = req.body.id_user;
    db.Like.create({
      UserId: uid,
      PostId: pid
    })
    .then(function(like){
      res.status(201).json(like);
    });
  }
};


