'use strict';

(function () {
    UsersController.$inject = ["helperService", "$ionicListDelegate", "$scope", "$ionicModal", "UsersService", "$http", "$rootScope", "$ionicSideMenuDelegate", "CrumbsCommonService"];
    angular.module('crumbs.users').controller('UsersController', ['helperService', '$ionicListDelegate', '$scope', '$ionicModal', 'UsersService', '$http', '$rootScope', '$ionicSideMenuDelegate', 'CrumbsCommonService', UsersController]);

    /** @ngInject */
    function UsersController(helperService, $ionicListDelegate, $scope, $ionicModal, UsersService, $http, $rootScope, $ionicSideMenuDelegate, CrumbsCommonService) {
        var vm = this;

        vm.editPermissions = false;
        vm.editMode = false;
        vm.editRolesMode = false;
        vm.addNewMode = false;
        vm.editUser = {};
        vm.users = [];
        vm.permissions = [{ code: 'prt', name: 'PartyRoleType', state: 1 }, { code: 'prs', name: 'PartyRoleSuite', state: 1 }, { code: 'prg', name: 'PartyRoleGroup', state: 1 }, { code: 'prc', name: 'PartyRoleCategory', state: 1 }, { code: 'sit', name: 'SiteType', state: 1 }, { code: 'apt', name: 'ApplicationType', state: 1 }, { code: 'rt', name: 'RoleType', state: 1 }, { code: 'perm', name: 'PermissionType', state: 1 }, { code: 'pt', name: 'PartyType', state: 1 }];

        vm.loadUsers = loadUsers;
        vm.disableUser = disableUser;
        vm.saveUserData = saveUserData;
        vm.initAddNewMode = initAddNewMode;
        vm.saveNewUser = saveNewUser;
        vm.initEditMode = initEditMode;
        vm.cancelAction = cancelAction;

        vm.loadPermissionTypes = loadPermissionTypes;
        vm.addNewPermissionType = addNewPermissionType;
        vm.savePermissionTypes = savePermissionTypes;
        vm.closePermissionTypes = closePermissionTypes;

        vm.closeOptionButtons = function () {
            $ionicListDelegate.closeOptionButtons();
        };

        vm.states = {};
        vm.swipeLeft = swipeLeft;
        vm.swipeRight = swipeRight;

        loadUsers();

        function swipeLeft(tt, id) {
            var rowName = 'row_user_' + id;
            var content = $('#' + rowName).find('.item-content');
            var buttons = $('#' + rowName).find('.item-options');

            angular.forEach(buttons, function (btn) {
                if (!btn.classList.contains('invisible')) {
                    if (!vm.newMode) {
                        btn.classList.add('invisible');
                        content.css('transform', '');
                        vm.states[id].opened = false;
                    }
                } else {
                    btn.classList.remove('invisible');
                    content.css('transform', 'translate3d(-140px, 0, 0)');
                    if (!vm.states[id]) {
                        vm.states[id] = {};
                        vm.states[id].opened = true;
                    }
                }
            });
        }

        function swipeRight(tt, id) {
            var rowName = 'row_user_' + id;
            var content = $('#' + rowName).find('.item-content');
            var buttons = $('#' + rowName).find('.item-options');

            var currentState = vm.states[id];
            if (currentState && currentState.opened == true) {
                angular.forEach(buttons, function (btn) {
                    if (!vm.newMode) {
                        btn.classList.add('invisible');
                        content.css('transform', '');
                        if (!vm.states[id]) {
                            vm.states[id] = { opened: false };
                        }

                        vm.states[id].opened = false;
                    }
                });
            } else {
                UsersService.getUser(id).then(function (result) {
                    $rootScope.initUserRoles(result);
                    if (!$ionicSideMenuDelegate.isOpenLeft()) {
                        $ionicSideMenuDelegate.toggleLeft();
                    }
                }, function (error) {
                    $ionicSideMenuDelegate.toggleLeft(false);
                });
            }
        }

        function loadUsers() {
            $rootScope.rolesMode = 1;
            UsersService.getUsers().then(function (result) {
                vm.users = result;
                vm.users.forEach(function (user) {
                    user.options = false;
                });
            }, function (error) {
                vm.users = [];
            });
        }

        // edit/create
        function initEditMode(acc) {
            vm.users.forEach(function (u) {
                u.editMode = false;
            });

            acc.editMode = true;
            vm.editMode = true;
            UsersService.getUser(acc.iD).then(function (result) {
                vm.editUser = result;
                vm.editUser.surname = '';
                vm.editUser.givenname = '';
                vm.editUser.emailaddress = '';
                for (var i = 0; i < result.claims.length; i++) {
                    if (result.claims[i].Name == 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname') {
                        vm.editUser.surname = result.claims[i].Value;
                    }

                    if (result.claims[i].Name == 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname') {
                        vm.editUser.givenname = result.claims[i].Value;
                    }

                    if (result.claims[i].Name == 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress') {
                        vm.editUser.emailaddress = result.claims[i].Value;
                    }
                }
            }, function (error) {
                vm.cancelAction(acc);
            });
        }

        function cancelAction(user) {
            vm.closeOptionButtons();
            vm.swipeLeft(user, user.iD);
            vm.editMode = false;
            user.editMode = false;
        }

        function disableUser(user) {
            $http({
                url: CONFIG.api.crumbs + '/user/' + user.iD + '/demote',
                dataType: 'json', method: 'POST', data: { action: 2 },
                headers: { 'Content-Type': 'application/json' }
            }).then(function (data) {
                vm.closeOptionButtons();
                vm.loadUsers();
            }, function (error) {
                vm.closeOptionButtons();
            });
        }

        function saveUserData() {
            var toSave = vm.editUser;
            toSave.claims = [];
            var givennameClaim = {
                claimTypeID: 18,
                value: vm.editUser.givenname
            };
            var surnameClaim = {
                claimTypeID: 19,
                value: vm.editUser.surname
            };
            var emailaddressClaim = {
                claimTypeID: 36,
                value: vm.editUser.emailaddress
            };
            toSave.claims.push(givennameClaim);
            toSave.claims.push(surnameClaim);
            toSave.claims.push(emailaddressClaim);
            $http({
                url: CONFIG.api.crumbs + '/user/' + vm.editUser.LoginID,
                dataType: 'json', method: 'PUT', data: toSave,
                headers: { 'Content-Type': 'application/json' }
            }).then(function (data) {
                vm.closeOptionButtons();
                vm.loadUsers();
            }, function (error) {
                vm.closeOptionButtons();
            });
        }

        function initAddNewMode() {
            vm.addNewMode = true;
            vm.editUser = {
                claims: [],
                siteTypeID: 4,
                password: '',
                surname: '',
                givenname: '',
                emailaddress: '',
                username: ''
            };
        }

        function saveNewUser() {
            vm.addNewMode = false;
            var toSave = vm.editUser;
            toSave.claims = [];
            var givennameClaim = {
                claimTypeID: 18,
                value: vm.editUser.givenname
            };
            var surnameClaim = {
                claimTypeID: 19,
                value: vm.editUser.surname
            };
            var emailaddressClaim = {
                claimTypeID: 36,
                value: vm.editUser.emailaddress
            };

            toSave.claims.push(givennameClaim);
            toSave.claims.push(surnameClaim);
            toSave.claims.push(emailaddressClaim);
            toSave.username = vm.editUser.givenname + ' ' + vm.editUser.surname;
            $http({
                url: CONFIG.api.crumbs + '/user',
                dataType: 'json', method: 'POST', data: toSave,
                headers: { 'Content-Type': 'application/json' }
            }).then(function (data) {
                vm.closeOptionButtons();
                vm.loadUsers();
            }, function (error) {
                vm.closeOptionButtons();
            });
        }

        function loadPermissionTypes(perm) {
            CrumbsCommonService.getTypes(perm.code).then(function (result) {
                perm.values = result;
                perm.newValues = [];
                perm.state = 2;
            }, function (error) {
                perm.values = [];
                perm.newValues = [];
                perm.state = 1;
            });
        }

        function addNewPermissionType(perm) {
            if (perm.newType && perm.newType.name.length > 0) {
                perm.newValues.push({
                    name: perm.newType.name,
                    active: perm.newType.active,
                    sortOrder: 100
                });
            }

            perm.newType = { name: '', active: true };
        }

        function savePermissionTypes(perm) {
            if (perm.newType && perm.newType.name.length > 0) {
                perm.newValues.push({
                    name: perm.newType.name,
                    active: perm.newType.active,
                    sortOrder: 100
                });
            }

            for (var i = 0; i < perm.newValues.length; i++) {
                $http({
                    url: CONFIG.api.crumbs + '/types/' + perm.code,
                    dataType: 'json', method: 'POST', data: perm.newValues[i],
                    headers: { 'Content-Type': 'application/json' }
                }).then(function (data) {}, function (error) {});
            }

            if ($rootScope && $rootScope.closePermissionTypes) {
                $rootScope.closePermissionTypes(perm);
            }
        }

        function closePermissionTypes(perm) {
            perm.state = 1;
            vm.closeOptionButtons();
        }
    }
})();