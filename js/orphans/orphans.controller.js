'use strict';

(function () {
    OrphansController.$inject = ["ContactsService", "$ionicListDelegate", "$scope", "$ionicModal", "OrphansService"];
    angular.module('crumbs.orphans').controller('OrphansController', ['ContactsService', '$ionicListDelegate', '$scope', '$ionicModal', 'OrphansService', OrphansController]);

    /** @ngInject */
    function OrphansController(ContactsService, $ionicListDelegate, $scope, $ionicModal, OrphansService) {
        var vm = this;

        $scope.linkModal = undefined;
        $ionicModal.fromTemplateUrl('orphans/orphans.modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.linkModal = modal;
        });

        vm.openLinkModal = function () {
            vm.modalOpened = true;
            $scope.linkModal.show();
        };

        vm.closeLinkModal = function () {
            vm.modalOpened = false;
            $scope.linkModal.hide();
        };

        vm.saveLink = saveLink;

        vm.linkMode = true;
        vm.relationshipTypes = [];
        vm.relatedParties = [];
        vm.modalOpened = false;

        vm.init = init;
        vm.link = link;
        vm.setToDefaultMode = setToDefaultMode;
        vm.applyForDropdown = applyForDropdown;
        vm.closeOptionButtons = function () {
            $ionicListDelegate.closeOptionButtons();
        };

        init();

        function init() {
            OrphansService.getOrphans().then(function (result) {
                vm.orphans = result;
            }, function (error) {
                vm.orphans = [];
            });

            OrphansService.getList('rel').then(function (result) {
                vm.relationshipTypes = result;
                applyForDropdown(vm.relationshipTypes);
            }, function (error) {
                vm.relationshipTypes = [];
            });
            vm.relatedParties = [];
            OrphansService.getContacts().then(function (result) {
                for (var i = 0; i < result.length; i++) {
                    vm.relatedParties.push({
                        id: result[i].PartyID,
                        name: result[i].PartyName
                    });
                }
            }, function (error) {});
            OrphansService.getAccounts().then(function (result) {
                for (var i = 0; i < result.length; i++) {
                    vm.relatedParties.push({
                        id: result[i].PartyID,
                        name: result[i].PartyName
                    });
                }
            }, function (error) {});
        }

        function applyForDropdown(list) {
            list.forEach(function (item) {
                item.id = item.iD;
            });
        }

        function setToDefaultMode() {
            for (var i = 0; i < vm.orphans.length; i++) {
                var orphan = vm.orphans[i];
                orphan.linkMode = false;
            }

            vm.linkMode = false;
        }

        function link() {
            vm.modalOpened = false;
            vm.setToDefaultMode();
            vm.openLinkModal();
            vm.closeOptionButtons();
        }

        function saveLink(orphan) {

            // var relateItem = {
            //     parentPartyRoleId: parentPartyRoleId,
            //     childPartyRoleId: item.party.PartyRoleID,
            //     relationshipTypeId: relationshipTypeId > 0
            //         ? relationshipTypeId : item.type.RelationshipTypeID,
            // };

            // TODO relate
        }
    }
})();