var questionControllers = require ('../controllers/questionController.js');
var answerControllers = require ('../controllers/answerController.js');
var userControllers = require ('../controllers/userControllers.js');
var postController = require ('../controllers/postController.js');
var tagControllers = require ('../controllers/tagControllers.js');
var likeController = require ('../controllers/likeController.js');
var passport = require('passport');
var USER = require("../../client/user");

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


module.exports = function(app, express, ensureAuth) {

  app.get('/townhall/products', ensureAuth, postController.allProducts);
  app.get('/townhall/products/:id', ensureAuth, postController.readPost);

  app.post('/townhall/posts', ensureAuth, postController.newPost);
  app.delete('/townhall/posts/:id', ensureAuth, postController.deletePost);
  

  app.post('/townhall/likes', likeController.likePost);



  // app.post('/townhall/answers', ensureAuth, answerControllers.newAnswer);
  // app.post('/townhall/answers/:id', ensureAuth, answerControllers.modAnswer);
  // app.delete('/townhall/answers/:id', ensureAuth, answerControllers.deleteAnswer);




  app.get('/townhall/users', ensureAuth, userControllers.allUsers);
  app.get('/townhall/users/:id', ensureAuth, userControllers.oneUser);
  app.post('/townhall/signup', userControllers.newUser);


  app.get('/townhall/tags', ensureAuth, tagControllers.allTags);
  app.post('/townhall/tags', ensureAuth, tagControllers.newTags);

  // Client does get request to /auth/google on signin
  app.get('/auth/google',
  passport.authenticate('google', { scope:  ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.me', "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"] }));

  // Server.js:38 sends get req to /auth/google/callback after user has successfully logged into google
  app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    console.log("picture",req.user.profile.photos[0].value);
    USER.image = req.user.profile.photos[0].value || null;

    // sends user to questions page after they successfully login
    res.redirect('/#/questions');
  });

  app.get('/user', ensureAuth, function (req, res){
    // sends google user data to client so they can know whose currenty logged in
    res.json(req.user);
  });

}
