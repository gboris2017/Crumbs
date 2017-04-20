'use strict';

(function () {
    CampaignsController.$inject = ["$rootScope", "NgTableParams", "$scope", "$ionicModal", "CampaignsService", "$http", "TemplatesService", "ListsService", "helperService"];
    angular.module('crumbs.campaigns').controller('CampaignsController', ['$rootScope', 'NgTableParams', '$scope', '$ionicModal', 'CampaignsService', '$http', 'TemplatesService', 'ListsService', 'helperService', CampaignsController]);

    /** @ngInject */
    function CampaignsController($rootScope, NgTableParams, $scope, $ionicModal, CampaignsService, $http, TemplatesService, ListsService, helperService) {
        var vm = this;

        vm.previewTemplateObj = {};
        $scope.previewModal = undefined;
        $ionicModal.fromTemplateUrl('campaigns/campaign-preview.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.previewModal = modal;
        });

        vm.openSaveModal = function (template) {
            vm.previewTemplateObj = template;
            $scope.previewModal.show();
        };

        vm.closeSaveModal = function () {
            $scope.previewModal.hide();
        };

        vm.editCampaign = {};
        vm.listResult = [];
        vm.lists = [];
        vm.deliveryMethods = [];
        vm.templates = [];
        vm.emailTemplates = [];
        vm.smsTemplates = [];
        vm.jobTemplates = [];
        vm.tableParams = undefined;

        vm.init = init;
        vm.saveCampaign = saveCampaign;
        vm.prepareCampaignForSave = prepareCampaignForSave;
        vm.runCampaignList = runCampaignList;
        vm.previewCampaign = previewCampaign;
        vm.showCampaign = showCampaign;

        init();

        function init() {
            CampaignsService.getLists().then(function (result) {
                vm.lists = result;
                vm.lists.forEach(function (item) {
                    item.id = item.iD;
                });
            }, function (error) {
                vm.lists = [];
            });

            vm.templates = [];
            TemplatesService.getEmailTemplates().then(function (result) {
                result.forEach(function (temp) {
                    temp.id = temp._id;
                    temp.name = '[Email] ' + temp.name;
                    vm.templates.push(temp);
                });

                vm.emailTemplates = result;
            }, function (error) {
                vm.emailTemplates = [];
            });

            TemplatesService.getSmsTemplates().then(function (result) {
                result.forEach(function (temp) {
                    temp.id = temp._id;
                    temp.name = '[SMS] ' + temp.name;
                    vm.templates.push(temp);
                });

                vm.smsTemplates = result;
            }, function (error) {
                vm.smsTemplates = [];
            });

            vm.deliveryMethods = [];
            CampaignsService.getTypes('cdt').then(function (result) {
                result.forEach(function (temp) {
                    temp.id = temp.iD;
                });

                vm.deliveryMethods = result;
            }, function (error) {
                vm.deliveryMethods = [];
            });

            // TODO add JOBS
            vm.editCampaign = {
                deliveryMethod: 0,
                template: 0,
                list: 0,
                startDate: undefined,
                name: ''
            };
        }

        function previewCampaign() {
            var emailType = 0;
            if (vm.editCampaign.template && vm.editCampaign.template.length > 0) {
                vm.emailTemplates.forEach(function (t) {
                    if (t._id == vm.editCampaign.template) {
                        emailType = 1;
                    }
                });

                if (emailType == 0) {
                    vm.smsTemplates.forEach(function (t) {
                        if (t._id == vm.editCampaign.template) {
                            emailType = 2;
                        }
                    });
                }

                if (emailType == 1) {
                    CampaignsService.getTemplate('email', vm.editCampaign.template).then(function (data) {
                        vm.openSaveModal(data);
                    }, function (error) {
                        console.log(error);
                    });
                } else if (emailType == 2) {
                    CampaignsService.getTemplate('sms', vm.editCampaign.template).then(function (data) {
                        vm.openSaveModal(data);
                    }, function (error) {
                        console.log(error);
                    });
                }
            } else {
                alert('Please select template');
            }
        }

        function runCampaignList() {
            if (vm.editCampaign.list != undefined && vm.editCampaign.list > 0) {
                ListsService.getList(vm.editCampaign.list).then(function (listres) {
                    helperService.postJsonData(CONFIG.api.crumbs + '/lists/runList', listres).then(function (data) {
                        vm.listResult = data.data;
                        vm.tableParams = new NgTableParams({}, { dataset: vm.listResult });
                    }, function (error) {
                        alert(error.data.message);
                    });
                }, function (error) {
                    console.log(error);
                });
            } else {
                alert('Please select list');
            }
        }

        function saveCampaign() {
            var camp = vm.prepareCampaignForSave();
            helperService.postJsonData(CONFIG.api.crumbs + '/campaigns', camp).then(function (data) {
                vm.init();
                alert('Campaign successfully saved');
                $rootScope.loadContacts();
                $rootScope.loadAccounts();
            }, function (error) {
                alert('Error');
            });
        }

        function prepareCampaignForSave() {
            var camp = {};
            if (vm.editCampaign.iD) {
                camp.iD = vm.editCampaign.iD;
            }

            camp.name = vm.editCampaign.name;
            camp.active = true;
            if (vm.editCampaign.list != undefined && vm.editCampaign.list > 0) {
                camp.listID = vm.editCampaign.list;
            }

            if (vm.editCampaign.startDate != undefined) {
                camp.runDate = vm.editCampaign.startDate;
            }

            if (vm.editCampaign.deliveryMethod != undefined && vm.editCampaign.deliveryMethod > 0) {
                camp.deliveryTypeID = vm.editCampaign.deliveryMethod;
            }

            if (vm.editCampaign.template && vm.editCampaign.template.length > 0) {
                var found = false;
                vm.emailTemplates.forEach(function (t) {
                    if (!found && t._id == vm.editCampaign.template) {
                        camp.emailTemplateID = vm.editCampaign.template;
                        found = true;
                    }
                });

                if (!found) {
                    vm.smsTemplates.forEach(function (t) {
                        if (!found && t._id == vm.editCampaign.template) {
                            camp.smsTemplateID = vm.editCampaign.template;
                            found = true;
                        }
                    });
                }
            }

            return camp;
        }

        function showCampaign(id) {
            vm.editCampaign = {
                deliveryMethod: 0,
                template: 0,
                list: 0,
                startDate: undefined,
                name: ''
            };

            CampaignsService.getCampaign(id).then(function (result) {
                vm.editCampaign = {
                    iD: result.iD,
                    deliveryMethod: result.deliveryTypeID,
                    list: result.listID,
                    startDate: result.runDate,
                    name: result.name
                };

                if (result.emailTemplateID && result.emailTemplateID != null) {
                    vm.editCampaign.template = result.emailTemplateID;
                } else if (result.smsTemplateID && result.smsTemplateID != null) {
                    vm.editCampaign.template = result.smsTemplateID;
                } else if (result.jobTypeID && result.jobTypeID != null) {
                    vm.editCampaign.template = result.jobTypeID;
                } else {
                    vm.editCampaign.template = undefined;
                }
            }, function (error) {
                console.log(error);
            });
        }
    }
})();