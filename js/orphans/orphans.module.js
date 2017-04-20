'use strict';

(function () {
    configure.$inject = ["$stateProvider"];
    angular.module('crumbs.orphans', ['crumbs.core']).config(configure);

    /** @ngInject */
    function configure($stateProvider) {
        $stateProvider.state('orphans', {
            url: '/orphans',
            templateUrl: 'orphans/orphans.controller.html',
            controller: 'OrphansController',
            controllerAs: 'vm'
        });
    }
})();