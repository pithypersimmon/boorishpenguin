var db = require('../db/index.js');

module.exports = {
  allTags: function(req, res) {
    db.Tag.findAll()
    .then(function(tags) {
      var formatedTags = tags.map(function(tag) {
        return {
          id: tag.id,
          name: tag.name
        };
      });

      tags = {};
      tags.results = formatedTags;
      res.json(tags);
    });
  },
  newTags: function(req, res) {
    var tag = req.body.tag;
    db.Tag.create({
      name: tag,
    })
    .then(function(tag) {
      res.status(201).json(tag);
    });
  }
};