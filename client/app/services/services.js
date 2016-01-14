

angular.module('boorish.services', [])

// Questions factory handles all requests to add, retrieve, or modify questions in the database

.factory('Questions', function($http, $location) {
  return {
    // add a question from /ask
    addProduct: function(question) {
      console.log(question.tag);
      return $http({
        method: 'POST',
        url: '/townhall/posts',
        data: JSON.stringify({
          text: question.text,
          id_user: question.userId,
          tag: question.tag,  // these are not setup yet
          title: question.title
        })
      })
    },

    getAllProducts: function() {

      return $http({
        method: 'GET',
        url: '/townhall/products/'
      })
      .then(function(res) {
        return res.data; // returns all questions
      })
    },

    getQuestion: function(path) { 
      return $http({
        method: 'GET',
        url: '/townhall' + path
      })
      .then(function(res) {
        return res; // returns question and related answers
      })
    },

    // updates a question. takes in the id of the question and the required modification
    updateQuestion: function(id, mod) {
      return $http({
        method: 'POST',
        url: 'townhall/products/' + id,
        data: { mod: mod } // possible mods = 'like' to increase like points, 'good' to mark as good (by teacher), 'answered', 'closed'
      })
    },

    // removes a question. Only available to the user who posted it or a Teacher (isAdmin = true)
    removeQuestion: function(questionID) {
      return $http({
        method: 'DELETE',
        url: 'townhall/products/' + questionID
      })
    },
    
    embedLink: function(link) {
      return $http({
        method: 'GET',
        url: 'http://api.embed.ly/1/oembed?key=3666f1ee1b734342acf291ec68b9196d&url='+link
      })
    }
  }
})

// Answers factory handles all requests to add, retrieve, or modify answers in the database

.factory('Answers', function($http) {

  return {
    // get all answers
    getAnswers: function() {
      return $http({
        method: 'GET',
        url: 'townhall/answers',
      })
      .then(function(res) {
        return res.data;
      })
    },

    // adds an answer to a question. requires the answer object and question ID
    addAnswer: function(data) {

      return $http({
        method: 'POST',
        url: 'townhall/posts',
        data: JSON.stringify(data)
      })
    },

    // updates an answer. requires the answerID and requested modification (mod). mod is a string.
    updateAnswer: function(answerID, mod) {
      return $http({
        method: 'POST',
        url: 'townhall/answers/' + answerID,
        data: JSON.stringify({
          id_answer: answerID,
          mod: mod // possible mods: 'like' to increase the number of points on a question, 'good' to mark as good
        })
      })
    },

    // removes an answer. requires the id of the answer
    removeAnswer: function(answerID) {
      return $http({
        method: 'DELETE',
        url: 'townhall/answers/' + answerID
      })
    }




  }
})

// Users factory handles all requests to add and retrieve users in the database

.factory('Users', function($http, $window){

  return {

    allUsers: function(){
      return $http({
        method: 'GET',
        url: '/townhall/users'
      })
      .then(function(res){
        return res.data;
      });
    },

    // users the userID that is stored in localStorage to obtain the user from the database
    getUserWithId: function() {
      var userID = $window.localStorage.getItem('com.boorish');
      return $http({
        method: 'GET',
        url: '/townhall/users/' + userID
      }).then(function(res) {
        return res.data.results.id;
      })
    },

    addUser: function(user) {
      return $http({
        method: 'POST',
        url: '/townhall/users',
        data: JSON.stringify({
          username: user.username,
          password: user.password,
          name: user.name,
          isTeacher: user.isTeacher,
          points: 0,
          email: user.email,
          picture: user.picture
        })
      })
    }

  };
})


.factory('Trending', function($http) {

  return {

    //getTopTrending: function() {
    //  return $http({
    //    method: 'GET',
    //    //TODO: Need route to get trending
    //    url: '/townhall/trending'
    //  })
    //  .then(function(res) {
    //    return res.data;
    //  });
    //}

  };
})

// Tags and Course factories just pull Tags and Courses from the database

.factory('Tags', function($http) {
  
  return {

    getTags: function() {
      return $http({
        method: 'GET',
        url: '/townhall/tags'
      })
      .then(function(res) {
        return res.data;
      });
    }

  };
})

.factory('Courses', function($http) {
  
  return {

    getCourses: function() {
      return $http({
        method: 'GET',
        url: '/townhall/courses'

      })
      .then(function(res) {
        return res.data;
      });
    }

  };
})

.factory('Auth', function ($http, $location, $window) {
  var user = {};

  return {
    
    setUser: function () {
      return $http({
        method: 'GET',
        url: '/user'
      })
      .then(function (res) {
        user.google = res.data.email || res.data.profile.emails[0].value;
        var userData = res.data.profile;

        return $http({
          method: 'GET',
          url: '/townhall/users'
        })
        .then(function(res) {
          var users = res.data.results || [];
          var isUser = false;
          for (var i = 0; i < users.length; i++) {
            if (users[i].email === user.google) {
              isUser = true;
              user.id = users[i].id;
            }
          }
          if (isUser) {
            $window.localStorage.setItem('com.boorish', user.id);
            $window.localStorage.setItem('image', JSON.stringify(userData.photos[0].value));

          } else {
            $location.path('/signin');
          }
        })
      });
  },

  isAuth: function () {
    return !!$window.localStorage.getItem('com.boorish');
  },

  signout: function () {
    $window.localStorage.removeItem('com.boorish');
    $location.path('/signin');
  }
}

});
