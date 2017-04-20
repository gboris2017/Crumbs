'use strict';

(function () {
    TemplatesController.$inject = ["$rootScope", "FileUploader", "$ionicListDelegate", "$ionicSideMenuDelegate", "$http", "$ionicModal", "$scope", "TemplatesService", "helperService"];
    angular.module('crumbs.templates').controller('TemplatesController', ['$rootScope', 'FileUploader', '$ionicListDelegate', '$ionicSideMenuDelegate', '$http', '$ionicModal', '$scope', 'TemplatesService', 'helperService', TemplatesController]);

    /** @ngInject */
    function TemplatesController($rootScope, FileUploader, $ionicListDelegate, $ionicSideMenuDelegate, $http, $ionicModal, $scope, TemplatesService, helperService) {
        var vm = this;

        vm.templateTypes = [];
        vm.newMode = false;
        vm.template = {};
        vm.editorOptions = {
            language: 'en',
            allowedContent: true,
            entities: false
        };
        vm.states = {};
        vm.currentTemplateType = 0;
        vm.attachmentsList = [{ id: 1, type: 1, name: 'Static attachment file' }, { id: 2, type: 2, name: 'From location/Latex via API' }, { id: 3, type: 3, name: 'From flyers' }];
        vm.emailsTypesList = [{ id: 1, type: 1, name: 'To Static Address' }, { id: 2, type: 2, name: 'To Crumbs Address' }, { id: 3, type: 3, name: 'To Other Address' }];
        vm.flyersList = [{ id: 1, name: 'Flyer 1' }, { id: 2, name: 'Flyer 2' }, { id: 3, name: 'Flyer 3' }];
        vm.relationships = [];
        vm.emailTypes = [];
        vm.phoneTypes = [];
        vm.locationTypes = [];
        vm.communicationTypes = [];
        vm.phonesTypesList = [{ id: 1, type: 1, name: 'To Static Number' }, { id: 2, type: 2, name: 'To Crumbs Number' }, { id: 3, type: 3, name: 'To Other Number' }];
        vm.flyerEditTemplate = {};

        $scope.sendTemplateModal;
        $ionicModal.fromTemplateUrl('templates/send-template.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.sendTemplateModal = modal;
        });

        vm.sendTemplateModel = {};

        vm.init = init;
        vm.showOptions = showOptions;
        vm.setToDefaultMode = setToDefaultMode;
        vm.newTemplate = newTemplate;
        vm.addElement = addElement;
        vm.removeElement = removeElement;
        vm.addAttachment = addAttachment;
        vm.addEmail = addEmail;
        vm.closeOptionButtons = function () {
            $ionicListDelegate.closeOptionButtons();
        };

        vm.uploadFile = uploadFile;
        vm.closeOptions = closeOptions;
        vm.swipeLeft = swipeLeft;
        vm.swipeRight = swipeRight;
        vm.saveTemplate = saveTemplate;
        vm.saveEmailTemplate = saveEmailTemplate;
        vm.loadRelationships = loadRelationships;
        vm.loadTypes = loadTypes;
        vm.addPhone = addPhone;
        vm.initSmsEditTemplate = initSmsEditTemplate;
        vm.saveSmsTemplate = saveSmsTemplate;
        vm.initFlyerEditTemplate = initFlyerEditTemplate;
        vm.uploadFlyerFile = uploadFlyerFile;
        vm.saveFlyerTemplate = saveFlyerTemplate;
        vm.initEditTemplate = initEditTemplate;
        vm.showSendEmailDialog = showSendEmailDialog;
        vm.testTemplate = testTemplate;
        vm.initEditEmailTemplateMode = initEditEmailTemplateMode;
        vm.initEditSmsTemplateMode = initEditSmsTemplateMode;
        vm.initEditFlyerTemplateMode = initEditFlyerTemplateMode;
        vm.convertFlyerToMongo = convertFlyerToMongo;
        vm.convertFlyerFromMongo = convertFlyerFromMongo;

        init();

        function init() {
            vm.screenMode = 1;
            vm.templateTypes = [{ id: 1, name: 'Email Templates', type: 1, templates: [] }, { id: 2, name: 'SMS Templates', type: 2, templates: [] }, { id: 3, name: 'Flyer Templates', type: 3, templates: [] }];
            vm.setToDefaultMode();
            vm.loadRelationships();
            vm.loadTypes();
        }

        function showOptions(t) {
            vm.setToDefaultMode();
            vm.screenMode = 1;
            t.options = true;
        }

        function setToDefaultMode() {
            vm.templateTypes.forEach(function (tt) {
                tt.options = false;
                tt.newMode = false;
            });
            vm.currentTemplateType = 0;
            vm.newMode = false;
        }

        function closeOptions(tt) {
            vm.setToDefaultMode();
            vm.closeOptionButtons();
            vm.swipeRight(tt, tt.id);
        }

        function newTemplate(tt) {
            vm.setToDefaultMode();
            tt.newMode = true;
            vm.newMode = true;
            vm.currentTemplateType = tt.type;
            if (tt.type == 1) {
                initEditTemplate(tt);
            } else if (tt.type == 2) {
                initSmsEditTemplate(tt);
            } else if (tt.type == 3) {
                initFlyerEditTemplate(tt);
            }
        }

        function swipeLeft(tt, id) {
            var rowName = 'row_template_' + id;
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
            var rowName = 'row_template_' + id;
            var content = $('#' + rowName).find('.item-content');
            var buttons = $('#' + rowName).find('.item-options');

            angular.forEach(buttons, function (btn) {
                if (!vm.newMode) {
                    btn.classList.add('invisible');
                    content.css('transform', '');
                    vm.states[id].opened = false;
                }
            });
        }

        function initEditTemplate(tt) {
            vm.editTemplate = {
                type: tt.type,
                name: '',
                tags: [],
                owner: undefined,
                shares: [],
                canUseEdit: false,
                htmlContent: false,
                subject: '',
                attachments: [],
                emails: []
            };
        }

        function initSmsEditTemplate(tt) {
            vm.smsEditTemplate = {
                type: tt.type,
                name: '',
                tags: [],
                owner: undefined,
                shares: [],
                canUseEdit: false,
                subject: '',
                phones: []
            };
        }

        function initFlyerEditTemplate(tt) {
            vm.flyerEditTemplate = {
                type: tt.type,
                name: '',
                tags: [],
                owner: undefined,
                shares: [],
                canUseEdit: false,
                file: undefined
            };
        }

        function loadRelationships() {
            TemplatesService.getRelationships().then(function (result) {
                vm.relationships = result;
                vm.relationships.forEach(function (item) {
                    item.id = item.PartyRoleID;
                    item.name = item.PartyName;
                });
            }, function (error) {
                vm.relationships = [];
            });
        }

        function loadTypes() {
            TemplatesService.getList('et').then(function (result) {
                vm.emailTypes = result;
                applyForDropdown(vm.emailTypes);
            }, function (error) {
                vm.emailTypes = [];
            });

            TemplatesService.getList('lt').then(function (result) {
                vm.locationTypes = result;
                applyForDropdown(vm.locationTypes);
            }, function (error) {
                vm.locationTypes = [];
            });

            TemplatesService.getList('ct').then(function (result) {
                vm.communicationTypes = result;
                applyForDropdown(vm.communicationTypes);
            }, function (error) {
                vm.communicationTypes = [];
            });

            TemplatesService.getList('pt').then(function (result) {
                vm.phoneTypes = result;
                console.log(result);
                applyForDropdown(vm.phoneTypes);
            }, function (error) {
                vm.phoneTypes = [];
            });
        }

        function applyForDropdown(list) {
            list.forEach(function (item) {
                item.id = item.iD;
            });
        }

        function addElement(list) {
            list.push({ index: 0, text: '' });
            var index = 0;
            list.forEach(function (item) {
                item.index = index++;
            });
        }

        function removeElement(list, index) {
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

        function addAttachment() {
            vm.editTemplate.attachments.push({
                index: 0,
                type: undefined,
                displayName: '',
                file: undefined,
                url: '',
                tag: undefined,
                flyer: undefined
            });
            var index = 0;
            vm.editTemplate.attachments.forEach(function (item) {
                item.index = index;
                index++;
            });
        }

        function uploadFile(selectedfiles, tag) {
            var f = selectedfiles[0];
            if (f) {
                var r = new FileReader();
                r.onloadend = function (e) {
                    tag.file = e.target.result;
                };

                r.readAsDataURL(f);
            }
        }

        function uploadFlyerFile(selectedfiles) {
            var f = selectedfiles[0];
            if (f) {
                var r = new FileReader();
                r.onloadend = function (e) {
                    vm.flyerEditTemplate.file = e.target.result;
                };

                r.readAsDataURL(f);
            }
        }

        function addEmail() {
            vm.editTemplate.emails.push({ index: 0, type: undefined });
            var index = 0;
            vm.editTemplate.emails.forEach(function (item) {
                item.index = index++;
            });
        }

        function addPhone() {
            vm.smsEditTemplate.phones.push({ index: 0, type: undefined });
            var index = 0;
            vm.smsEditTemplate.phones.forEach(function (item) {
                item.index = index++;
            });
        }

        function saveTemplate() {
            if (vm.currentTemplateType == 1) {
                vm.saveEmailTemplate();
            } else if (vm.currentTemplateType == 2) {
                vm.saveSmsTemplate();
            } else if (vm.currentTemplateType == 3) {
                vm.saveFlyerTemplate();
            }
        }

        function saveEmailTemplate() {
            var template = convertEmailToMongo(vm.editTemplate);
            helperService.postJsonData(CONFIG.api.crumbs + '/template/email', template).then(function (result) {
                vm.setToDefaultMode();
                vm.newMode = false;
                $rootScope.loadEmailTemplates();
            }, function (error) {
                vm.setToDefaultMode();
                vm.newMode = false;
                $rootScope.loadEmailTemplates();
            });
        }

        function saveSmsTemplate() {
            var template = convertSmsToMongo(vm.smsEditTemplate);
            helperService.postJsonData(CONFIG.api.crumbs + '/template/sms', template).then(function (result) {
                vm.setToDefaultMode();
                vm.newMode = false;
                $rootScope.loadSmsTemplates();
            }, function (error) {
                vm.setToDefaultMode();
                vm.newMode = false;
                $rootScope.loadSmsTemplates();
            });
        }

        function saveFlyerTemplate() {
            var template = convertFlyerToMongo(vm.flyerEditTemplate);
            helperService.postJsonData(CONFIG.api.crumbs + '/template/flyer', template).then(function (result) {
                vm.setToDefaultMode();
                vm.newMode = false;
                $rootScope.loadFlyerTemplates();
            }, function (error) {
                vm.setToDefaultMode();
                vm.newMode = false;
                $rootScope.loadFlyerTemplates();
            });
        }

        function initEditEmailTemplateMode(template) {
            var obj = convertEmailFromMongo(template);
            vm.editTemplate = obj;
            vm.currentTemplateType = 1;
            for (var i = 0; i < vm.templateTypes.length; i++) {
                if (vm.templateTypes[i].type == 1) {
                    vm.templateTypes[i].newMode = true;
                    vm.newMode = true;
                    break;
                }
            }
        }

        function initEditSmsTemplateMode(template) {
            var obj = convertSmsFromMongo(template);
            console.log(obj);
            vm.smsEditTemplate = obj;
            vm.currentTemplateType = 2;
            for (var i = 0; i < vm.templateTypes.length; i++) {
                if (vm.templateTypes[i].type == 2) {
                    vm.templateTypes[i].newMode = true;
                    vm.newMode = true;
                    break;
                }
            }
        }

        function initEditFlyerTemplateMode(template) {
            var obj = convertFlyerFromMongo(template);
            console.log(obj);
            vm.flyerEditTemplate = obj;
            vm.currentTemplateType = 3;
            for (var i = 0; i < vm.templateTypes.length; i++) {
                if (vm.templateTypes[i].type == 3) {
                    vm.templateTypes[i].newMode = true;
                    vm.newMode = true;
                    break;
                }
            }
        }

        function convertEmailToMongo(obj) {
            var template = {};
            if (obj._id) {
                template._id = obj._id;
            }

            template.name = obj.name;
            template.tags = [];
            if (obj.tags && obj.tags.length > 0) {
                for (var i = 0; i < obj.tags.length; i++) {
                    template.tags.push(obj.tags[i].name);
                }
            }

            template.owner = obj.owner;
            template.shares = obj.shares;
            template.htmlContent = obj.htmlContent;
            template.canUseEdit = obj.canUseEdit;
            template.content = obj.subject;
            template.attachments = [];
            if (obj.attachments && obj.attachments.length > 0) {
                for (var i = 0; i < obj.attachments.length; i++) {
                    var att = {
                        type: obj.attachments[i].type
                    };
                    if (att.type == 1) {
                        att.displayName = obj.attachments[i].displayName;
                        att.file = obj.attachments[i].file;
                    } else if (att.type == 2) {
                        att.displayName = obj.attachments[i].displayName;
                        att.url = obj.attachments[i].url;
                    } else if (att.type == 3) {
                        console.log('EMPTY');
                    }

                    template.attachments.push(att);
                }
            }

            template.emails = [];
            if (obj.emails && obj.emails.length > 0) {
                for (var i = 0; i < obj.emails.length; i++) {
                    var em = {
                        type: obj.emails[i].type
                    };
                    if (em.type == 1 || em.type == 3) {
                        em.displayName = obj.emails[i].displayName;
                        em.emailAddress = obj.emails[i].emailAddress;
                    } else if (em.type == 2) {
                        em.emailType = obj.emails[i].emailType;
                        em.communication = obj.emails[i].communication;
                        em.location = obj.emails[i].location;
                    }

                    template.emails.push(em);
                }
            }

            return template;
        }

        function convertEmailFromMongo(template) {
            var obj = {};
            obj._id = template._id;
            obj.name = template.name;
            obj.tags = [];
            obj.owner = template.owner;
            obj.shares = template.shares;
            obj.htmlContent = template.htmlContent;
            obj.canUseEdit = template.canUseEdit;
            obj.subject = template.content;
            obj.attachments = [];
            obj.emails = [];
            if (template.tags && template.tags.length > 0) {
                for (var i = 0; i < template.tags.length; i++) {
                    obj.tags.push({
                        index: i,
                        name: template.tags[i],
                        text: ''
                    });
                }
            }

            if (template.attachments && template.attachments.length > 0) {
                for (var i = 0; i < template.attachments.length; i++) {
                    obj.attachments.push({
                        index: i,
                        displayName: template.attachments[i].displayName,
                        type: template.attachments[i].type,
                        url: template.attachments[i].url,
                        file: template.attachments[i].file
                    });
                }
            }

            if (template.emails && template.emails.length > 0) {
                for (var i = 0; i < template.emails.length; i++) {
                    obj.emails.push({
                        index: i,
                        type: template.emails[i].type,
                        displayName: template.emails[i].displayName,
                        emailAddress: template.emails[i].emailAddress,
                        communication: template.emails[i].communication,
                        location: template.emails[i].location,
                        emailType: template.emails[i].emailType
                    });
                }
            }

            return obj;
        }

        function convertSmsToMongo(obj) {
            var template = {};
            if (obj._id) {
                template._id = obj._id;
            }

            template.name = obj.name;
            template.tags = [];
            if (obj.tags && obj.tags.length > 0) {
                for (var i = 0; i < obj.tags.length; i++) {
                    template.tags.push(obj.tags[i].name);
                }
            }

            template.owner = obj.owner;
            template.shares = obj.shares;
            template.canUseEdit = obj.canUseEdit;
            template.content = obj.subject;

            template.phones = [];
            if (obj.phones && obj.phones.length > 0) {
                for (var i = 0; i < obj.phones.length; i++) {
                    var em = {
                        type: obj.phones[i].type
                    };
                    if (em.type == 1 || em.type == 3) {
                        em.phoneNumber = obj.phones[i].phoneNumber;
                    } else if (em.type == 2) {
                        em.phoneType = obj.phones[i].phoneType;
                        em.communication = obj.phones[i].communication;
                        em.location = obj.phones[i].location;
                    }

                    template.phones.push(em);
                }
            }

            return template;
        }

        function convertSmsFromMongo(template) {
            var obj = {};
            obj._id = template._id;
            obj.name = template.name;
            obj.tags = [];
            obj.owner = template.owner;
            obj.shares = template.shares;
            obj.canUseEdit = template.canUseEdit;
            obj.subject = template.content;
            obj.phones = [];
            if (template.phones && template.phones.length > 0) {
                for (var i = 0; i < template.phones.length; i++) {
                    obj.phones.push({
                        index: i,
                        type: template.phones[i].type,
                        phoneNumber: template.phones[i].phoneNumber,
                        communication: template.phones[i].communication,
                        location: template.phones[i].location,
                        phoneType: template.phones[i].phoneType
                    });
                }
            }

            return obj;
        }

        function convertFlyerToMongo(obj) {
            var template = {};
            if (obj._id) {
                template._id = obj._id;
            }

            template.name = obj.name;
            template.tags = [];
            if (obj.tags && obj.tags.length > 0) {
                for (var i = 0; i < obj.tags.length; i++) {
                    template.tags.push(obj.tags[i].name);
                }
            }

            template.owner = obj.owner;
            template.shares = obj.shares;
            template.canUseEdit = obj.canUseEdit;
            template.file = obj.file;
            return template;
        }

        function convertFlyerFromMongo(template) {
            var obj = {};
            obj._id = template._id;
            obj.name = template.name;
            obj.tags = [];
            obj.owner = template.owner;
            obj.shares = template.shares;
            obj.canUseEdit = template.canUseEdit;
            obj.file = template.file;
            return obj;
        }

        function showSendEmailDialog(t) {
            vm.sendTemplateModel = {
                jsonModel: '',
                emailAddress: '',
                template: t
            };
            $scope.sendTemplateModal.show();
        }

        function testTemplate() {
            console.log('test function');
        }
    }
})();