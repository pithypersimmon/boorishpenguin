var db = require('../db/index.js');

module.exports = {
  allTags: function(req, res) {
    db.Tag.findAll()
    .then(function(tags) {
      var formmatedTags = tags.map(function(tag) {
        return {
          id: tag.id,
          name: tag.name
        };
      });

      tags = {};
      tags.results = formmatedTags;
      res.json(tags);
    });
  },
  newTags: function(req, res) {
    db.Tag.create({
      name: req.tag,
    })
    .then(function(tag) {
      res.status(201).json(tag);
    });
  }
};
