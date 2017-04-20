'use strict';

(function () {
    function AccountsService(CONFIG, helperService, CrumbsCommonService) {
        this.getAccounts = function () {
            return CrumbsCommonService.getPartyList(2, 108);
        };

        this.getContacts = function () {
            return CrumbsCommonService.getPartyList(1, 1);
        };

        this.getAccount = function (id) {
            return CrumbsCommonService.getParty(id);
        };

        this.getPartyArtifacts = function (id, artifact) {
            return CrumbsCommonService.getPartyArtifacts(id, artifact);
        };

        this.getList = function (type) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/types/' + type);
        };

        this.getRelationships = function (partyRoleId) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/partyrole/' + partyRoleId + '/children');
        };

        this.getRelationshipsByType = function (partyRoleId, relationshipId) {
            return CrumbsCommonService.getRelationshipsByType(partyRoleId, relationshipId);
        };

        this.getParentRelationshipsByType = function (partyRoleId, relationshipId) {
            return CrumbsCommonService.getParentRelationshipsByType(partyRoleId, relationshipId);
        };
    }

    angular.module('crumbs.accounts').service('AccountsService', ['CONFIG', 'helperService', 'CrumbsCommonService', AccountsService]);
})();