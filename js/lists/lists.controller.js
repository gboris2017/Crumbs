'use strict';

(function () {
    ListsController.$inject = ["$rootScope", "ListsService", "$scope", "$ionicModal", "NgTableParams", "$http", "helperService"];
    angular.module('crumbs.lists').controller('ListsController', ['$rootScope', 'ListsService', '$scope', '$ionicModal', 'NgTableParams', '$http', 'helperService', ListsController]);

    /** @ngInject */
    function ListsController($rootScope, ListsService, $scope, $ionicModal, NgTableParams, $http, helperService) {
        var vm = this;

        $scope.saveModal = undefined;
        $ionicModal.fromTemplateUrl('lists/lists-save.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.saveModal = modal;
        });

        vm.openSaveModal = function () {
            vm.listName = '';
            $scope.saveModal.show();
        };

        vm.closeSaveModal = function () {
            vm.listName = '';
            $scope.saveModal.hide();
        };

        vm.listName = '';
        vm.init = init;
        vm.showFilter = showFilter;
        vm.saveList = saveList;
        vm.saveListCloseModel = saveListCloseModel;
        vm.makeFavoriteCloseModel = makeFavoriteCloseModel;
        vm.loadFiltersData = loadFiltersData;
        vm.runList = runList;
        vm.prepareListForSaveRun = prepareListForSaveRun;
        vm.showList = showList;
        vm.applyForDropdown = applyForDropdown;

        vm.list = [];
        vm.filters = {};
        vm.rolesList = [];
        vm.statesList = [];
        vm.ownersList = [];
        vm.statusesList = [];
        vm.filtersList = [{ id: 1, name: 'State' }, { id: 2, name: 'Role' }, { id: 3, name: 'Owner' }, { id: 4, name: 'Status' }, { id: 5, name: 'Contains Text' }, { id: 6, name: 'Name' }, { id: 7, name: 'Has login' }, { id: 8, name: 'Postcode' }, { id: 9, name: 'Last activity date' }, { id: 10, name: 'Last app date before' }];

        vm.displayedFiltersList = '1;2;3;4;5;6;7;8;9;10';
        vm.controlList = [{ id: 1, name: 'All contacts' }, { id: 2, name: 'My contacts' }, { id: 3, name: 'My owned contacts' }, { id: 4, name: 'All accounts' }, { id: 5, name: 'My accounts' }, { id: 6, name: 'My owned accounts' }];

        vm.multiselectSettings = {
            displayProp: 'name',
            showCheckAll: false,
            showUncheckAll: false
        };

        vm.translationTexts = {
            buttonDefaultText: 'Select states'
        };

        vm.tableParams = undefined;

        init();

        function init() {
            vm.filters = {
                partyType: undefined,
                states: [],
                roles: [],
                owners: [],
                statuses: [],
                containsText: undefined,
                name: undefined,
                hasLogin: false,
                postcode: undefined,
                lastActivity: undefined,
                lastAppDate: undefined
            };

            vm.listName = '';
            vm.loadFiltersData();
        }

        function showFilter(id) {
            var result = false;
            if (vm.displayedFiltersList != undefined && vm.displayedFiltersList.length > 0) {
                var list = vm.displayedFiltersList.split(';');
                list.forEach(function (f) {
                    if (f == id) {
                        result = true;
                    }
                });
            }

            return result;
        }

        function loadFiltersData() {
            vm.controlList = [];
            ListsService.getLookForTypes().then(function (result) {
                vm.controlList = result;
            }, function (error) {
                vm.controlList = [];
            });

            vm.rolesList = [];
            ListsService.getFilters('prt').then(function (result) {
                vm.rolesList = result;
                vm.rolesList.forEach(function (item) {
                    item.id = item.iD;
                });
            }, function (error) {
                vm.rolesList = [];
            });

            vm.statesList = [];
            ListsService.getFiltersStates().then(function (result) {
                vm.statesList = result;
                applyForDropdown(vm.statesList);
            }, function (error) {
                vm.statesList = [];
            });

            vm.ownersList = [];
            ListsService.getOwners().then(function (result) {
                vm.ownersList = result;
                vm.ownersList.forEach(function (item) {
                    item.id = item.PartyRoleID;
                    item.name = item.PartyName;
                });
            }, function (error) {
                vm.ownersList = [];
            });

            vm.statusesList = [];
            ListsService.getFilters('ast').then(function (result) {
                vm.statusesList = result;
                vm.statusesList.forEach(function (item) {
                    item.id = item.iD;
                });
            }, function (error) {
                vm.statusesList = [];
            });
        }

        function applyForDropdown(list) {
            list.forEach(function (item) {
                item.id = item.ID ? item.ID : item.Id;
                item.name = item.Name;
            });
        }

        function saveListCloseModel() {
            vm.saveList(false);
            $scope.saveModal.hide();
        }

        function makeFavoriteCloseModel() {
            vm.saveList(true);
            $scope.saveModal.hide();
        }

        function saveList(favorite) {
            var list = vm.prepareListForSaveRun(favorite);
            helperService.postJsonData(CONFIG.api.crumbs + '/lists', list).then(function (result) {
                vm.init();
                alert('List successfully saved');
                $rootScope.loadListsContacts();
                $rootScope.loadListsAccounts();
            }, function (error) {
                alert('Error');
            });
        }

        function runList() {
            vm.list = [];
            vm.tableParams = new NgTableParams({}, { dataset: vm.list });

            var list = vm.prepareListForSaveRun(false);

            helperService.postJsonData(CONFIG.api.crumbs + '/lists/runList', list).then(function (data) {
                console.log(data.data);
                vm.list = data.data;
                vm.tableParams = new NgTableParams({}, { dataset: vm.list });
            }, function (error) {
                vm.list = [];
                vm.tableParams = new NgTableParams({}, { dataset: vm.list });
            });
        }

        function showList(id) {
            ListsService.getList(id).then(function (result) {
                console.log(result);
                vm.listName = result.name;
                var statesF = getDropDownValues(result.stateFilter);
                var rolesF = getDropDownValues(result.partyRoleTypeFilter);
                var ownersF = getDropDownValues(result.ownerFilter);
                var statusesF = getDropDownValues(result.statusFilter);
                vm.filters = {
                    iD: result.iD,
                    partyType: result.partyTypeFilter,
                    states: statesF,
                    roles: rolesF,
                    owners: ownersF,
                    statuses: statusesF,
                    containsText: undefined,
                    name: result.nameFilter,
                    hasLogin: result.hasLoginFilter,
                    postcode: result.postcodeFilter,
                    lastActivity: result.lastActivityDateFilter == null ? undefined : result.lastActivityDateFilter,
                    lastAppDate: result.lastAppDateBefore == null ? undefined : result.lastAppDateBefore
                };

                console.log(vm.filters);
            }, function (error) {
                console.log(error);
            });
        }

        function getDropDownValues(list) {
            var val = '';
            if (list != null && list != undefined) {
                for (var i = 0; i < list.length; i++) {
                    if (i == 0) {
                        val += list[i];
                    } else {
                        val += ';' + list[i];
                    }
                }
            }

            return val;
        }

        function prepareListForSaveRun(favorite) {
            var stateFilter = [];
            if (vm.filters.states && vm.filters.states.length > 0) {
                var temp = vm.filters.states.split(';');
                if (temp && temp.length > 0) {
                    for (var i = 0; i < temp.length; i++) {
                        stateFilter.push(1 * temp[i]);
                    }
                }
            }

            var partyRoleTypeFilter = [];
            if (vm.filters.roles && vm.filters.roles.length > 0) {
                var temp = vm.filters.roles.split(';');
                if (temp && temp.length > 0) {
                    for (var i = 0; i < temp.length; i++) {
                        partyRoleTypeFilter.push(1 * temp[i]);
                    }
                }
            }

            var ownerFilter = [];
            if (vm.filters.owners && vm.filters.owners.length > 0) {
                var temp = vm.filters.owners.split(';');
                if (temp && temp.length > 0) {
                    for (var i = 0; i < temp.length; i++) {
                        ownerFilter.push(1 * temp[i]);
                    }
                }
            }

            var statusFilter = [];
            if (vm.filters.statuses && vm.filters.statuses.length > 0) {
                var temp = vm.filters.statuses.split(';');
                if (temp && temp.length > 0) {
                    for (var i = 0; i < temp.length; i++) {
                        statusFilter.push(1 * temp[i]);
                    }
                }
            }

            var list = {};
            if (vm.filters.iD) {
                list.iD = vm.filters.iD;
            }

            list.name = vm.listName;
            list.favourite = favorite;
            list.active = true;
            list.partyTypeFilter = vm.filters.partyType ? vm.filters.partyType : 1;
            if (stateFilter.length > 0) {
                list.stateFilter = stateFilter;
            }

            if (partyRoleTypeFilter.length > 0) {
                list.partyRoleTypeFilter = partyRoleTypeFilter;
            }

            if (ownerFilter.length > 0) {
                list.ownerFilter = ownerFilter;
            }

            if (statusFilter.length > 0) {
                list.statusFilter = statusFilter;
            }

            if (vm.filters.name && vm.filters.name.length > 0) {
                list.nameFilter = vm.filters.name;
            }

            if (vm.filters.containsText && vm.filters.containsText.length > 0) {
                list.containsTextFilter = vm.filters.containsText;
            }

            if (vm.filters.postcode && vm.filters.postcode.length > 0) {
                list.postcodeFilter = vm.filters.postcode;
            }

            list.hasLoginFilter = vm.filters.hasLogin;
            if (vm.filters.lastActivity) {
                list.lastActivityDateFilter = vm.filters.lastActivity;
            }

            if (vm.filters.lastAppDate) {
                list.lastAppDateBefore = vm.filters.lastAppDate;
            }

            return list;
        }
    }
})();