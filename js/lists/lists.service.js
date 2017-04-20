'use strict';

(function () {
    function ListsService(CONFIG, helperService, CrumbsCommonService) {
        this.getLookForTypes = function (listType) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/lists/lookFor');
        };

        this.getList = function (id) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/lists/' + id);
        };

        this.getListSidebar = function (type) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/lists?type=' + type);
        };

        this.getFiltersStates = function () {
            return helperService.getJsonData(CONFIG.api.crumbs + '/states');
        };

        this.getFilters = function (type) {
            return CrumbsCommonService.getTypes(type);
        };

        this.getOwners = function () {
            return CrumbsCommonService.getPartyList(1, 1);
        };
    }

    angular.module('crumbs.lists').service('ListsService', ['CONFIG', 'helperService', 'CrumbsCommonService', ListsService]);
})();