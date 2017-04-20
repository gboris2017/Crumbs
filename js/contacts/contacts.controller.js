'use strict';

(function () {
    ContactsController.$inject = ["$rootScope", "$scope", "$ionicModal", "$ionicListDelegate", "ContactsService", "$http", "SharedService", "$ionicSideMenuDelegate", "helperService"];
    angular.module('crumbs.contacts').controller('ContactsController', ['$rootScope', '$scope', '$ionicModal', '$ionicListDelegate', 'ContactsService', '$http', 'SharedService', '$ionicSideMenuDelegate', 'helperService', ContactsController]);

    /** @ngInject */
    function ContactsController($rootScope, $scope, $ionicModal, $ionicListDelegate, ContactsService, $http, SharedService, $ionicSideMenuDelegate, helperService) {
        var vm = this;

        vm.partyTypeID = 1;

        vm.companies = [];
        vm.contacts = [];
        vm.editMode = false;
        vm.contactMode = false;
        vm.addNewMode = false;
        vm.editContact = {};
        vm.contactContact = {};

        vm.titlesList = [];
        vm.addressTypes = [];
        vm.phoneTelephoneTypes = [];
        vm.phoneCommunicationTypes = [];
        vm.phoneLocationTypes = [];
        vm.socialTypes = [];
        vm.emailTypes = [];
        vm.partyRoles = [];
        vm.shares = [];
        vm.relationships = [];

        $ionicModal.fromTemplateUrl('contact-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.contactsModal = modal;
        });

        vm.init = init;
        vm.closeEditMode = closeEditMode;
        vm.showContactOptions = showContactOptions;
        vm.contact = contact;
        vm.initEditMode = initEditMode;
        vm.initAddNewMode = initAddNewMode;
        vm.closeAddNewMode = closeAddNewMode;
        vm.initArtifacts = initArtifacts;
        vm.saveContact = saveContact;
        vm.saveNewContact = saveNewContact;
        vm.setToDefaultMode = setToDefaultMode;

        vm.addAddress = addAddress;
        vm.removeAddress = removeAddress;
        vm.addPhone = addPhone;
        vm.removePhone = removePhone;
        vm.addEmail = addEmail;
        vm.removeEmail = removeEmail;
        vm.addSocial = addSocial;
        vm.removeSocial = removeSocial;
        vm.addPartyRole = addPartyRole;
        vm.removePartyRole = removePartyRole;
        vm.addShare = addShare;
        vm.removeShare = removeShare;
        vm.closeOptionButtons = function () {
            $ionicListDelegate.closeOptionButtons();
        };

        vm.imageUpload = imageUpload;
        vm.triggerUpload = triggerUpload;
        vm.loadAllContacts = loadAllContacts;
        vm.initRelationshipContacts = initRelationshipContacts;
        vm.searchPartyRoleName = searchPartyRoleName;

        vm.states = {};
        vm.swipeRight = swipeRight;
        vm.swipeLeft = swipeLeft;

        function swipeRight(tt, id) {
            var rowName = 'row_contact_' + id;
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
            var rowName = 'row_contact_' + id;
            var content = $('#' + rowName).find('.item-content');
            var buttons = $('#' + rowName).find('.item-options');

            angular.forEach(buttons, function (btn) {
                if (!btn.classList.contains('invisible')) {
                    btn.classList.add('invisible');
                    content.css('transform', '');
                    vm.states[id].opened = false;
                } else {
                    btn.classList.remove('invisible');
                    content.css('transform', 'translate3d(-140px, 0, 0)');
                    if (!vm.states[id]) {
                        vm.states[id] = {};
                    }

                    vm.states[id].opened = true;
                }
            });
        }

        init();

        function initRelationshipContacts() {
            vm.relationships = [];
            ContactsService.getRelationships().then(function (result) {
                vm.relationships = result;
                vm.relationships.forEach(function (item) {
                    item.id = item.PartyRoleID;
                    item.name = item.PartyName;
                });
            }, function (error) {
                vm.relationships = [];
            });

            vm.companies = [];
            ContactsService.getCompanies().then(function (result) {
                vm.companies = result;
                vm.companies.forEach(function (item) {
                    item.id = item.partyID;
                    item.name = item.companyName;
                });
            }, function (error) {
                vm.companies = [];
            });
        }

        function loadAllContacts() {
            vm.contacts = [];
            vm.setToDefaultMode();
            vm.closeOptionButtons();
            ContactsService.getContacts().then(function (result) {
                vm.contacts = result;
            }, function (error) {
                vm.contacts = [];
            });
        }

        function init() {
            vm.initArtifacts();
            vm.loadAllContacts();
            vm.contacts.forEach(function (acc) {
                $http({ method: 'GET', url: CONFIG.api.crumbs + '/party/logos/logo-' + acc.PartyID }).then(function (data) {
                    acc.logo = data.data;
                }, function (error) {
                    console.log(error);
                });
            });

            vm.setToDefaultMode();
        }

        function setToDefaultMode() {
            vm.contacts.forEach(function (acc) {
                acc.editMode = false;
            });

            vm.contacts.forEach(function (acc) {
                acc.contactMode = false;
            });

            vm.editMode = false;
            vm.contactMode = false;
            vm.addNewMode = false;
        }

        function showContactOptions(contact, show) {
            vm.setToDefaultMode();
            contact.editMode = show;
        }

        function contact(contact) {
            vm.setToDefaultMode();
            vm.contactContact = contact;
            $scope.contactsModal.show();
            vm.closeOptionButtons();
        }

        function initEditMode(acc) {
            ContactsService.getContact(acc.PartyID).then(function (result) {
                vm.setToDefaultMode();
                acc.editMode = true;
                vm.editMode = true;
                vm.editContact = result;
                vm.editContact.parent = acc;
                vm.editContact.PartyID = acc.PartyID;
                loadContactAddresses(vm.editContact);
                loadContactEmails(vm.editContact);
                loadContactPhones(vm.editContact);
                loadContactSocial(vm.editContact);
                loadContactPartyRoleTypes(vm.editContact);
                vm.editContact.test1 = result.company ? result.company.PartyID : 0;
                vm.editContact.logo = acc.logo;
            }, function (error) {
                vm.closeOptionButtons();
            });
        }

        function loadContactAddresses(acc) {
            ContactsService.getPartyArtifacts(acc.PartyID, 'addresses').then(function (result) {
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

        function loadContactSocial(acc) {
            ContactsService.getPartyArtifacts(acc.PartyID, 'socials').then(function (result) {
                var index = 0;
                acc.socialsList = result;
                acc.socialsList.forEach(function (addr) {
                    addr.index = index++;
                    addr.type = addr.SocialMediaAccount.socialMediaTypeID;
                    addr.text = addr.SocialMediaAccount.detail;
                });

                acc.socialsListInitial = angular.copy(acc.socialsList);
            }, function (error) {
                vm.socialsList = [];
                acc.socialsListInitial = [];
            });
        }

        function loadContactEmails(acc) {
            ContactsService.getPartyArtifacts(acc.PartyID, 'emails').then(function (result) {
                var index = 0;
                acc.emailsList = result;
                acc.emailsList.forEach(function (addr) {
                    addr.index = index++;
                    addr.type = addr.EmailTypeID;
                    addr.text = addr.EmailAddress.emailAddress;
                });

                acc.emailsListInitial = angular.copy(acc.emailsList);
            }, function (error) {
                vm.emailsList = [];
                acc.emailsListInitial = [];
            });
        }

        function loadContactPhones(acc) {
            ContactsService.getPartyArtifacts(acc.PartyID, 'phones').then(function (result) {
                var index = 0;
                acc.phonesList = result;
                acc.phonesList.forEach(function (addr) {
                    addr.index = index++;
                    addr.type = addr.TelephoneTypeID;
                    addr.text = addr.TelephoneNumber.telephoneNumber;
                });

                acc.phonesListInitial = angular.copy(acc.phonesList);
            }, function (error) {
                vm.phonesList = [];
                acc.phonesListInitial = [];
            });
        }

        function loadContactPartyRoleTypes(acc) {
            ContactsService.getPartyArtifacts(acc.PartyID, 'party-roles').then(function (result) {
                var index = 0;
                acc.partyRolesList = result;
                acc.partyRolesList.forEach(function (p) {
                    p.index = index++;
                    p.type = p.PartyRoleTypeID;
                    p.text = p.PartyRoleType.name;
                });

                acc.partyRolesList.forEach(function (p) {
                    loadContactShares(p, p.iD);
                    loadContactOwner(p, p.iD);
                });

                acc.partyRolesListInitial = angular.copy(acc.partyRolesList);
            }, function (error) {
                vm.partyRolesList = [];
                acc.partyRolesListInitial = [];
            });
        }

        function loadContactShares(acc, partyRoleID) {
            acc.sharesList = [];
            ContactsService.getRelationshipsByType(partyRoleID, 14).then(function (result) {
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

        function loadContactOwner(acc, partyRoleID) {
            acc.ownerList = [];
            ContactsService.getRelationshipsByType(partyRoleID, 13).then(function (result) {
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

        function closeEditMode() {
            vm.setToDefaultMode();
            vm.closeOptionButtons();
        }

        function initAddNewMode() {
            vm.setToDefaultMode();
            vm.addNewMode = true;
            vm.editContact = {
                person: {
                    firstName: '',
                    middleName: '',
                    lastName: ''
                }
            };

            normalizeListsForItem(vm.editContact);
        }

        function closeAddNewMode() {
            vm.setToDefaultMode();
        }

        function saveNewContact() {
            var newContact = {
                party: {
                    partyTypeID: vm.partyTypeID,
                    active: true,
                    isInternal: true
                },
                company: null,
                test1: vm.editContact.test1,
                person: {
                    firstName: vm.editContact.person.firstName,
                    middleName: vm.editContact.person.middleName,
                    lastName: vm.editContact.person.lastName,
                    SalutationTypeID: vm.editContact.person.SalutationTypeID
                },
                trust: null
            };

            var oldData = angular.copy(vm.editContact);
            $http({
                url: CONFIG.api.crumbs + '/party', dataType: 'json',
                method: 'POST', data: newContact,
                headers: { 'Content-Type': 'application/json' }
            }).then(function (data) {
                var allLoaded = false;
                if (data.status == 201) {
                    vm.editContact = angular.copy(data.data);
                    for (var i = 0; i < vm.companies.length; i++) {
                        if (vm.companies[i].PartyID == oldData.test1) {
                            console.log(vm.editContact.party.iD);
                            vm.editContact.company = vm.companies[i];
                            $http({
                                url: CONFIG.api.crumbs + '/party/' + vm.editContact.party.iD,
                                dataType: 'json', method: 'PUT', data: vm.editContact,
                                headers: { 'Content-Type': 'application/json' }
                            }).then(function (data) {
                                vm.loadAllContacts();
                                allLoaded = true;
                            }, function (error) {
                                alert('Error occurred');
                                vm.closeOptionButtons();
                            });
                            break;
                        }
                    }

                    vm.editContact.emailsList = oldData.emailsList;
                    vm.editContact.phonesList = oldData.phonesList;
                    vm.editContact.socialsList = oldData.socialsList;
                    vm.editContact.partyRolesList = oldData.partyRolesList;
                    vm.editContact.person.PartyID = vm.editContact.person.partyID;
                    SharedService.savePartyArtifacts(vm.editContact.person.partyID, 'phone', vm.editContact.phonesList ? vm.editContact.phonesList : [], vm.editContact.phonesListInitial ? vm.editContact.phonesListInitial : []);
                    SharedService.savePartyArtifacts(vm.editContact.person.partyID, 'email', vm.editContact.emailsList ? vm.editContact.emailsList : [], vm.editContact.emailsListInitial ? vm.editContact.emailsListInitial : []);
                    SharedService.savePartyArtifacts(vm.editContact.person.partyID, 'social', vm.editContact.socialsList ? vm.editContact.socialsList : [], vm.editContact.socialsListInitial ? vm.editContact.socialsListInitial : []);
                    SharedService.savePartyArtifacts(vm.editContact.person.partyID, 'party-role', vm.editContact.partyRolesList ? vm.editContact.partyRolesList : [], vm.editContact.partyRolesListInitial ? vm.editContact.partyRolesListInitial : []);
                }

                if (allLoaded == false) {
                    vm.loadAllContacts();
                }
            }, function (error) {
                alert('Error occurred');
                vm.setToDefaultMode();
                vm.closeOptionButtons();
            });
        }

        $scope.setCustomAddress = function (id, value, index) {
            for (var i = 0; i < vm.editContact.addressesList.length; i++) {
                if (vm.editContact.addressesList[i].index == index) {
                    vm.editContact.addressesList[i].text = value;
                    vm.editContact.addressesList[i].addrId = id;
                    break;
                }
            }
        };

        function saveContact() {
            for (var i = 0; i < vm.companies.length; i++) {
                if (vm.companies[i].PartyID == vm.editContact.test1) {
                    console.log(vm.companies[i]);
                    vm.editContact.company = vm.companies[i];
                }
            }

            $http({
                url: CONFIG.api.crumbs + '/party/' + vm.editContact.person.PartyID,
                dataType: 'json', method: 'PUT', data: vm.editContact,
                headers: { 'Content-Type': 'application/json' }
            }).then(function (data) {
                SharedService.savePartyArtifacts(vm.editContact.person.partyID, 'address', vm.editContact.addressesList, vm.editContact.addressesListInitial);
                SharedService.savePartyArtifacts(vm.editContact.person.partyID, 'phone', vm.editContact.phonesList, vm.editContact.phonesListInitial);
                SharedService.savePartyArtifacts(vm.editContact.person.partyID, 'email', vm.editContact.emailsList, vm.editContact.emailsListInitial);
                SharedService.savePartyArtifacts(vm.editContact.person.partyID, 'social', vm.editContact.socialsList, vm.editContact.socialsListInitial);
                SharedService.savePartyArtifacts(vm.editContact.person.partyID, 'party-role', vm.editContact.partyRolesList, vm.editContact.partyRolesListInitial, true);
                vm.loadAllContacts();
            }, function (error) {
                console.log(error);
                alert('Error: ' + error.data.message);
                vm.closeOptionButtons();
            });
        }

        function initArtifacts() {
            initTitlesList();
            initAddressTypes();
            initPhoneTypes();
            initEmailTypes();
            initSocialTypes();
            initPartyRoles();
            initRelationshipContacts();
        }

        function initTitlesList() {
            ContactsService.getList('st').then(function (result) {
                vm.titlesList = result;
                applyForDropdown(vm.titlesList);
            }, function (error) {
                vm.titlesList = [];
            });
        }

        function initAddressTypes() {
            ContactsService.getList('at').then(function (result) {
                vm.addressTypes = result;
                applyForDropdown(vm.addressTypes);
            }, function (error) {
                vm.addressTypes = [];
            });
        }

        function initPhoneTypes() {
            ContactsService.getList('tt').then(function (result) {
                vm.phoneTypes = result;
                applyForDropdown(vm.phoneTypes);
            }, function (error) {
                vm.phoneTypes = [];
            });
        }

        function initEmailTypes() {
            ContactsService.getList('et').then(function (result) {
                vm.emailTypes = result;
                applyForDropdown(vm.emailTypes);
            }, function (error) {
                vm.emailTypes = [];
            });
        }

        function initSocialTypes() {
            ContactsService.getList('smt').then(function (result) {
                vm.socialTypes = result;
                applyForDropdown(vm.socialTypes);
            }, function (error) {
                vm.socialTypes = [];
            });
        }

        function initPartyRoles() {
            ContactsService.getList('prt').then(function (result) {
                vm.partyRoles = result;
                applyForDropdown(vm.partyRoles);
            }, function (error) {
                vm.partyRoles = [];
            });
        }

        function applyForDropdown(list) {
            list.forEach(function (item) {
                item.id = item.ID ? item.ID : item.Id ? item.Id : item.iD;
                item.name = item.Name ? item.Name : item.name;
            });
        }

        function searchPartyRoleName(addrId, name, index, id) {
            for (var i = 0; i < vm.partyRoles.length; i++) {
                if (vm.partyRoles[i].id == id) {
                    for (var j = 0; j < vm.editContact.partyRolesList.length; j++) {
                        if (vm.editContact.partyRolesList[j].type == 0) {
                            vm.editContact.partyRolesList[j].PartyRoleType = vm.partyRoles[i];
                            break;
                        }
                    }

                    break;
                }
            }
        }

        function normalizeListsForItem(acc) {
            var index = 0;
            acc.addressesList = acc.addressesList ? acc.addressesList : [];
            acc.addressesList.forEach(function (addr) {
                addr.index = index++;
            });

            index = 0;
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

            index = 0;
            acc.sharesList = acc.sharesList ? acc.sharesList : [];
            acc.sharesList.forEach(function (phone) {
                phone.index = index++;
            });
        }

        // address
        function addAddress() {
            vm.editContact.addressesList.push({ index: 0, type: 0, address: undefined });
            var index = 0;
            vm.editContact.addressesList.forEach(function (addr) {
                addr.index = index++;
            });
        }

        function removeAddress(index) {
            var indexToRemove = -1;
            for (var i = 0; i < vm.editContact.addressesList.length; i++) {
                if (vm.editContact.addressesList[i].index == index) {
                    indexToRemove = i;
                    break;
                }
            }

            if (indexToRemove > -1) {
                vm.editContact.addressesList.splice(indexToRemove, 1);
            }
        }

        // phone
        function addPhone() {
            vm.editContact.phonesList.push({ index: 0, type: 0, text: '' });
            var index = 0;
            vm.editContact.phonesList.forEach(function (addr) {
                addr.index = index++;
            });
        }

        function removePhone(index) {
            var indexToRemove = -1;
            for (var i = 0; i < vm.editContact.phonesList.length; i++) {
                if (vm.editContact.phonesList[i].index == index) {
                    indexToRemove = i;
                    break;
                }
            }

            if (indexToRemove > -1) {
                vm.editContact.phonesList.splice(indexToRemove, 1);
            }
        }

        // email
        function addEmail() {
            vm.editContact.emailsList.push({ index: 0, type: 0, text: '' });
            var index = 0;
            vm.editContact.emailsList.forEach(function (addr) {
                addr.index = index++;
            });
        }

        function removeEmail(index) {
            var indexToRemove = -1;
            for (var i = 0; i < vm.editContact.emailsList.length; i++) {
                if (vm.editContact.emailsList[i].index == index) {
                    indexToRemove = i;
                    break;
                }
            }

            if (indexToRemove > -1) {
                vm.editContact.emailsList.splice(indexToRemove, 1);
            }
        }

        // Social
        function addSocial() {
            vm.editContact.socialsList.push({ index: 0, type: 0, text: '' });
            var index = 0;
            vm.editContact.socialsList.forEach(function (social) {
                social.index = index++;
            });
        }

        function removeSocial(index) {
            var indexToRemove = -1;
            for (var i = 0; i < vm.editContact.socialsList.length; i++) {
                if (vm.editContact.socialsList[i].index == index) {
                    indexToRemove = i;
                    break;
                }
            }

            if (indexToRemove > -1) {
                vm.editContact.socialsList.splice(indexToRemove, 1);
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
                ownerListInitial: []
            };

            vm.editContact.partyRolesList.push(itemRole);
            var index = 0;
            vm.editContact.partyRolesList.forEach(function (social) {
                social.index = index++;
            });
        }

        function removePartyRole(index) {
            var indexToRemove = -1;
            for (var i = 0; i < vm.editContact.partyRolesList.length; i++) {
                if (vm.editContact.partyRolesList[i].index == index) {
                    indexToRemove = i;
                    break;
                }
            }

            if (indexToRemove > -1) {
                vm.editContact.partyRolesList.splice(indexToRemove, 1);
            }
        }

        // Shares
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

        function imageUpload(selectedfiles) {
            var f = selectedfiles[0];
            if (f) {
                var r = new FileReader();
                r.onloadend = function (e) {
                    $scope.$apply(function () {
                        vm.editContact.logo = e.target.result;
                        var fd = new FormData();
                        fd.append('logo', vm.editContact.logo);

                        $http({ method: 'POST', url: CONFIG.api.crumbs + '/party/' + vm.editContact.PartyID + '/upload-logo',
                            data: fd, headers: { 'Content-Type': undefined }
                        }).then(function (data) {
                            console.log(data);
                        }, function (error) {
                            alert('Error occurred');
                        });
                    });
                };

                r.readAsDataURL(f);
            }
        }

        function triggerUpload() {
            var fileuploader = angular.element('#fileInput');
            fileuploader.trigger('click');
        }
    }
})();