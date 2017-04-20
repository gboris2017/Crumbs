'use strict';

(function () {
    MenuController.$inject = ["$rootScope", "$state", "$ionicSideMenuDelegate"];
    angular.module('crumbs.core').controller('MenuController', ['$rootScope', '$state', '$ionicSideMenuDelegate', MenuController]);

    /** @ngInject */
    function MenuController($rootScope, $state, $ionicSideMenuDelegate) {
        var vm = this;

        $rootScope.showSidebarContent = false;
        vm.menu = [{
            label: 'Home',
            state: 'home',
            icon: 'fa fa-home'
        }, {
            label: 'Contacts',
            state: 'contacts',
            icon: 'fa fa-user-o'
        }, {
            label: 'Accounts',
            state: 'accounts.list',
            icon: 'fa fa-briefcase'
        }, {
            label: 'Lists',
            state: 'lists',
            icon: 'fa fa-list-ol'
        }, {
            label: 'Campaigns',
            state: 'campaigns',
            icon: 'fa fa-share-alt'
        }, {
            label: 'Orphans',
            state: 'orphans',
            icon: 'fa fa-link'
        }, {
            label: 'Users',
            state: 'users',
            icon: 'fa fa-users'
        }, {
            label: 'Templates',
            state: 'templates',
            icon: 'fa fa-file-text-o'
        }, {
            label: 'Settings',
            state: 'settings',
            icon: 'fa fa-cog'
        }];

        vm.changeState = function (menu) {
            $rootScope.rolesMode = 1;
            $ionicSideMenuDelegate.canDragContent(true);
            $state.go(menu.state);
        };
    }
})();