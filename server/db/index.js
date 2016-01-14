var Sequelize = require('sequelize');


var database = process.env.DATABASE || 'test2';
var dbUser = process.env.DBUSER || 'root';
var dbPass = process.env.DBPASS || "student";
var dbHost = process.env.DBHOST || 'localhost';

var db = new Sequelize(database, dbUser, dbPass, {
  host: dbHost
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
  },
  picture: Sequelize.STRING
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


var Post = db.define('Post', {
  title: Sequelize.STRING,
  text: Sequelize.STRING,
  isAResponse: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    //JUST FOR NOW
    defaultValue: false
  },
  points: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  link: {
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
  //When is this touched and shouldn't it point to the
  //question not the responses?
  responses: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  //Why is this necessary what does it do
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.fn('NOW')
  },
  updatedAt: Sequelize.DATE
});

var Like = db.define('Like', {
  }, {
    timestamps: false
});

var Post_Tag = db.define('Post_Tag', {
  }, {
    timestamps: false
});

User.hasMany(Post);
Post.belongsTo(User);

Post.hasMany(Post, {as: 'Responses', foreignKey: 'PostId'});

// // set up many to many model for post and user on like
User.belongsToMany(Post, {
    as: 'relationship',
    through: 'Like'
});
Post.belongsToMany(User, {
    as: 'relationship2',
    through: 'Like'
});

// // set up many to many model for post and tag on post_tag
Post.belongsToMany(Tag, {
    as: 'relationship',
    through: 'Post_Tag'
});
Tag.belongsToMany(Post, {
    as: 'relationship2',
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
});

exports.User = User;
exports.Tag = Tag;
exports.Post = Post;
