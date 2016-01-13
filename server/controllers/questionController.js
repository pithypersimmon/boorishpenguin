var db = require('../db/index.js');
var UCtrl = require('./userControllers.js');

module.exports = {
  allQuestions: function(req, res) {
    // This is necessary because our Post schema 
    // contains both answers and questions
    db.Post.findAll({
      where: {
        isAnAnswer: false
      },
      include: [db.User, db.Course, db.Tag]
    })
    //Format the array of questions into objects that our
    //front end will use
    .then(function(questions) {
      var formattedQs = questions.map(function(question) {
        return {
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
          imgUrl: question.User.picture,
          updatedAt: question.updatedAt
        }
      });

      questions = {};
      questions.results = formattedQs;
      res.json(questions);
    });
  },
  // New question takes title, text, coursename,
  // tagname(s?) and user id
  newQuestion: function(req, res) {
    var titl = req.body.title;
    var txt = req.body.text;
    var coursename = req.body.course;
    var tagname = req.body.tag;
    var uid = req.body.id_user;

    db.User.findById(uid)
    // Points for each question you post you make
    .then(function(user) {
      user.update({
        points: user.points + 1
      })
      // Need to do this because it is a reference
      .then(function() {
        db.Course.findOne({
          where: {
            name: coursename
          }
        })
        // Need to do this because it is a reference
        .then(function(course) {
          db.Tag.findOne({
            where: {
              name: tagname
            }
          })
          .then(function(tag) {
            db.Post.create({
              title: titl,
              text: txt,
              UserId: user.id,
              CourseId: course.id,
              TagId: tag.id
            })
            .then(function(question) {
              res.status(201).json(question);
            });
          });
        });
      })
    });
  },

  // TODO: add check for admin or same-user
  deleteQuestion: function(req, res) {
    var qid = req.params.id;
    var reqName = req.user.profile.emails[0].value;

    db.Post.findById(qid)
    .then(function(question) {
      var uid = question.UserId;

      db.User.findById(uid)
      .then(function(user){
        var authorname = user.username;
        // Only allows you to delete question if you're a teacher
        UCtrl.isUserTeacher(reqName, function(is) {
          //You can only delete things that you have authored?
          if (is || reqName === authorname) {
            user.update({
              points: user.points - 1
            })
            .then(function() {
              question.destroy()
              .then(function(id) {
                if (id) {
                  res.sendStatus(204);
                };
              });
            }); 
          } else{
            res.sendStatus(404);
          }
        });
      });
    });
  },
  // What the heck does this do?
  // Might break out into the individual view
  readQuestion: function(req, res) {
    var qid = req.params.id;

    db.Post.findById(qid, {
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

      db.Post.findAll({
        where: {
          QuestionId: qid
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
          }
        });

        qAndAs = {};
        qAndAs.results = formattedQ.concat(formattedAs);
        res.json(qAndAs);
      })
    })
  },

  // TODO: add check for admin or same-user
  modQuestion: function(req, res) {
    var qid = req.params.id;
    var mod = req.body.mod;
    var reqName = req.user.profile.emails[0].value;

    db.Post.findOne({
      where: {
        id: qid
      }
    })
    .then(function(question) {
      // Approved by teacher
      var curGood = question.isGood;
      //Get a point anytime there is like
      var curLike = question.points;
      //Deleted? by teacher?
      var curClosed = question.isClosed;
      //Teacher admin power?
      var curAnswered = question.isAnswered;

      db.User.findOne({
        where: {
          id: question.UserId
        }
      })

      .then(function(user) {
        var authorname = user.username;

        if (mod === 'like') {
          db.User.find({
            where: {
              username: reqName
            }
          })
          .then(function(requester) {
            return question.getVote({
              where: ['UserId='+requester.id+' AND PostId='+question.id]
            })
            .then(function(result) {

              //I think this if else checks to see if you've liked stuff yet?
              if (!result.length) {
                return question.addVote(requester)
                .then(function() {
                  return question.update({
                    points: question.points + 1
                  });
                })
                .then(function(question) {
                  return user.update({
                    points: user.points + 1
                  });
                });
              } else {
                return question.removeVote(requester)
                .then(function() {
                  return question.update({
                    points: question.points - 1
                  });
                })
                .then(function(question) {
                  return user.update({
                    points: user.points -1
                  });
                });
              }
              //End of else statement
            });
          })
          .then(function() {
            res.status(201).json(question);
          });

        // This is all teacher stuff because the like is the only thing
        // that is the only thing done by students   
        } else {

          // Checks if it is a teacher 
          // or student that posted the question 
          UCtrl.isUserTeacher(reqName, function(is) {
            if (mod === 'answered' && (reqName === authorname || is)) {
              question.update({
                isAnswered: !curAnswered
              })
              .then(function() {
                res.status(201).json(question);
              });
            }

            //Checks if you're a teacher
            else if (is) {
              if (mod === 'good') {
                // admin only
                question.update({
                  isGood: !curGood
                })
                .then(function() {
                  return user.update({
                    points: user.points + 1
                  })
                })
                .then(function() {
                  res.status(201).json(question);
                });
              } else if (mod === 'closed') {
                // admin only; maybe refactor this and the previous
                // to run the admin check first?
                question.update({
                  isClosed: !curClosed
                })
                .then(function() {
                  res.status(201).json(question);
                });
              } else {
                res.sendStatus(404);
              }
            //If you're not a teacher peace.  
            } else {
              res.sendStatus(404);
            }
          });
        }
      });
    });
  }
};