angular.module('boorish.questions', [])

.controller('questionsController', function($scope, $window, $location, Questions, Auth) {
  $scope.questions = [];
  $scope.trending = [];


  $scope.init = function() {

    Questions.getAllProducts().then(function(data) {
      $scope.questions = data.results;
    });

    // Trending.getTopTrending().then(function(data){
    //   $scope.trending = data.results;
    // })
    
  };

  $scope.giveLike = function(postid) {
    var obj = {};
    obj.id_user = localStorage.getItem('com.boorish');
    obj.id_post = postid;
    Questions.addLike(obj);
    Questions.getAllProducts();
  }


  // if user is not authenticated, reroute to /signin
  Auth.setUser().then(function(){

  })

  if(Auth.isAuth()){
    $scope.init()
  } else {
    $location.path('/signin')
  }
  //if (!Auth.isAuth()) {
  //  $location.path('/signin')
  //// else show questions
  //} else {
  //  $scope.init();
  //}
});

//TODO: ASYNC between setUSER and checking auth