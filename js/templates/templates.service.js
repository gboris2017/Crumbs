'use strict';

(function () {
    function TemplatesService(CONFIG, helperService, CrumbsCommonService) {
        this.getRelationships = function () {
            return CrumbsCommonService.getPartyList(1, 1);
        };

        this.getList = function (type) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/types/' + type);
        };

        this.getEmailTemplates = function () {
            return helperService.getJsonData(CONFIG.api.crumbs + '/template/email');
        };

        this.getEmailTemplateTags = function () {
            return helperService.getJsonData(CONFIG.api.crumbs + '/template/email/tags');
        };

        this.getSmsTemplates = function () {
            return helperService.getJsonData(CONFIG.api.crumbs + '/template/sms');
        };

        this.getSmsTemplateTags = function () {
            return helperService.getJsonData(CONFIG.api.crumbs + '/template/sms/tags');
        };

        this.getFlyerTemplates = function () {
            return helperService.getJsonData(CONFIG.api.crumbs + '/template/flyer');
        };

        this.getFlyerTemplateTags = function () {
            return helperService.getJsonData(CONFIG.api.crumbs + '/template/flyer/tags');
        };
    }

    angular.module('crumbs.templates').service('TemplatesService', ['CONFIG', 'helperService', 'CrumbsCommonService', TemplatesService]);
})();