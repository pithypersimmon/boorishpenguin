var Sequelize = require('sequelize');


var database = process.env.DATABASE || 'test2';
var dbUser = process.env.DBUSER || 'root';
var dbPass = process.env.DBPASS || "student";
var dbHost = process.env.DBHOST || 'localhost';

var db = new Sequelize(database, dbUser, dbPass, {
  host: dbHost
});


var Post = db.define('Post', {
  // used to define product or response
  isAResponse: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    //JUST FOR NOW
    defaultValue: false
  },
  postid: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: true
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true
  },
  url: {
    type: Sequelize.STRING,
    allowNull: true
  },
  provider_url: {
    type: Sequelize.STRING,
    allowNull: true
  },
  thumbnail_width: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  thumbnail_height: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  thumbnail_url: {
    type: Sequelize.STRING,
    allowNull: true
  },
  version: {
    type: Sequelize.STRING,
    allowNull: true
  },
  provider_name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  type: {
    type: Sequelize.STRING,
    allowNull: true
  },
  like_count: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  response_count: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  created: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.fn('NOW')
  },
  updated: Sequelize.DATE
});

var User = db.define('User', {
  username: Sequelize.STRING,
  fullname: Sequelize.STRING,
  email: Sequelize.STRING,
  image_url: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: false
  },
  type : {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  post_like_count: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  resp_like_count: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: false
});

var Tag = db.define('Tag', {
  name: Sequelize.STRING,
  count: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: false
});

var Like = db.define('Like', {
  }, {
    timestamps: false
});

var Post_Tag = db.define('Post_Tag', {
  tag_name: Sequelize.STRING
  }, {
    timestamps: false
});

User.hasMany(Post);
Post.belongsTo(User);

// // set up many to many model for post and user on like
User.belongsToMany(Post, {
    as: 'posts',
    through: 'Like'
});
Post.belongsToMany(User, {
    as: 'users',
    through: 'Like'
});

// // set up many to many model for post and tag on post_tag
Post.belongsToMany(Tag, {
    as: 'tags',
    through: 'Post_Tag'
});
Tag.belongsToMany(Post, {
    as: 'posts',
    through: 'Post_Tag'
});

User.sync()
.then(function() {
  return Tag.sync();
})
.then(function() {
  return Post.sync();
})
.then(function() {
  return Like.sync();
})
.then(function() {
  return Post_Tag.sync();
});

exports.User = User;
exports.Tag = Tag;
exports.Post = Post;
exports.Like = Like;
exports.Like = Post_Tag;