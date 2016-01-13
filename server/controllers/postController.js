var db = require('../db/index.js');
var UCtrl = require('./userControllers.js');

module.exports = {
  // This is for our home page
  allProducts: function(req, res) {
    // This is necessary because our Post schema 
    // contains both products and responses
    db.Post.findAll({
      where: {
        isAnAnswer: false
      },
      //This creates the rows that are references instead of 
      //just the numbers
      include: [db.User, db.Course, db.Tag]
    })
    //Format the array of questions into objects that our
    //front end will use
    .then(function(products) {
      var formattedQs = products.map(function(product) {
        return {
          id: product.id,
          title: product.title,
          text: product.text,
          isAnAnswer: false,
          points: product.points,
          responses: product.responses,
          // isAnswered: product.isAnswered,
          // isGood: product.isGood,
          // isClosed: product.isClosed,
          createdAt: product.createdAt,
          // coursename: product.Course.name,
          // tagname: product.Tag.name,
          user: product.User.name,
          imgUrl: product.User.picture,
          updatedAt: product.updatedAt
        };
      });

      products = {};
      products.results = formattedQs;
      res.json(products);
    });
  },

  readQuestion: function(req, res) {
    var pid = req.params.id;

    db.Post.findById(pid, {
      include: [db.User, db.Course, db.Tag]
    })
    .then(function(question) {
      var formattedQ = [{
        id: question.id,
        title: question.title,
        text: question.text,
        isAnAnswer: false,
        points: question.points,
        responses: question.responses,
        isAnswered: question.isAnswered,
        isGood: question.isGood,
        isClosed: question.isClosed,
        createdAt: question.createdAt,
        coursename: question.Course.name,
        tagname: question.Tag.name,
        user: question.User.name,
        userid: question.User.id,
        imgUrl: question.User.picture,
        updatedAt: question.updatedAt
      }];
      // This is what we do to find the responses
      db.Post.findAll({
        where: {
          postId: pid
        },
        include: [db.User]
      })
      .then(function(answers) {
        var formattedAs = answers.map(function(answer) {
          return {
            id: answer.id,
            text: answer.text,
            isAnAnswer: true,
            points: answer.points,
            isGood: answer.isGood,
            QuestionId: qid,
            user: answer.User.name,
            userid: answer.User.id,
            createdAt: answer.createdAt,
            imgUrl: answer.User.picture
          };
        });

        qAndAs = {};
        qAndAs.results = formattedQ.concat(formattedAs);
        res.json(qAndAs);
      });
    });
  },


  newPost: function(req, res) {
    //Used for Post/Response
    var title = req.body.title;
    var text = req.body.text;
    var uid = req.body.id_user;
    //Post Only
    var link = req.body.link;
    //Response Only
    var qid = req.body.id_question;
    //How are we given type?
    db.Post.create({
      title: title,
      text: text,
      link: link,
      UserId: uid,
      QuestionId: qid || null,
      Type: (qid) ? 'Response' : 'Post' 

    })
    .then(function(post) {
      res.status(201).json(post);
    });
  },

  deletePost: function(req, res) {
    //How do we get this stuff without request?
    var pid = req.params.id;
    //Need this to authorize deletion
    var reqName = req.user.profile.emails[0].value;

    //This 
    db.Post.findById(pid)
    .then(function(post) {
      post.destroy()
      .then(function() {
        res.sendStatus(204);
      });
    });

    // db.Post.findById(pid)
    // .then(function(post) {
    //   return post.destroy();
    // })
    // .then(function(nothing) {
    //   res.sendStatus(204);
    // });
  }
};



















