'use strict';

(function () {
    configure.$inject = ["$stateProvider"];
    angular.module('crumbs.contacts', ['crumbs.core']).config(configure);

    /** @ngInject */
    function configure($stateProvider) {
        $stateProvider.state('contacts', {
            url: '/contacts',
            templateUrl: 'contacts/contacts.controller.html',
            controller: 'ContactsController',
            controllerAs: 'vm'

        });
    }
})();