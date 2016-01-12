var db = require('../db/index.js');

module.exports = {
  allUsers: function(req, res) {
    var course = req.body.coursename;

    db.User.findAll()
    .then(function(users) {
      var formattedUsers = users.map(function(user) {
        return {
          id: user.id,
          isTeacher: user.isTeacher,
          name: user.name,
          name_first: user.name_last,
          name_last: user.name_first,
          email: user.email,
          points: user.points,
          image: user.image
        }
      });

      users = {};
      users.results = formattedUsers;
      res.json(users);
    });
  },

  oneUser: function(req, res) {
    var uid = req.params.id;

    db.User.findById(uid)
    .then(function(user) {
      var formattedUser = {
        id: user.id,
        isTeacher: user.isTeacher,
        name: user.name,
        name_first: user.name_last,
        name_last: user.name_first,
        email: user.email,
        points: user.points,
        image: user.image
      }

      user = {};
      user.results = formattedUser;
      res.json(user);
    });
  },

  //-------------------User----------------------------------------//  
  newUser: function(user) {
    db.User.create(user)
    .then(function(newUser) {
      return newUser;
    });
  },

  //Used for Passport line 43 of server.js
  isUserInDb: function(uname, callback) {
    db.User.count({
      where: {
        username: uname
      }
    })
    .then(function(number) {
      callback(!!number);
      return;
    });
  },
  //-------------------Authorization----------------------------------------//
  isUserTeacher: function(uname, callback) {
    db.User.find({
      where: {
        username: uname
      }
    })
    .then(function(user) {
      callback(user.isTeacher);
      return;
    })
  }
};
