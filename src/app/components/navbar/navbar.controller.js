'use strict';

angular.module('ngAuthFlow')
  .controller('NavbarCtrl', function ($scope) {
    $scope.currentUser = false;
    $scope.$on("currentUser", function (e, user) {
      $scope.currentUser = user;
    });
    
    $scope.reload = function () {
      location.reload();
    }
  });
