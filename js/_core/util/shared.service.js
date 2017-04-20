'use strict';

(function () {
    angular.module('crumbs.core').service('SharedService', ['$http', 'CONFIG', function ($http, CONFIG) {
        this.processListChangesExtended = function (artifact, list, listInitial) {
            var deleteList = [];
            var updateList = [];
            var createList = [];

            if (artifact == 'address') {
                console.log(list);
                console.log(listInitial);
            }

            var tempList = [];
            var tempListUnique = [];
            for (var j = 0; j < list.length; j++) {
                var uniqueItem = list[j].type + '_' + list[j].text;
                if (tempListUnique.indexOf(uniqueItem) == -1) {
                    tempList.push(list[j]);
                    tempListUnique.push(uniqueItem);
                }
            }

            list = tempList;

            for (var i = 0; i < listInitial.length; i++) {
                var initialItem = listInitial[i];
                var itemFound = false;
                for (var j = 0; j < list.length; j++) {
                    var currentItem = list[j];
                    if (initialItem.type == currentItem.type && initialItem.text == currentItem.text || initialItem.iD && currentItem.iD && initialItem.iD == currentItem.iD) {
                        itemFound = true;
                        break;
                    }
                }

                if (!itemFound) {
                    deleteList.push(initialItem.iD);
                }
            }

            for (var j = 0; j < list.length; j++) {
                var currentItem = list[j];
                if (currentItem.partyID && currentItem.iD) {
                    for (var i = 0; i < listInitial.length; i++) {
                        var initialItem = listInitial[i];
                        if (initialItem.iD == currentItem.iD && (initialItem.type != currentItem.type || initialItem.text != currentItem.text)) {
                            if (artifact == 'phone') {
                                currentItem.TelephoneNumber = { telephoneNumber: currentItem.text };
                                currentItem.telephoneTypeID = currentItem.type;
                            } else if (artifact == 'email') {
                                currentItem.EmailAddress = { emailAddress: currentItem.text };
                                currentItem.emailTypeID = currentItem.type;
                            } else if (artifact == 'social') {
                                currentItem.SocialMediaAccount = {
                                    detail: currentItem.text,
                                    socialMediaTypeID: currentItem.type
                                };
                            } else if (artifact == 'address') {
                                currentItem.AddressTypeId = currentItem.type;
                                currentItem.Address = { addressText: currentItem.text };
                            }

                            updateList.push(currentItem);
                            break;
                        }
                    }
                } else {
                    var theSameTypeFound = false;
                    for (var i = 0; i < listInitial.length; i++) {
                        var initialItem = listInitial[i];
                        if (initialItem.type == currentItem.type && initialItem.text == currentItem.text) {
                            theSameTypeFound = true;
                            break;
                        }
                    }

                    if (!theSameTypeFound) {
                        createList.push(currentItem);
                    }
                }
            }

            return {
                updated: updateList,
                created: createList,
                deleted: deleteList
            };
        };

        this.processListChanges = function (artifact, list, listInitial) {
            var deleteList = [];
            var updateList = [];
            var updateArtifactsList = [];
            var createList = [];

            var tempList = [];
            var tempListTypes = [];
            for (var j = 0; j < list.length; j++) {
                if (tempListTypes.indexOf(list[j].type) == -1) {
                    tempList.push(list[j]);
                    tempListTypes.push(list[j].type);
                }
            }

            list = tempList;

            for (var i = 0; i < listInitial.length; i++) {
                var initialItem = listInitial[i];
                var itemFound = false;
                for (var j = 0; j < list.length; j++) {
                    var currentItem = list[j];
                    if (initialItem.type == currentItem.type || initialItem.iD && currentItem.iD && initialItem.iD == currentItem.iD) {
                        itemFound = true;
                        break;
                    }
                }

                if (!itemFound) {
                    deleteList.push(initialItem.iD);
                }
            }

            for (var j = 0; j < list.length; j++) {
                var currentItem = list[j];
                if (currentItem.partyID && currentItem.iD) {
                    updateArtifactsList.push(currentItem);
                    for (var i = 0; i < listInitial.length; i++) {
                        var initialItem = listInitial[i];
                        if (initialItem.iD == currentItem.iD && initialItem.type != currentItem.type) {
                            if (artifact == 'party-role') {
                                currentItem.PartyRoleTypeID = currentItem.type;
                            }

                            updateList.push(currentItem);
                            break;
                        }
                    }
                } else {
                    var theSameTypeFound = false;
                    for (var i = 0; i < listInitial.length; i++) {
                        var initialItem = listInitial[i];
                        if (initialItem.type == currentItem.type) {
                            theSameTypeFound = true;
                            break;
                        }
                    }

                    if (!theSameTypeFound) {
                        createList.push(currentItem);
                    }
                }
            }

            return {
                updated: updateList,
                created: createList,
                deleted: deleteList,
                updatedArtifacts: updateArtifactsList
            };
        };

        this.createPhoneTemplate = function (partyId, phone) {
            return {
                partyID: partyId,
                communicationTypeID: 10,
                locationTypeID: 2,
                telephoneTypeID: phone.type,
                preferredContact: false,
                TelephoneNumber: {
                    telephoneNumber: phone.text
                }
            };
        };

        this.createEmailTemplate = function (partyId, email) {
            return {
                partyID: partyId,
                communicationTypeID: 10,
                locationTypeID: 2,
                emailTypeID: email.type,
                EmailAddress: {
                    emailAddress: email.text
                }
            };
        };

        this.createSocialTemplate = function (partyId, social) {
            return {
                partyID: partyId,
                communicationTypeID: 10,
                optOut: false,
                SocialMediaAccount: {
                    detail: social.text,
                    socialMediaTypeID: social.type,
                    active: true
                }
            };
        };

        this.createAddressTemplate = function (partyId, address) {
            return {
                partyID: partyId,
                addressTypeID: address.type,
                AddressTypeID: address.type,
                addressID: address.addrId,
                communicationTypeID: 10,
                currencyTypeID: 1,
                Address: {
                    iD: address.addrId
                }
            };
        };

        this.createPartyRoleTemplate = function (partyId, role) {
            return {
                partyID: partyId,
                partyRoleTypeID: role.type,
                active: true
            };
        };

        this.savePartyArtifacts = function (partyID, artifact, list, listInitial, contacts) {
            var changes = {};
            if (artifact == 'party-role') {
                changes = this.processListChanges(artifact, list, listInitial);
            } else {
                changes = this.processListChangesExtended(artifact, list, listInitial);
            }

            if (changes.deleted && changes.deleted.length > 0) {
                changes.deleted.forEach(function (deleteId) {
                    $http({
                        url: CONFIG.api.crumbs + '/party/' + artifact + '/' + deleteId,
                        dataType: 'json', method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' }
                    }).then(function (data) {
                        // console.log(data);
                    }, function (error) {
                        //console.log(error);
                    });
                });
            }

            if (artifact == 'party-role' && changes.updatedArtifacts && changes.updatedArtifacts.length > 0) {
                for (var i = 0; i < changes.updatedArtifacts.length; i++) {
                    var item = changes.updatedArtifacts[i];
                    this.processRelationship(item.iD, item.sharesList, item.sharesListInitial, 14);
                    this.processRelationship(item.iD, item.ownerList, item.ownerListInitial, 13);
                    if (!contacts) {
                        this.processRelationship(item.iD, item.relationshipsList, item.relationshipsListInitial, 0);
                        this.processRelationship(item.iD, item.primaryContactList, item.primaryContactListInitial, 18);
                    }
                }
            }

            if (changes.updated && changes.updated.length > 0) {
                changes.updated.forEach(function (item) {
                    var itemToSave = item;
                    itemToSave.partyRoleTypeID = item.type;
                    if (artifact == 'address') {
                        itemToSave.AddressTypeID = item.type;
                        itemToSave.addressTypeID = item.type;
                        itemToSave.addressID = item.addrId;
                        itemToSave.AddressID = item.addrId;
                        itemToSave.Address = { iD: item.addrId };
                    }

                    $http({
                        url: CONFIG.api.crumbs + '/party/' + artifact + '/' + item.iD,
                        dataType: 'json', method: 'PUT', data: itemToSave,
                        headers: { 'Content-Type': 'application/json' }
                    }).then(function (data) {
                        // console.log(data);
                    }, function (error) {
                        //console.log(error);
                    });
                });
            }

            if (changes.created && changes.created.length > 0) {
                var service = this;
                changes.created.forEach(function (item) {
                    var itemToSave = {};
                    if (artifact == 'phone') {
                        itemToSave = service.createPhoneTemplate(partyID, item);
                    } else if (artifact == 'email') {
                        itemToSave = service.createEmailTemplate(partyID, item);
                    } else if (artifact == 'social') {
                        itemToSave = service.createSocialTemplate(partyID, item);
                    } else if (artifact == 'party-role') {
                        itemToSave = service.createPartyRoleTemplate(partyID, item);
                    } else if (artifact == 'address') {
                        itemToSave = service.createAddressTemplate(partyID, item);
                    }

                    $http({
                        url: CONFIG.api.crumbs + '/party/' + artifact,
                        dataType: 'json', method: 'POST', data: itemToSave,
                        headers: { 'Content-Type': 'application/json' }
                    }).then(function (data) {
                        if (artifact == 'party-role') {
                            var partyRoleId = data.data;
                            service.processRelationship(partyRoleId, item.sharesList, item.sharesListInitial, 14);
                            service.processRelationship(partyRoleId, item.ownerList, item.ownerListInitial, 13);
                            if (!contacts) {
                                service.processRelationship(partyRoleId, item.relationshipsList, item.relationshipsListInitial, 0);
                                service.processRelationship(partyRoleId, item.primaryContactList, item.primaryContactListInitial, 18);
                            }
                        }
                    }, function (error) {
                        //console.log(error);
                    });
                });
            }
        };

        this.processRelationshipChanges = function (list, listInitial, extended) {
            var relate = [];
            var unrelate = [];

            var tempList = [];
            var tempListTypes = [];
            if (list) {
                for (var j = 0; j < list.length; j++) {
                    var uniqueItem = list[j].party.PartyRoleID + '_' + (extended ? list[j].type.RelationshipTypeID : '1');
                    if (tempListTypes.indexOf(uniqueItem) == -1) {
                        tempList.push(list[j]);
                        tempListTypes.push(uniqueItem);
                    }
                }
            }

            list = tempList;

            if (listInitial) {
                for (var i = 0; i < listInitial.length; i++) {
                    var initialItem = listInitial[i];
                    var itemFound = false;
                    for (var j = 0; j < list.length; j++) {
                        var currentItem = list[j];
                        if (extended && initialItem.party.PartyRoleID == currentItem.party.PartyRoleID && initialItem.type.RelationshipTypeID == currentItem.type.RelationshipTypeID || !extended && initialItem.party.PartyRoleID == currentItem.party.PartyRoleID) {
                            itemFound = true;
                            break;
                        }
                    }

                    if (!itemFound) {
                        unrelate.push(initialItem);
                    }
                }
            } else {
                listInitial = [];
            }

            for (var j = 0; j < list.length; j++) {
                var currentItem = list[j];
                var itemFound = false;
                for (var i = 0; i < listInitial.length; i++) {
                    var initialItem = listInitial[i];
                    if (extended && initialItem.party.PartyRoleID == currentItem.party.PartyRoleID && initialItem.type.RelationshipTypeID == currentItem.type.RelationshipTypeID || !extended && initialItem.party.PartyRoleID == currentItem.party.PartyRoleID) {
                        itemFound = true;
                        break;
                    }
                }

                if (!itemFound) {
                    relate.push(currentItem);
                }
            }

            return {
                relate: relate,
                unrelate: unrelate
            };
        };

        this.processRelationship = function (parentPartyRoleId, list, listInitial, relationshipTypeId) {
            var changes = this.processRelationshipChanges(list, listInitial, relationshipTypeId == 0);
            if (changes.unrelate && changes.unrelate.length > 0) {
                changes.unrelate.forEach(function (item) {
                    var unrelateItem = {
                        parentPartyRoleId: parentPartyRoleId,
                        childPartyRoleId: item.party.PartyRoleID,
                        relationshipTypeId: relationshipTypeId > 0 ? relationshipTypeId : item.type.RelationshipTypeID
                    };
                    $http({
                        url: CONFIG.api.crumbs + '/partyrole/unrelate',
                        dataType: 'json', method: 'POST', data: unrelateItem,
                        headers: { 'Content-Type': 'application/json' }
                    }).then(function (data) {}, function (error) {});
                });
            }

            if (changes.relate && changes.relate.length > 0) {
                changes.relate.forEach(function (item) {
                    var relateItem = {
                        parentPartyRoleId: parentPartyRoleId,
                        childPartyRoleId: item.party.PartyRoleID,
                        relationshipTypeId: relationshipTypeId > 0 ? relationshipTypeId : item.type.RelationshipTypeID
                    };

                    if (relateItem.childPartyRoleId > 0 && relateItem.relationshipTypeId) {
                        $http({
                            url: CONFIG.api.crumbs + '/partyrole/relate',
                            dataType: 'json', method: 'POST', data: relateItem,
                            headers: { 'Content-Type': 'application/json' }
                        }).then(function (data) {}, function (error) {});
                    }
                });
            }
        };
    }]);
})();