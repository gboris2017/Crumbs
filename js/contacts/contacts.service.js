'use strict';

(function () {
    function ContactsService(CONFIG, helperService, CrumbsCommonService) {
        this.getContacts = function () {
            return CrumbsCommonService.getPartyList(1);
        };

        this.getRelationships = function () {
            return CrumbsCommonService.getPartyList(2);
        };

        this.getCompanies = function () {
            return helperService.getJsonData(CONFIG.api.crumbs + '/companies');
        };

        this.getContact = function (id) {
            return CrumbsCommonService.getParty(id);
        };

        this.getPartyArtifacts = function (id, artifact) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/party/' + id + '/' + artifact);
        };

        this.getList = function (type) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/types/' + type);
        };

        this.getRelationshipsByType = function (partyRoleId, relationshipId) {
            return CrumbsCommonService.getRelationshipsByType(partyRoleId, relationshipId);
        };

        this.getParentRelationshipsByType = function (partyRoleId, relationshipId) {
            return CrumbsCommonService.getParentRelationshipsByType(partyRoleId, relationshipId);
        };

        this.searchAddress = function (text) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/address/search?frag=' + text);
        };
    }

    angular.module('crumbs.contacts').service('ContactsService', ['CONFIG', 'helperService', 'CrumbsCommonService', ContactsService]);
})();