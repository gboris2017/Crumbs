'use strict';

(function () {
    function OrphansService(CONFIG, helperService, CrumbsCommonService) {
        this.getOrphans = function () {
            return helperService.getJsonData(CONFIG.api.crumbs + '/orphans?l=10');
        };

        this.getList = function (type) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/types/' + type);
        };

        this.getContacts = function () {
            return CrumbsCommonService.getPartyList(1);
        };

        this.getAccounts = function () {
            return CrumbsCommonService.getPartyList(2);
        };
    }

    angular.module('crumbs.orphans').service('OrphansService', ['CONFIG', 'helperService', 'CrumbsCommonService', OrphansService]);
})();