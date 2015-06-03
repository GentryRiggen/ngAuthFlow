'use strict';

angular.module('ngAuthFlow', ['ui.router'])
  // Handle Auth on every navigation
  .run(function ($rootScope, $state, userService) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        function setAlert(visible, toState) {
            if (visible) {
                console.log("Showing alert", toState);
                var roles = "";
                angular.forEach(toState.data.allowedRoles, function(role) {
                    roles += " " + role;
                });
                $rootScope.alert = {
                    visible: visible,
                    type: 'danger',
                    message: "User not in following roles: " + roles
                };
            } else {
                $rootScope.alert = {
                    visible: true,
                    type: 'success',
                    message: 'User in correct role'
                };
            }
        }
        
        setAlert(false);
        
        userService.getCurrentUser().then(
            function (currentUser) {
                console.log("Current User", currentUser);
                var userIsAdmin = _.contains(currentUser.roles, "Admin");
                // Check if state requires user to be in certain role (Admin trumps everything)
                if (!userIsAdmin &&
                    angular.isDefined(toState.data) &&
                    angular.isDefined(toState.data.allowedRoles) &&
                    toState.data.allowedRoles.length > 0) {

                    var allowedThrough = false;
                    angular.forEach(toState.data.allowedRoles, function (role) {
                        if (_.contains(currentUser.roles, role)) {
                            console.log("User has required role", toState.data.allowedRoles);
                            allowedThrough = true;
                        }
                    });
                    
                    if (!allowedThrough) {
                        console.log("User not in role", currentUser.roles, toState.data.allowedRoles);
                        // If we get this far, they don't have access
                        event.preventDefault();
                        setAlert(true, toState);
                    }
                }
            },
            function () {
                // This may be a public route
                if (angular.isDefined(toState.data) &&
                    angular.isDefined(toState.data.requireLogin) &&
                    toState.data.requireLogin === false) {
                    console.log("Public route, it's cool");
                    return;
                } else {
                    console.log("User not logged in");
                    event.preventDefault();
                    setAlert(true, toState);
                }
            }
        );
    });
  })
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        data: {
            requireLogin: false
        }
      })
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl',
        data: {
            allowedRoles: ["Admin"]
        }
      })
      .state('pro', {
        url: '/pro',
        templateUrl: 'app/pro/pro.html',
        controller: 'ProCtrl',
        data: {
            allowedRoles: ["Pro"]
        }
      })
      .state('basic', {
        url: '/basic',
        templateUrl: 'app/basic/basic.html',
        controller: 'BasicCtrl',
        data: {
            allowedRoles: ["Basic"]
        }
      });

    $urlRouterProvider.otherwise('/');
  })
;
