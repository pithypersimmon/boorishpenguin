angular.module('boorish.auth', [])

.controller('AuthController', function ($scope, $location, Auth, $window) {
  $scope.user = {};

  $scope.signin = function () {
    $http({
      method: 'GET',
      url: '/townhall/users'
    }).catch(function(error) {
      console.log(error)
    })
  };
});