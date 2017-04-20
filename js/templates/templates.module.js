'use strict';

(function () {
    configure.$inject = ["$stateProvider"];
    angular.module('crumbs.templates', ['crumbs.core']).config(configure);

    /** @ngInject */
    function configure($stateProvider) {
        $stateProvider.state('templates', {
            url: '/templates',
            templateUrl: 'templates/templates.controller.html',
            controller: 'TemplatesController',
            controllerAs: 'vm',
            title: ' - Templates'

        });
    }
})();