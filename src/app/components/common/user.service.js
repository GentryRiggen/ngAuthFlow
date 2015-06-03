(function () {
    'use strict';
    angular.module('ngAuthFlow').service('userService', userService);

    userService.$inject = ['$timeout', '$rootScope', '$q'];
    function userService($timeout, $rootScope, $q) {
        var users = [
            {
                firstName: 'Gentry',
                lastName: 'Riggen',
                roles: ['Admin', 'Pro']
            },
            {
                firstName: 'Morgan',
                lastName: 'Riggen',
                roles: ['Pro', 'Basic']
            },
            {
                firstName: 'Tonka',
                lastName: 'Riggen',
                roles: ['Basic']
            }
        ];
        var userSvc = {};

        userSvc.getCurrentUser = function () {
            var deferred = $q.defer();
            if (angular.isUndefined($rootScope.currentUser)) {
                $timeout(function() {
                    var random = Math.floor(Math.random() * 3);
                    $rootScope.currentUser = users[random];
                    $rootScope.$broadcast("currentUser", $rootScope.currentUser);
                    deferred.resolve($rootScope.currentUser);
                }, 250);
            } else {
                deferred.resolve($rootScope.currentUser);
            }

            return deferred.promise;
        };

        return userSvc;
    }
})();