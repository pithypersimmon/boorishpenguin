angular.module('boorish.questions', [])

.controller('questionsController', function($scope, $location, Questions, Auth) {
  $scope.questions = [];
  Auth.setUser();

  $scope.init = function() {

    Questions.getAllQuestions().then(function(data) {
      $scope.questions = data.results;
    });
    
  };


  // if user is not authenticated, reroute to /signin
  if (!Auth.isAuth()) {
    $location.path('/signin') 
  // else show questions
  } else {
    $scope.init();
  }
});

//TODO: ASYNC between setUSER and checking auth