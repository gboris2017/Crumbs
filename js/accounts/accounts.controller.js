'use strict';

(function () {
    AccountsListController.$inject = ["$scope", "$rootScope", "accounts", "$ionicListDelegate", "AccountsService", "$ionicSideMenuDelegate", "$http", "SharedService"];
    angular.module('crumbs.accounts').controller('AccountsListController', ['$scope', '$rootScope', 'accounts', '$ionicListDelegate', 'AccountsService', '$ionicSideMenuDelegate', '$http', 'SharedService', AccountsListController]);

    /** @ngInject */
    function AccountsListController($scope, $rootScope, accounts, $ionicListDelegate, AccountsService, $ionicSideMenuDelegate, $http, SharedService) {
        var vm = this;

        vm.accounts = accounts;
        vm.addressTypes = [];
        vm.phoneTypes = [];
        vm.socialTypes = [];
        vm.emailTypes = [];
        vm.relationshipTypes = [];
        vm.partyRoles = [];
        vm.shares = [];
        vm.relationships = [];
        vm.editMode = false;
        vm.addNewMode = false;
        vm.searchAddresses = [];
        vm.editAccount = {};

        vm.init = initList;
        vm.initEditMode = initEditMode;
        vm.initAddNewMode = initAddNewMode;
        vm.saveNewAccount = saveNewAccount;
        vm.saveAccount = saveAccount;
        vm.showOptions = showOptions;
        vm.closeAddNewMode = closeAddNewMode;
        vm.closeEditMode = closeEditMode;
        vm.addAddress = addAddress;
        vm.removeAddress = removeAddress;
        vm.addPhone = addPhone;
        vm.removePhone = removePhone;
        vm.addEmail = addEmail;
        vm.removeEmail = removeEmail;
        vm.addSocial = addSocial;
        vm.removeSocial = removeSocial;
        vm.addRelationship = addRelationship;
        vm.removeRelationship = removeRelationship;
        vm.addPartyRole = addPartyRole;
        vm.removePartyRole = removePartyRole;
        vm.addShare = addShare;
        vm.removeShare = removeShare;
        vm.closeOptionButtons = function () {
            $ionicListDelegate.closeOptionButtons();
        };

        vm.imageUpload = imageUpload;
        vm.triggerUpload = triggerUpload;
        vm.loadAllAccounts = loadAllAccounts;
        vm.searchPartyRoleNameAccount = searchPartyRoleNameAccount;
        vm.goToPrimaryContact = goToPrimaryContact;

        vm.states = {};
        vm.swipeRight = swipeRight;
        vm.swipeLeft = swipeLeft;

        function swipeRight(tt, id) {
            var rowName = 'row_account_' + id;
            var content = $('#' + rowName).find('.item-content');
            var buttons = $('#' + rowName).find('.item-options');

            var currentState = vm.states[id];
            if (currentState && currentState.opened == true) {
                angular.forEach(buttons, function (btn) {
                    btn.classList.add('invisible');
                    content.css('transform', '');
                    if (!vm.states[id]) {
                        vm.states[id] = { opened: false };
                    }

                    vm.states[id].opened = false;
                });
            } else {
                $rootScope.loadNotes(id);
                if (!$ionicSideMenuDelegate.isOpenLeft()) {
                    $ionicSideMenuDelegate.toggleLeft();
                }
            }
        }

        function swipeLeft(tt, id) {
            var rowName = 'row_account_' + id;
            var content = $('#' + rowName).find('.item-content');
            var buttons = $('#' + rowName).find('.item-options');

            angular.forEach(buttons, function (btn) {
                if (!btn.classList.contains('invisible')) {
                    btn.classList.add('invisible');
                    content.css('transform', '');
                    vm.states[id].opened = false;
                } else {
                    btn.classList.remove('invisible');
                    content.css('transform', 'translate3d(-240px, 0, 0)');
                    if (!vm.states[id]) {
                        vm.states[id] = {};
                    }

                    vm.states[id].opened = true;
                }
            });
        }

        function goToPrimaryContact(acc) {
            console.log(acc);
            alert('In progress');
        }

        initList();

        function loadAllAccounts() {
            vm.accounts = [];
            vm.closeEditMode();
            vm.closeOptionButtons();
            AccountsService.getAccounts().then(function (result) {
                vm.accounts = result;
            }, function (error) {
                vm.accounts = [];
            });
        }

        function initList() {
            vm.accounts = accounts;
            vm.closeEditMode();
            initAdditionalData();
        }

        // edit
        function showOptions(acc, show) {
            vm.closeEditMode();
            acc.editMode = show;
        }

        function closeEditMode() {
            vm.accounts.forEach(function (acc) {
                acc.editMode = false;
            });

            vm.editMode = false;
            vm.closeOptionButtons();
        }

        function initEditMode(acc) {
            AccountsService.getAccount(acc.PartyID).then(function (result) {
                vm.editAccount = {};
                vm.addNewMode = false;
                vm.editMode = true;
                acc.editMode = true;
                vm.editAccount = result;
                vm.editAccount.parent = acc;
                vm.editAccount.PartyID = acc.PartyID;

                loadAccountAddresses(vm.editAccount);
                loadAccountEmails(vm.editAccount);
                loadAccountPhones(vm.editAccount);
                loadAccountSocial(vm.editAccount);
                loadAccountPartyRoleTypes(vm.editAccount);
            }, function (error) {
                vm.closeOptionButtons();
            });
        }

        function loadAccountAddresses(acc) {
            acc.addressesList = [];
            AccountsService.getPartyArtifacts(acc.PartyID, 'addresses').then(function (result) {
                var index = 0;
                acc.addressesList = result;
                acc.addressesList.forEach(function (addr) {
                    addr.index = index++;
                    addr.type = addr.AddressTypeID;
                    addr.text = addr.Address.addressText;
                });

                acc.addressesListInitial = angular.copy(acc.addressesList);
            }, function (error) {
                vm.addressesList = [];
                acc.addressesListInitial = [];
            });
        }

        function loadAccountEmails(acc) {
            acc.emailsList = [];
            AccountsService.getPartyArtifacts(acc.PartyID, 'emails').then(function (result) {
                var index = 0;
                acc.emailsList = result;
                acc.emailsList.forEach(function (addr) {
                    addr.index = index++;
                    addr.type = addr.EmailTypeID;
                    addr.text = addr.EmailAddress.emailAddress;
                });

                acc.emailsListInitial = angular.copy(acc.emailsList);
            }, function (error) {
                acc.emailsList = [];
                acc.emailsListInitial = [];
            });
        }

        function loadAccountPhones(acc) {
            acc.phonesList = [];
            AccountsService.getPartyArtifacts(acc.PartyID, 'phones').then(function (result) {
                var index = 0;
                acc.phonesList = result;
                acc.phonesList.forEach(function (addr) {
                    addr.index = index++;
                    addr.type = addr.TelephoneTypeID;
                    addr.text = addr.TelephoneNumber.telephoneNumber;
                });

                acc.phonesListInitial = angular.copy(acc.phonesList);
            }, function (error) {
                acc.phonesList = [];
                acc.phonesListInitial = [];
            });
        }

        function loadAccountSocial(acc) {
            acc.socialsList = [];
            AccountsService.getPartyArtifacts(acc.PartyID, 'socials').then(function (result) {
                var index = 0;
                acc.socialsList = result;
                acc.socialsList.forEach(function (addr) {
                    addr.index = index++;
                    addr.type = addr.SocialMediaAccount.socialMediaTypeID;
                    addr.text = addr.SocialMediaAccount.detail;
                });

                acc.socialsListInitial = angular.copy(acc.socialsList);
            }, function (error) {
                acc.socialsList = [];
                acc.socialsListInitial = [];
            });
        }

        function loadAccountPartyRoleTypes(acc) {
            acc.partyRolesList = [];
            AccountsService.getPartyArtifacts(acc.PartyID, 'party-roles').then(function (result) {
                var index = 0;
                acc.partyRolesList = result;
                acc.partyRolesList.forEach(function (p) {
                    p.index = index++;
                    p.type = p.PartyRoleTypeID;
                    p.text = p.PartyRoleType.name;
                });

                acc.partyRolesList.forEach(function (p) {
                    loadAccountShares(p, p.iD);
                    loadAccountOwner(p, p.iD);
                    loadAccountRelationships(p, p.iD);
                    loadAccountPrimaryContact(p, p.iD);
                });

                acc.partyRolesListInitial = angular.copy(acc.partyRolesList);
            }, function (error) {
                acc.partyRolesList = [];
                acc.partyRolesListInitial = [];
            });
        }

        function loadAccountShares(acc, partyRoleID) {
            AccountsService.getRelationshipsByType(partyRoleID, 14).then(function (result) {
                var index = 0;
                acc.sharesList = result;
                acc.sharesList.forEach(function (p) {
                    p.index = index++;
                });

                acc.sharesListInitial = angular.copy(acc.sharesList);
            }, function (error) {
                acc.sharesList = [];
                acc.sharesListInitial = [];
            });
        }

        function loadAccountRelationships(acc, partyRoleID) {
            AccountsService.getRelationships(partyRoleID).then(function (result) {
                var index = 0;
                acc.relationshipsList = result;
                acc.relationshipsList.forEach(function (p) {
                    p.index = index++;
                });

                acc.relationshipsListInitial = angular.copy(acc.relationshipsList);
            }, function (error) {
                acc.relationshipsList = [];
                acc.relationshipsListInitial = [];
            });
        }

        function loadAccountPrimaryContact(acc, partyRoleID) {
            AccountsService.getParentRelationshipsByType(partyRoleID, 18).then(function (result) {
                var index = 0;
                acc.primaryContactList = [];
                for (var i = 0; i < result.length; i++) {
                    acc.primaryContactList.push(result[i]);
                    break;
                }

                if (acc.primaryContactList.length == 0) {
                    var item = {
                        index: 0,
                        party: {
                            PartyRoleID: 0
                        }
                    };
                    acc.primaryContactList.push(item);
                }

                acc.primaryContactList.forEach(function (p) {
                    p.index = index++;
                });

                acc.primaryContactListInitial = angular.copy(acc.primaryContactList);
            }, function (error) {
                acc.primaryContactList = [];
                acc.primaryContactListInitial = [];
                var item = {
                    index: 0,
                    party: {
                        PartyRoleID: 0
                    }
                };

                acc.primaryContactList.push(item);
            });
        }

        function loadAccountOwner(acc, partyRoleID) {
            AccountsService.getRelationshipsByType(partyRoleID, 13).then(function (result) {
                var index = 0;
                acc.ownerList = [];
                for (var i = 0; i < result.length; i++) {
                    acc.ownerList.push(result[i]);
                    break;
                }

                if (acc.ownerList.length == 0) {
                    var item = {
                        index: 0,
                        party: {
                            PartyRoleID: 0
                        }
                    };
                    acc.ownerList.push(item);
                }

                acc.ownerList.forEach(function (p) {
                    p.index = index++;
                });

                acc.ownerListInitial = angular.copy(acc.ownerList);
            }, function (error) {
                acc.ownerList = [];
                acc.ownerListInitial = [];
                var item = {
                    index: 0,
                    party: {
                        PartyRoleID: 0
                    }
                };

                acc.ownerList.push(item);
            });
        }

        $scope.setCustomAddress = function (id, value, index) {
            for (var i = 0; i < vm.editAccount.addressesList.length; i++) {
                if (vm.editAccount.addressesList[i].index == index) {
                    vm.editAccount.addressesList[i].text = value;
                    vm.editAccount.addressesList[i].addrId = id;
                    break;
                }
            }
        };

        function saveAccount() {
            $http({
                url: CONFIG.api.crumbs + '/party/' + vm.editAccount.company.PartyID,
                dataType: 'json', method: 'PUT', data: vm.editAccount,
                headers: { 'Content-Type': 'application/json' }
            }).then(function (data) {
                SharedService.savePartyArtifacts(vm.editAccount.company.PartyID, 'address', vm.editAccount.addressesList, vm.editAccount.addressesListInitial);
                SharedService.savePartyArtifacts(vm.editAccount.company.PartyID, 'phone', vm.editAccount.phonesList, vm.editAccount.phonesListInitial);
                SharedService.savePartyArtifacts(vm.editAccount.company.PartyID, 'email', vm.editAccount.emailsList, vm.editAccount.emailsListInitial);
                SharedService.savePartyArtifacts(vm.editAccount.company.PartyID, 'social', vm.editAccount.socialsList, vm.editAccount.socialsListInitial);
                SharedService.savePartyArtifacts(vm.editAccount.company.PartyID, 'party-role', vm.editAccount.partyRolesList, vm.editAccount.partyRolesListInitial, false);

                //SharedService.processRelationship(vm.editAccount['parent'].PartyRoleID, vm.editAccount.relationshipsList, vm.editAccount.relationshipsListInitial, 0);
                //SharedService.processRelationship(vm.editAccount['parent'].PartyRoleID, vm.editAccount.sharesList, vm.editAccount.sharesListInitial, 14);
                //SharedService.processRelationship(vm.editAccount['parent'].PartyRoleID, vm.editAccount.primaryContactList, vm.editAccount.primaryContactListInitial, 18);
                //SharedService.processRelationship(vm.editAccount['parent'].PartyRoleID, vm.editAccount.ownerList, vm.editAccount.ownerListInitial, 13);
                vm.loadAllAccounts();
            }, function (error) {
                alert('Error occurred');
                vm.closeOptionButtons();
            });
        }

        // add new
        function initAddNewMode() {
            vm.closeEditMode();
            vm.addNewMode = true;
            vm.editAccount = {
                company: {
                    aBNRegistered: undefined,
                    aBN: '',
                    aCN: ''
                }
            };

            normalizeListsForItem(vm.editAccount);
        }

        function closeAddNewMode() {
            vm.addNewMode = false;
            vm.closeOptionButtons();
        }

        function saveNewAccount() {
            vm.addNewMode = false;
            vm.closeOptionButtons();

            var newAccount = {
                party: {
                    partyTypeID: 2,
                    active: true,
                    isInternal: true
                },
                person: null,
                company: {
                    aBNRegistered: vm.editAccount.company.aBNRegistered,
                    aBN: vm.editAccount.company.aBN,
                    aCN: vm.editAccount.company.aCN,
                    companyName: vm.editAccount.company.companyName,
                    preferredName: vm.editAccount.company.preferredName
                },
                trust: null
            };

            var oldData = angular.copy(vm.editAccount);
            $http({
                url: CONFIG.api.crumbs + '/party',
                dataType: 'json', method: 'POST', data: newAccount,
                headers: { 'Content-Type': 'application/json' }
            }).then(function (data) {
                if (data.status == 201) {
                    vm.editAccount = angular.copy(data.data);
                    vm.editAccount.emailsList = oldData.emailsList;
                    vm.editAccount.phonesList = oldData.phonesList;
                    vm.editAccount.socialsList = oldData.socialsList;
                    vm.editAccount.partyRolesList = oldData.partyRolesList;
                    vm.editAccount.company.PartyID = vm.editAccount.company.partyID;
                    SharedService.savePartyArtifacts(vm.editAccount.company.partyID, 'phone', vm.editAccount.phonesList ? vm.editAccount.phonesList : [], vm.editAccount.phonesListInitial ? vm.editAccount.phonesListInitial : []);
                    SharedService.savePartyArtifacts(vm.editAccount.company.partyID, 'email', vm.editAccount.emailsList ? vm.editAccount.emailsList : [], vm.editAccount.emailsListInitial ? vm.editAccount.emailsListInitial : []);
                    SharedService.savePartyArtifacts(vm.editAccount.company.partyID, 'social', vm.editAccount.socialsList ? vm.editAccount.socialsList : [], vm.editAccount.socialsListInitial ? vm.editAccount.socialsListInitial : []);
                    SharedService.savePartyArtifacts(vm.editAccount.company.partyID, 'party-role', vm.editAccount.partyRolesList ? vm.editAccount.partyRolesList : [], vm.editAccount.partyRolesListInitial ? vm.editAccount.partyRolesListInitial : []);
                }

                vm.loadAllAccounts();
            }, function (error) {
                alert('Error occurred');
                vm.setToDefaultMode();
                vm.closeOptionButtons();
            });
        }

        function normalizeListsForItem(acc) {
            var index = 0;
            acc.phonesList = acc.phonesList ? acc.phonesList : [];
            acc.phonesList.forEach(function (phone) {
                phone.index = index++;
            });

            index = 0;
            acc.emailsList = acc.emailsList ? acc.emailsList : [];
            acc.emailsList.forEach(function (phone) {
                phone.index = index++;
            });

            index = 0;
            acc.socialsList = acc.socialsList ? acc.socialsList : [];
            acc.socialsList.forEach(function (phone) {
                phone.index = index++;
            });

            index = 0;
            acc.partyRolesList = acc.partyRolesList ? acc.partyRolesList : [];
            acc.partyRolesList.forEach(function (phone) {
                phone.index = index++;
            });
        }

        // address
        function addAddress() {
            vm.editAccount.addressesList.push({ index: 0, type: 0, address: undefined });
            var index = 0;
            vm.editAccount.addressesList.forEach(function (addr) {
                addr.index = index++;
            });
        }

        function removeAddress(index) {
            var indexToRemove = -1;
            for (var i = 0; i < vm.editAccount.addressesList.length; i++) {
                if (vm.editAccount.addressesList[i].index == index) {
                    indexToRemove = i;
                    break;
                }
            }

            if (indexToRemove > -1) {
                vm.editAccount.addressesList.splice(indexToRemove, 1);
            }
        }

        // phone
        function addPhone() {
            vm.editAccount.phonesList.push({ index: 0, type: 0, text: '' });
            var index = 0;
            vm.editAccount.phonesList.forEach(function (addr) {
                addr.index = index++;
            });
        }

        function removePhone(index) {
            var indexToRemove = -1;
            for (var i = 0; i < vm.editAccount.phonesList.length; i++) {
                if (vm.editAccount.phonesList[i].index == index) {
                    indexToRemove = i;
                    break;
                }
            }

            if (indexToRemove > -1) {
                vm.editAccount.phonesList.splice(indexToRemove, 1);
            }
        }

        // email
        function addEmail() {
            vm.editAccount.emailsList.push({ index: 0, type: 0, text: '' });
            var index = 0;
            vm.editAccount.emailsList.forEach(function (addr) {
                addr.index = index++;
            });
        }

        function removeEmail(index) {
            var indexToRemove = -1;
            for (var i = 0; i < vm.editAccount.emailsList.length; i++) {
                if (vm.editAccount.emailsList[i].index == index) {
                    indexToRemove = i;
                    break;
                }
            }

            if (indexToRemove > -1) {
                vm.editAccount.emailsList.splice(indexToRemove, 1);
            }
        }

        // Social
        function addSocial() {
            vm.editAccount.socialsList.push({ index: 0, type: 0, text: '' });
            var index = 0;
            vm.editAccount.socialsList.forEach(function (social) {
                social.index = index++;
            });
        }

        function removeSocial(index) {
            var indexToRemove = -1;
            for (var i = 0; i < vm.editAccount.socialsList.length; i++) {
                if (vm.editAccount.socialsList[i].index == index) {
                    indexToRemove = i;
                    break;
                }
            }

            if (indexToRemove > -1) {
                vm.editAccount.socialsList.splice(indexToRemove, 1);
            }
        }

        // Relationship
        function addRelationship(list) {
            var itemRel = {
                index: 0,
                type: {
                    RelationshipTypeID: 0
                },
                party: {
                    PartyRoleID: 0
                }
            };

            list.push(itemRel);
            var index = 0;
            list.forEach(function (item) {
                item.index = index++;
            });
        }

        function removeRelationship(list, index) {
            var indexToRemove = -1;
            for (var i = 0; i < list.length; i++) {
                if (list[i].index == index) {
                    indexToRemove = i;
                    break;
                }
            }

            if (indexToRemove > -1) {
                list.splice(indexToRemove, 1);
            }
        }

        // Party Role
        function addPartyRole() {
            var itemRole = {
                index: 0,
                type: 0,
                text: '',
                sharesList: [],
                sharesListInitial: [],
                ownerList: [{
                    index: 0,
                    party: {
                        PartyRoleID: 0
                    }
                }],
                ownerListInitial: [],
                relationshipsList: [],
                relationshipsListInitial: [],
                primaryContactList: [{
                    index: 0,
                    party: {
                        PartyRoleID: 0
                    }
                }],
                primaryContactListInitial: []
            };

            vm.editAccount.partyRolesList.push(itemRole);
            var index = 0;
            vm.editAccount.partyRolesList.forEach(function (social) {
                social.index = index++;
            });
        }

        function removePartyRole(index) {
            var indexToRemove = -1;
            for (var i = 0; i < vm.editAccount.partyRolesList.length; i++) {
                if (vm.editAccount.partyRolesList[i].index == index) {
                    indexToRemove = i;
                    break;
                }
            }

            if (indexToRemove > -1) {
                vm.editAccount.partyRolesList.splice(indexToRemove, 1);
            }
        }

        function addShare(list) {
            var itemShare = { index: 0, type: 0, text: '' };
            list.push(itemShare);
            var index = 0;
            list.forEach(function (social) {
                social.index = index++;
            });
        }

        function removeShare(list, index) {
            var indexToRemove = -1;
            for (var i = 0; i < list.length; i++) {
                if (list[i].index == index) {
                    indexToRemove = i;
                    break;
                }
            }

            if (indexToRemove > -1) {
                list.splice(indexToRemove, 1);
            }
        }

        function initAdditionalData() {
            initAddressTypes();
            initPhoneTypes();
            initEmailTypes();
            initSocialTypes();
            initRelationshipTypes();
            initPartyRoles();
            initRelationshipContacts();
        }

        function applyForDropdown(list) {
            list.forEach(function (item) {
                item.id = item.iD;

                // item['name'] = item.Name;
            });
        }

        function initAddressTypes() {
            vm.addressTypes = [];
            AccountsService.getList('at').then(function (result) {
                vm.addressTypes = result;
                applyForDropdown(vm.addressTypes);
            }, function (error) {
                vm.addressTypes = [];
            });
        }

        function initPhoneTypes() {
            AccountsService.getList('tt').then(function (result) {
                vm.phoneTypes = result;
                applyForDropdown(vm.phoneTypes);
            }, function (error) {
                vm.phoneTypes = [];
            });
        }

        function initEmailTypes() {
            AccountsService.getList('et').then(function (result) {
                vm.emailTypes = result;
                applyForDropdown(vm.emailTypes);
            }, function (error) {
                vm.emailTypes = [];
            });
        }

        function initSocialTypes() {
            AccountsService.getList('smt').then(function (result) {
                vm.socialTypes = result;
                applyForDropdown(vm.socialTypes);
            }, function (error) {
                vm.socialTypes = [];
            });
        }

        function initRelationshipTypes() {
            AccountsService.getList('rel').then(function (result) {
                vm.relationshipTypes = result;
                applyForDropdown(vm.relationshipTypes);
            }, function (error) {
                vm.relationshipTypes = [];
            });
        }

        function initPartyRoles() {
            AccountsService.getList('prt').then(function (result) {
                vm.partyRoles = result;
                vm.partyRoles.forEach(function (item) {
                    item.id = item.iD;
                });
            }, function (error) {
                vm.partyRoles = [];
            });
        }

        function initRelationshipContacts() {
            vm.contacts = [];
            AccountsService.getContacts().then(function (result) {
                vm.relationships = result;
                vm.relationships.forEach(function (item) {
                    item.id = item.PartyRoleID;
                    item.name = item.PartyName;
                });
            }, function (error) {
                vm.relationships = [];
            });
        }

        function searchPartyRoleNameAccount(addrId, name, index, id) {
            // console.log("Search HERe " + addrId + " - " + name + " - " + index + " - " + id);
            // console.log(vm.partyRoles);
            // for (var i = 0; i < vm.partyRoles.length; i++) {
            //     if (vm.partyRoles[i].iD == id) {
            //         var name = vm.partyRoles[i].name;
            //         for (var j = 0; j < vm.editAccount.partyRolesList.length; j++) {
            //             console.log(vm.editAccount.partyRolesList[j]);
            //             console.log(vm.editAccount.partyRolesList[j]['PartyRoleTypeID'] + " - " + id);
            //             if (vm.editAccount.partyRolesList[j]['type'] == id) {
            //
            //             }
            //             // if (vm.editAccount.partyRolesList[j]['type'] == 0) {
            //             //     vm.editAccount.partyRolesList[j]['PartyRoleType'] = vm.partyRoles[i];
            //             // } else if (vm.editAccount.partyRolesList[j].type > 0 && name && name.length > 0) {
            //             //     vm.editAccount.partyRolesList[j]['PartyRoleType'] = name;
            //             // }
            //             //break;
            //         }
            //         //break;
            //     }
            // }

            // TODO
        }

        function imageUpload(selectedfiles) {
            var f = selectedfiles[0];
            if (f) {
                var r = new FileReader();
                r.onloadend = function (e) {
                    $scope.$apply(function () {
                        vm.editAccount.logo = e.target.result;
                    });
                };

                r.readAsDataURL(f);
            }
        }

        function triggerUpload() {
            var fileuploader = angular.element('#fileInputAcc');
            fileuploader.trigger('click');
        }
    }
})();