'use strict';

(function () {
    configure.$inject = ["$stateProvider"];
    angular.module('crumbs.lists', ['crumbs.core']).config(configure);

    /** @ngInject */
    function configure($stateProvider) {
        $stateProvider.state('lists', {
            url: '/lists',
            views: {
                '': {
                    templateUrl: 'lists/lists.controller.html',
                    controller: 'ListsController',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();