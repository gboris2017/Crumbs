'use strict';

(function () {
    angular.module('crumbs.settings').controller('SettingsController', ['FileUploader', 'helperService', '$scope', '$ionicModal', '$http', 'Upload', SettingsController]);

    function SettingsController(FileUploader, helperService, $scope, $ionicModal, $http, Upload) {
        var vm = this;

        vm.showUpload = false;
        vm.showImport = false;
        vm.showValidation = false;

        vm.data = {};
        vm.importTypes = [{ id: 1, name: 'Persons' }, { id: 2, name: 'Companies' }];
        vm.ownersList = [];
        vm.importsList = [];

        $scope.validationModal = undefined;
        $ionicModal.fromTemplateUrl('validation-modal.html', { scope: $scope, animation: 'slide-in-up' }).then(function (modal) {
            $scope.validationModal = modal;
        });

        vm.openValidationModal = function () {
            $scope.validationModal.show();
        };

        vm.closeValidationModal = function () {
            $scope.validationModal.hide();
        };

        $scope.errorsModal = undefined;
        $ionicModal.fromTemplateUrl('errors-modal.html', { scope: $scope, animation: 'slide-in-up' }).then(function (modal) {
            $scope.errorsModal = modal;
        });

        vm.openErrorsModal = function () {
            $scope.errorsModal.show();
        };

        vm.closeErrorsModal = function () {
            $scope.errorsModal.hide();
        };

        vm.fileToUpload = undefined;
        vm.validationResult = {};

        vm.init = init;
        vm.setDefaultState = setDefaultState;
        vm.showUploadBlock = showUploadBlock;
        vm.showImportBlock = showImportBlock;
        vm.formatDate = formatDate;
        vm.onFileSelect = onFileSelect;
        vm.uploadFile = uploadFile;
        vm.getErrorsList = getErrorsList;

        function init() {
            vm.setDefaultState();
            vm.data = {
                importType: undefined,
                owner: undefined
            };
        }

        function onFileSelect($files) {
            vm.fileToUpload = $files[0];
        }

        function uploadFile() {
            var fd = new FormData();
            fd.append('import', vm.fileToUpload);
            $http({ method: 'POST', url: CONFIG.api.crumbs + '/settings/upload/persons',
                data: fd, headers: { 'Content-Type': undefined }
            }).then(function (data) {
                var object = data.data;
                vm.validationResult.object = object;
                $http({
                    url: CONFIG.api.crumbs + '/settings/validate/' + object.id,
                    dataType: 'json', method: 'POST', data: {},
                    headers: { 'Content-Type': 'application/json' }
                }).then(function (data1) {
                    vm.validationResult.errors = data1.data;
                    vm.openValidationModal();
                }, function (error) {
                    alert('Error occurred');
                });
            }, function (error) {
                alert('Error occurred');
            });
        }

        function getErrorsList() {
            vm.closeValidationModal();
            $http({
                url: CONFIG.api.crumbs + '/settings/' + vm.validationResult.object.id + '/errors',
                dataType: 'json', method: 'GET', data: {},
                headers: { 'Content-Type': 'application/json' }
            }).then(function (data) {
                vm.validationResult.list = data.data;
                vm.openErrorsModal();
            }, function (error) {
                alert('Error occurred');
            });
        }

        function setDefaultState() {
            vm.showUpload = false;
            vm.showImport = false;
            vm.showValidation = false;
        }

        function showUploadBlock() {
            vm.showUpload = true;
        }

        function showImportBlock() {
            vm.setDefaultState();
            vm.showImport = true;
        }

        function formatDate(ts) {
            return helperService.formatDate(ts);
        }
    }
})();