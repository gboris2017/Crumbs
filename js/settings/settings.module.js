'use strict';

(function () {
    configure.$inject = ["$stateProvider"];
    angular.module('crumbs.settings', ['crumbs.core']).config(configure);

    /** @ngInject */
    function configure($stateProvider) {
        $stateProvider.state('settings', {
            url: '/settings',
            templateUrl: 'settings/settings.controller.html',
            controller: 'SettingsController',
            controllerAs: 'vm',
            title: ' - Settings'

        });
    }
})();