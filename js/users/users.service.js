'use strict';

(function () {
    function UsersService(CONFIG, helperService, CrumbsCommonService) {
        this.getUsers = function () {
            return helperService.getJsonData(CONFIG.api.crumbs + '/users');
        };

        this.getUser = function (id) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/user/' + id);
        };
    }

    angular.module('crumbs.users').service('UsersService', ['CONFIG', 'helperService', 'CrumbsCommonService', UsersService]);
})();