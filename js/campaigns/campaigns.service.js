'use strict';

(function () {
    function CampaignsService(CONFIG, helperService, CrumbsCommonService) {
        this.getListSidebar = function (type) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/campaigns?type=' + type);
        };

        this.getLists = function () {
            return helperService.getJsonData(CONFIG.api.crumbs + '/lists');
        };

        this.getCampaign = function (id) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/campaigns/' + id);
        };

        this.getTypes = function (type) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/types/' + type);
        };

        this.getTemplate = function (type, template) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/template/' + type + '/' + template);
        };
    }

    angular.module('crumbs.campaigns').service('CampaignsService', ['CONFIG', 'helperService', 'CrumbsCommonService', CampaignsService]);
})();