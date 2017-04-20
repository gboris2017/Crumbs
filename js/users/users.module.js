'use strict';

(function () {
    configure.$inject = ["$stateProvider"];
    angular.module('crumbs.users', ['crumbs.core']).config(configure);

    /** @ngInject */
    function configure($stateProvider) {
        $stateProvider.state('users', {
            url: '/users',
            templateUrl: 'users/users.controller.html',
            controller: 'UsersController',
            controllerAs: 'vm'
        });
    }
})();