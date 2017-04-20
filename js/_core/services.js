'use strict';

(function () {
    function CrumbsCommonService(CONFIG, helperService) {
        this.getPartyList = function (pt, prt) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/party/search?pt=' + pt + '&prt=' + prt);
        };

        this.getPartyList = function (pt) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/party/search?pt=' + pt);
        };

        this.getParty = function (id) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/party/' + id);
        };

        this.getPartyArtifacts = function (id, artifact) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/party/' + id + '/' + artifact);
        };

        this.getRelationshipsByType = function (partyRoleId, relationshipId) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/partyrole/' + partyRoleId + '/children/' + relationshipId);
        };

        this.getParentRelationshipsByType = function (partyRoleId, relationshipId) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/partyrole/' + partyRoleId + '/parents/' + relationshipId);
        };

        this.getTypes = function (type) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/types/' + type);
        };

        this.loadNotes = function (id) {
            return helperService.getJsonData(CONFIG.api.crumbs + '/party/' + id + '/history-notes');
        };
    }

    angular.module('crumbs.core').service('CrumbsCommonService', ['CONFIG', 'helperService', CrumbsCommonService]);
})();