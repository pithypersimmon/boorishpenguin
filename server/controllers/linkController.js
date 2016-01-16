var db = require('../db/index.js');

module.exports = {
  
  newLink: function (req, res) {
    db.Saved_Link.create({
      email: req.body.email,
      url: req.body.url,
      title: req.body.title
    })
    .then(function (link) {
      res.status(200).json(link);
    });  
  },

  getUserLinks: function (req, res) {
    var email = req.params.email;
    db.Saved_Link.findAll({
      where: {
        email: email
      }
    }).
    then(function (urls) {
      res.send(urls);
    });
  }
};
