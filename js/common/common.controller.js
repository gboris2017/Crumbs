'use strict';

(function () {
    CommonController.$inject = ["$scope", "$rootScope", "FileUploader", "$location", "helperService", "$ionicSideMenuDelegate", "$http", "ListsService", "CampaignsService", "TemplatesService", "CrumbsCommonService"];
    angular.module('crumbs.core').controller('CommonController', ['$scope', '$rootScope', 'FileUploader', '$location', 'helperService', '$ionicSideMenuDelegate', '$http', 'ListsService', 'CampaignsService', 'TemplatesService', 'CrumbsCommonService', CommonController]);

    /** @ngInject */
    function CommonController($scope, $rootScope, FileUploader, $location, helperService, $ionicSideMenuDelegate, $http, ListsService, CampaignsService, TemplatesService, CrumbsCommonService) {
        var vm = this;

        $scope.data = {};

        $scope.$on('$ionicSlides.slideChangeEnd', function (event, data) {
            $scope.activeIndex = data.slider.activeIndex;
            $scope.previousIndex = data.slider.previousIndex;
            $ionicSideMenuDelegate.canDragContent(true);
        });

        var setupSlider = function setupSlider() {
            $scope.data.sliderOptions = {
                initialSlide: 0, //$rootScope.activeSlide,
                direction: 'horizontal',
                speed: 300
            };

            $scope.$watch('$root.activeSlide', function (newVal, oldVal) {
                if (newVal != null && $scope.data.sliderDelegate != undefined && $scope.data.sliderDelegate != null) {
                    $scope.data.sliderDelegate.slideTo(newVal, 300);
                }
            });

            $scope.data.sliderDelegate = null;

            $scope.$watch('data.sliderDelegate', function (newVal, oldVal) {
                if (newVal != null) {
                    $scope.data.sliderDelegate.on('slideChangeEnd', function () {
                        $scope.data.currentPage = $scope.data.sliderDelegate.activeIndex;
                        $scope.$apply();
                    });
                }
            });
        };

        setupSlider();

        $rootScope.viewID = 0;
        $rootScope.selectedType = 0;
        $rootScope.createMode = false;
        $rootScope.setDefaultState = setDefaultState;
        $rootScope.showTab = showTab;

        $rootScope.recentDeals = [];
        $rootScope.loadRecentDeals = loadRecentDeals;

        $rootScope.newNote = {};
        $rootScope.notes = [];
        $rootScope.notesTypes = [];
        $rootScope.loadNotes = loadNotes;
        $rootScope.initCreateNewNote = initCreateNewNote;
        $rootScope.createNewNote = createNewNote;
        $rootScope.cancelNoteCreateMode = cancelNoteCreateMode;

        $rootScope.uploader = new FileUploader({
            url: '#'
        });
        $rootScope.loadFiles = loadFiles;
        $rootScope.collectFilesTypes = collectFilesTypes;
        $rootScope.typeFilter = typeFilter;
        $rootScope.files = [];
        $rootScope.newFile = {};
        $rootScope.filesTypes = [];
        $rootScope.formFilesTypes = [{ id: 1, name: 'Accreditation' }, { id: 2, name: 'Professional Indemnity' }, { id: 3, name: 'Correspondence' }];

        $rootScope.removeFile = removeFile;
        $rootScope.initCreateNewFile = initCreateNewFile;
        $rootScope.createNewFile = createNewFile;
        $rootScope.cancelFileCreateMode = cancelFileCreateMode;

        $rootScope.accreditation = {};
        $rootScope.accreditationStatuses = [{ id: 1, name: 'Status 1' }, { id: 2, name: 'Status 2' }, { id: 3, name: 'Status 3' }];

        $rootScope.accreditationRankings = [{ id: 1, name: 'Ranking 1' }, { id: 2, name: 'Ranking 2' }, { id: 3, name: 'Ranking 3' }];

        $rootScope.accreditationInsurers = [{ id: 1, name: 'Insurer 1' }, { id: 2, name: 'Insurer 2' }, { id: 3, name: 'Insurer 3' }];

        $rootScope.relatedInsuredCompaniesList = [{ id: 1, name: 'Rel Company 1' }, { id: 2, name: 'Rel Company 2' }, { id: 3, name: 'Rel Company 3' }];

        $rootScope.accreditationRegistrationsTypes = [{ id: 1, name: 'Type 1' }, { id: 2, name: 'Type 2' }, { id: 3, name: 'Type 3' }];

        $rootScope.accreditationAccountTypes = [{ id: 1, name: 'Acc Type 1' }, { id: 2, name: 'Acc Type 2' }, { id: 3, name: 'Acc Type 3' }];

        $rootScope.bsbList = [{ id: 1, name: 'BSB 1' }, { id: 2, name: 'BSB 2' }, { id: 3, name: 'BSB 3' }];

        $rootScope.initAccreditationView = initAccreditationView;
        $rootScope.removeRelatedInsuredCompany = removeRelatedInsuredCompany;
        $rootScope.addRelatedInsuredCompany = addRelatedInsuredCompany;
        $rootScope.removeAccreditationRegistration = removeAccreditationRegistration;
        $rootScope.addAccreditationRegistration = addAccreditationRegistration;
        $rootScope.removeAccreditationAccount = removeAccreditationAccount;
        $rootScope.addAccreditationAccount = addAccreditationAccount;

        $rootScope.brandingTypes = [{ id: 1, name: 'Br Type 1' }, { id: 2, name: 'Br Type 2' }, { id: 3, name: 'Br Type 3' }];

        $rootScope.logoAlignments = [{ name: 'Left' }, { name: 'Center' }, { name: 'Right' }];

        $rootScope.initBrandingView = initBrandingView;

        $rootScope.campaingAccounts = [];
        $rootScope.loadAccounts = loadAccounts;

        $rootScope.campaignContacts = [];
        $rootScope.loadContacts = loadContacts;
        $rootScope.showSidebar = function (activeSlide) {
            $rootScope.activeSlide = activeSlide;
            $rootScope.showSidebarContent = true;
        };

        function setDefaultState() {
            $rootScope.createMode = false;
        }

        function showTab(tabName) {
            var path = $location.path();
            switch (tabName) {
                case 'deals':
                    return path.indexOf('/contacts') > -1 || path.indexOf('/accounts') > -1;
                case 'notes':
                    return path.indexOf('/contacts') > -1 || path.indexOf('/accounts') > -1;
                case 'files':
                    return path.indexOf('/contacts') > -1 || path.indexOf('/accounts') > -1;
                case 'accreditation':
                    return path.indexOf('/accounts') > -1;
                case 'branding':
                    return path.indexOf('/accounts') > -1;
                case 'accounts':
                    return path.indexOf('/campaigns') > -1;
                case 'contacts':
                    return path.indexOf('/campaigns') > -1;
                case 'listsaccounts':
                    return path.indexOf('/lists') > -1;
                case 'listscontacts':
                    return path.indexOf('/lists') > -1;
                case 'templatesemails':
                    return path.indexOf('/templates') > -1;
                case 'templatessms':
                    return path.indexOf('/templates') > -1;
                case 'templatesflyers':
                    return path.indexOf('/templates') > -1;
                case 'relosusers':
                    return path.indexOf('/users') > -1;
            }
            return true;
        }

        function getMaxId(list) {
            var maxId = 1;
            list.forEach(function (item) {
                if (item.id > maxId) {
                    maxId = item.id;
                }
            });

            return maxId;
        }

        // deals
        function loadRecentDeals() {
            $rootScope.showSidebarContent = true;
            $rootScope.setDefaultState();
            $rootScope.viewID = 1;
            $rootScope.recentDeals = [{
                type: 1,
                phone: '123-23-23',
                amount: 123424,
                status: 'Valiation Ordered'
            }, {
                type: 2,
                phone: '123-23-23',
                amount: 123424,
                status: 'Final'
            }, {
                type: 1,
                phone: '123-23-23',
                amount: 123424,
                status: 'Home Loans'
            }, {
                type: 3,
                phone: '123-23-23',
                amount: 123424,
                status: 'Dev'
            }, {
                type: 2,
                phone: '123-23-23',
                amount: 123424,
                status: 'car loans'
            }];
        }

        $rootScope.loadNotesTypes = loadNotesTypes;
        $rootScope.getNoteType = getNoteType;
        $rootScope.currentContactsPartyID = 0;

        function loadNotesTypes() {
            if (!$rootScope.notesTypes || $rootScope.notesTypes.length == 0) {
                $rootScope.notesTypes = [];
                CrumbsCommonService.getTypes('hnt').then(function (result) {
                    $rootScope.notesTypes = result;
                    $rootScope.notesTypes.forEach(function (item) {
                        item.id = item.iD;
                    });
                }, function (error) {
                    $rootScope.notesTypes = [];
                });
            }
        }

        function getNoteType(id) {
            var name = '';
            $rootScope.notesTypes.forEach(function (item) {
                if (item.id == id) {
                    name = item.name;
                }
            });

            return name;
        }

        // notes
        function loadNotes(id) {
            $rootScope.currentContactsPartyID = id;
            $rootScope.showSidebarContent = true;
            $rootScope.setDefaultState();
            $rootScope.viewID = 2;
            $rootScope.notes = [];
            $rootScope.loadNotesTypes();
            CrumbsCommonService.loadNotes(id).then(function (result) {
                $rootScope.notes = result;
            }, function (error) {
                $rootScope.notes = [];
            });
        }

        function typeFilter(item) {
            if (!item || $rootScope.selectedType == 0) {
                return true;
            } else {
                return item.historyNoteTypeID == $rootScope.selectedType;
            }
        }

        function initCreateNewNote() {
            $rootScope.createMode = true;
            $rootScope.newNote = {
                title: '',
                text: '',
                typeObj: undefined
            };
        }

        function createNewNote() {
            console.log($rootScope.newNote);
            var createJson = {
                historyNoteTypeID: $rootScope.newNote.typeObj,
                historyNoteStatusTypeID: 1,
                partyID: $rootScope.currentContactsPartyID,
                title: $rootScope.newNote.title,
                note: $rootScope.newNote.text,
                HistoryNoteStatusTypeID: 1,
                HistoryNoteTypeID: $rootScope.newNote.typeObj,
                PartyID: $rootScope.currentContactsPartyID
            };
            console.log(createJson); // http://localhost:3000/party/357364/history-note

            $http({
                url: CONFIG.api.crumbs + '/party/' + $rootScope.currentContactsPartyID + '/history-note',
                dataType: 'json', method: 'POST', data: createJson,
                headers: { 'Content-Type': 'application/json' }
            }).then(function (data) {
                $rootScope.cancelNoteCreateMode();
                $rootScope.loadNotes($rootScope.currentContactsPartyID);
            }, function (error) {
                alert('error whil creating');
            });
        }

        function cancelNoteCreateMode() {
            $rootScope.initCreateNewNote();
            $rootScope.createMode = false;
        }

        //files
        function loadFiles() {
            $rootScope.showSidebarContent = true;
            $rootScope.setDefaultState();
            $rootScope.viewID = 3;
            $rootScope.files = [{
                id: 1,
                name: 'file1.pdf',
                createDateText: '16/12/2016',
                createDateTimestamp: 235235235335,
                type: 'Professional Indemnity',
                typeId: 2
            }, {
                id: 2,
                name: 'gemneral-report-home.pdf',
                createDateText: '16/12/2016',
                createDateTimestamp: 235235235335,
                type: 'Accreditation',
                typeId: 1
            }, {
                id: 3,
                name: 'file2.xml',
                createDateText: '16/12/2016',
                createDateTimestamp: 235235235335,
                type: 'Correspondence',
                typeId: 3
            }];

            $rootScope.collectFilesTypes();
        }

        function collectFilesTypes() {
            $rootScope.filesTypes = [];
            if ($rootScope.files) {
                $rootScope.files.forEach(function (file) {
                    if ($rootScope.filesTypes.indexOf(file.type) == -1) {
                        $rootScope.filesTypes.push(file.type);
                    }
                });
            }
        }

        function removeFile(fileId) {
            var index = -1;
            for (var i = 0; i < $rootScope.files.length; i++) {
                if ($rootScope.files[i].id == fileId) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                $rootScope.files.splice(index, 1);
            }
        }

        function initCreateNewFile() {
            $rootScope.createMode = true;
            $rootScope.newFile = {
                id: 0,
                name: '',
                typeObj: 0
            };
        }

        function createNewFile() {
            var maxId = getMaxId($rootScope.files);
            var itemToAdd = {
                id: maxId + 1,
                name: $rootScope.newFile.name,
                createDateText: '16/12/2016',
                createDateTimestamp: 235235235335,
                type: $rootScope.newFile.typeObj.name,
                typeId: $rootScope.newFile.typeObj.id
            };

            $rootScope.files.push(itemToAdd);
            $rootScope.cancelFileCreateMode();
            $rootScope.collectFilesTypes();
        }

        function cancelFileCreateMode() {
            $rootScope.initCreateNewFile();
            $rootScope.createMode = false;
        }

        //Accreditation
        function initAccreditationView() {
            $rootScope.showSidebarContent = true;
            $rootScope.setDefaultState();
            $rootScope.viewID = 4;
            $rootScope.accreditation = {
                status: undefined,
                ranking: undefined,
                accountId: '',
                insurer: {
                    id: 1,
                    name: ''
                },
                policyNumber: '',
                coverAmount: '',
                policyDate: undefined,
                expiryDate: undefined,
                cocSuppliedDate: '',
                expiryEmailSentDate: '',
                confirmRequestedDate: '',
                confirmReceivedDate: '',
                relatedInsuredCompanies: [{ id: 1, name: 'Company 1' }, { id: 2, name: 'Company 2' }, { id: 3, name: 'Company 3' }],
                registrations: [{
                    id: 1,
                    type: undefined,
                    number: 'num 1',
                    expiryDate: '12/12/33'
                }],
                bankAccounts: [{
                    id: 1,
                    accountType: undefined,
                    bsb: 'bsb1',
                    accountNumber: '23523fse3',
                    accountName: 'Account working'
                }]
            };
        }

        function removeRelatedInsuredCompany(id) {
            var index = -1;
            for (var i = 0; i < $rootScope.accreditation.relatedInsuredCompanies.length; i++) {
                if ($rootScope.accreditation.relatedInsuredCompanies[i].id == id) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                $rootScope.accreditation.relatedInsuredCompanies.splice(index, 1);
            }
        }

        function addRelatedInsuredCompany() {
            var itemToAdd = {
                id: getMaxId($rootScope.accreditation.relatedInsuredCompanies) + 1,
                name: ''
            };

            $rootScope.accreditation.relatedInsuredCompanies.push(itemToAdd);
        }

        function removeAccreditationRegistration(id) {
            var index = -1;
            for (var i = 0; i < $rootScope.accreditation.registrations.length; i++) {
                if ($rootScope.accreditation.registrations[i].id == id) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                $rootScope.accreditation.registrations.splice(index, 1);
            }
        }

        function addAccreditationRegistration() {
            var itemToAdd = {
                id: getMaxId($rootScope.accreditation.registrations) + 1,
                type: 0,
                number: '',
                expiryDate: undefined
            };
            $rootScope.accreditation.registrations.push(itemToAdd);
        }

        function removeAccreditationAccount(id) {
            var index = -1;
            for (var i = 0; i < $rootScope.accreditation.bankAccounts.length; i++) {
                if ($rootScope.accreditation.bankAccounts[i].id == id) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                $rootScope.accreditation.bankAccounts.splice(index, 1);
            }
        }

        function addAccreditationAccount() {
            var itemToAdd = {
                id: getMaxId($rootScope.accreditation.bankAccounts) + 1,
                accountType: 0,
                bsb: '',
                accountNumber: '',
                accountName: ''
            };
            $rootScope.accreditation.bankAccounts.push(itemToAdd);
        }

        $rootScope.imageUpload = imageUpload;
        $rootScope.triggerUpload = triggerUpload;

        // branding
        function initBrandingView() {
            $rootScope.showSidebarContent = true;
            $rootScope.setDefaultState();
            $rootScope.viewID = 5;
            $rootScope.branding = {
                documentBranding: undefined,
                onlineBranding: undefined,
                spvName: '',
                spvAcn: '',
                branchId: '',
                preAustralianPhone: '',
                preInternationalPhone: '',
                preEmailAddress: '',
                postAustralianPhone: '',
                postInternationalPhone: '',
                postEmailAddress: '',
                logo1: undefined,
                logo2: undefined,
                logoAlignment: 'Left',
                signatureText1: '',
                signatureText2: '',
                footerAlignment: 'Left',
                footerLine1Left: '',
                footerLine2Left: '',
                footerLine3Left: '',
                footerLine4Left: '',
                footerLine5Left: '',
                footerLine1: '',
                footerLine2: '',
                footerLine3: '',
                footerLine4: '',
                footerLine5: '',
                signatureText1Post: '',
                signatureText2Post: '',
                footerAlignmentPost: 'Left',
                footerLine1LeftPost: '',
                footerLine2LeftPost: '',
                footerLine3LeftPost: '',
                footerLine4LeftPost: '',
                footerLine5LeftPost: '',
                footerLine1Post: '',
                footerLine2Post: '',
                footerLine3Post: '',
                footerLine4Post: '',
                footerLine5Post: '',
                servicesUrl: ''
            };
        }

        function imageUpload(selectedfiles, index) {
            var f = selectedfiles[0];
            if (f) {
                var r = new FileReader();
                r.onloadend = function (e) {
                    $scope.$apply(function () {
                        if (index == 1) {
                            $rootScope.branding.logo1 = e.target.result;
                        }

                        if (index == 2) {
                            $rootScope.branding.logo2 = e.target.result;
                        }

                        if (index == 3) {
                            $rootScope.branding.logo3 = e.target.result;
                        }

                        if (index == 4) {
                            $rootScope.branding.logo4 = e.target.result;
                        }
                    });
                };

                r.readAsDataURL(f);
            }
        }

        function triggerUpload(id) {
            var fileuploader = angular.element('#' + id);
            fileuploader.trigger('click');
        }

        // -------------------------------- CAMPAIGN AND LISTS ---------------------------------
        $rootScope.goToCampaign = goToCampaign;
        $rootScope.goToList = goToList;

        function loadAccounts() {
            $rootScope.showSidebarContent = true;
            $rootScope.setDefaultState();
            $rootScope.viewID = 6;
            CampaignsService.getListSidebar('accounts').then(function (result) {
                $rootScope.campaingAccounts = result;
            }, function (error) {
                $rootScope.campaingAccounts = [];
            });
        }

        function loadContacts() {
            $rootScope.showSidebarContent = true;
            $rootScope.setDefaultState();
            $rootScope.viewID = 7;
            CampaignsService.getListSidebar('contacts').then(function (result) {
                $rootScope.campaingContacts = result;
            }, function (error) {
                $rootScope.campaingContacts = [];
            });
        }

        function goToCampaign(id) {
            var campaignsScope = angular.element(document.getElementById('campaignsController')).scope();
            if (campaignsScope) {
                campaignsScope.vm.showCampaign(id);
            }
        }

        function goToList(id) {
            var listsScope = angular.element(document.getElementById('listsController')).scope();
            if (listsScope) {
                listsScope.vm.showList(id);
            }
        }

        // lists Accounts
        $rootScope.listsAccounts = [];
        $rootScope.loadListsAccounts = loadListsAccounts;

        function loadListsAccounts() {
            $rootScope.showSidebarContent = true;
            $rootScope.setDefaultState();
            $rootScope.viewID = 8;
            ListsService.getListSidebar('accounts').then(function (result) {
                $rootScope.listsAccounts = result;
            }, function (error) {
                $rootScope.listsAccounts = [];
            });
        }

        // Lists Contacts
        $rootScope.listsContacts = [];
        $rootScope.loadListsContacts = loadListsContacts;
        $rootScope.makeListFavorite = makeListFavorite;
        $rootScope.deleteList = deleteList;

        function loadListsContacts() {
            $rootScope.showSidebarContent = true;
            $rootScope.setDefaultState();
            $rootScope.viewID = 9;
            ListsService.getListSidebar('contacts').then(function (result) {
                $rootScope.listsContacts = result;
            }, function (error) {
                $rootScope.listsContacts = [];
            });
        }

        function makeListFavorite(id, favourite, accounts) {
            $http({
                url: CONFIG.api.crumbs + '/lists/' + id + '/favourite?favourite=' + favourite,
                dataType: 'json', method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }).then(function (data) {
                if (accounts) {
                    $rootScope.loadListsAccounts();
                } else {
                    $rootScope.loadListsContacts();
                }
            }, function (error) {
                console.log(error);
            });
        }

        function deleteList(id, accounts) {
            $http({
                url: CONFIG.api.crumbs + '/lists/' + id,
                dataType: 'json', method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            }).then(function (data) {
                if (accounts) {
                    $rootScope.loadListsAccounts();
                } else {
                    $rootScope.loadListsContacts();
                }
            }, function (error) {
                consol.elog(error);
            });
        }

        // Templates
        $rootScope.templatesList = [];
        $rootScope.templatesListTypes = [];
        $rootScope.emailTemplatesList = [];
        $rootScope.emailTemplatesTagsList = [];
        $rootScope.smsTemplatesList = [];
        $rootScope.smsTemplatesTagsList = [];
        $rootScope.flyerTemplatesList = [];
        $rootScope.flyerTemplatesTagsList = [];
        $rootScope.loadTemplatesList = loadTemplatesList;
        $rootScope.loadEmailTemplates = loadEmailTemplates;
        $rootScope.loadSmsTemplates = loadSmsTemplates;
        $rootScope.filterTemplate = filterTemplate;
        $rootScope.deleteEmailTemplate = deleteEmailTemplate;
        $rootScope.initEditEmailTemplateMode = initEditEmailTemplateMode;
        $rootScope.deleteSmsTemplate = deleteSmsTemplate;
        $rootScope.filterSmsTemplate = filterSmsTemplate;
        $rootScope.initEditSmsTemplateMode = initEditSmsTemplateMode;
        $rootScope.formatDate = formatDate;
        $rootScope.loadFlyerTemplates = loadFlyerTemplates;
        $rootScope.deleteFlyerTemplate = deleteFlyerTemplate;
        $rootScope.filterFlyerTemplate = filterFlyerTemplate;
        $rootScope.initEditFlyerTemplateMode = initEditFlyerTemplateMode;
        $rootScope.sendEmailTemplate = sendEmailTemplate;
        $rootScope.selectedEmailTag = 'All';
        $rootScope.selectedSmsTag = 'All';
        $rootScope.selectedFlyerTag = 'All';

        function loadTemplatesList() {
            $rootScope.showSidebarContent = true;
            $rootScope.setDefaultState();
            $rootScope.viewID = 10;
            $rootScope.templatesListTypes = [{ id: 0, name: 'All' }, { id: 1, name: 'ABS' }, { id: 2, name: 'ABS Broker' }, { id: 3, name: 'Broker' }, { id: 4, name: 'Dashboard' }, { id: 5, name: 'K2' }, { id: 6, name: 'Finance' }, { id: 7, name: 'LCA' }, { id: 8, name: 'LMTC' }, { id: 9, name: 'Pooling' }, { id: 10, name: 'Retail' }, { id: 11, name: 'Trax' }];

            $rootScope.templatesList = [{
                id: 1,
                name: 'Template name 1',
                lastUpdated: 12412452141,
                updatedBy: { id: 1, name: 'User 1' },
                type: { id: 2, name: 'ABS Broker' }
            }, {
                id: 2,
                name: 'Template name 2',
                lastUpdated: 18412452141,
                updatedBy: { id: 2, name: 'User 2' },
                type: { id: 9, name: 'Pooling' }
            }, {
                id: 3,
                name: 'Template name 3',
                lastUpdated: 124124521411,
                updatedBy: { id: 3, name: 'User 3' },
                type: { id: 11, name: 'Trax' }
            }, {
                id: 4,
                name: 'Template name 4',
                lastUpdated: 22412452141,
                updatedBy: { id: 4, name: 'User 4' },
                type: { id: 11, name: 'Trax' }
            }];

            $rootScope.templatesList.forEach(function (item) {
                item.lastUpdated_str = helperService.formatDate(item.lastUpdated);
            });
        }

        function loadFlyerTemplates() {
            $rootScope.showSidebarContent = true;
            $rootScope.setDefaultState();
            $rootScope.viewID = 10;
            TemplatesService.getFlyerTemplates().then(function (result) {
                $rootScope.flyerTemplatesList = result;
                console.log(result);
            }, function (error) {
                $rootScope.flyerTemplatesList = [];
            });

            $rootScope.selectedFlyerTag = 'All';
            $rootScope.flyerTemplatesTagsList = [];
            $rootScope.flyerTemplatesTagsList.push('All');
            TemplatesService.getFlyerTemplateTags().then(function (result) {
                for (var i = 0; i < result.length; i++) {
                    $rootScope.flyerTemplatesTagsList.push(result[i]);
                }
            }, function (error) {
                $rootScope.flyerTemplatesTagsList = [];
                $rootScope.flyerTemplatesTagsList.push('All');
            });
        }

        function deleteFlyerTemplate(template) {
            $http({
                url: CONFIG.api.crumbs + '/template/flyer/' + template._id,
                dataType: 'json', method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            }).then(function (data) {
                $rootScope.loadFlyerTemplates();
            }, function (error) {
                $rootScope.loadFlyerTemplates();
            });
        }

        function sendEmailTemplate(t) {
            var templatesScope = angular.element(document.getElementById('templatesController')).scope();
            if (templatesScope) {
                templatesScope.vm.showSendEmailDialog(t);
            }
        }

        function filterFlyerTemplate(item) {
            if (!item || $rootScope.selectedFlyerTag == undefined || $rootScope.selectedFlyerTag == 'All') {
                return true;
            } else {
                if (item.tags && item.tags.indexOf($rootScope.selectedFlyerTag) > -1) {
                    return true;
                }

                return false;
            }
        }

        function initEditFlyerTemplateMode(template) {
            var templatesScope = angular.element(document.getElementById('templatesController')).scope();
            if (templatesScope) {
                templatesScope.vm.initEditFlyerTemplateMode(template);
            }
        }

        function loadSmsTemplates() {
            $rootScope.showSidebarContent = true;
            $rootScope.setDefaultState();
            $rootScope.viewID = 10;
            $rootScope.selectedSmsTag = 'All';
            TemplatesService.getSmsTemplates().then(function (result) {
                $rootScope.smsTemplatesList = result;
                console.log(result);
            }, function (error) {
                $rootScope.smsTemplatesList = [];
            });

            $rootScope.smsTemplatesTagsList = [];
            $rootScope.smsTemplatesTagsList.push('All');
            TemplatesService.getSmsTemplateTags().then(function (result) {
                for (var i = 0; i < result.length; i++) {
                    $rootScope.smsTemplatesTagsList.push(result[i]);
                }

                console.log($rootScope.smsTemplatesTagsList);
            }, function (error) {
                $rootScope.smsTemplatesTagsList = [];
            });
        }

        function deleteSmsTemplate(template) {
            $http({
                url: CONFIG.api.crumbs + '/template/sms/' + template._id,
                dataType: 'json', method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            }).then(function (data) {
                $rootScope.loadSmsTemplates();
            }, function (error) {
                $rootScope.loadSmsTemplates();
            });
        }

        function filterSmsTemplate(item) {
            if (!item || $rootScope.selectedSmsTag == undefined || $rootScope.selectedSmsTag == 'All') {
                return true;
            } else {
                if (item.tags && item.tags.indexOf($rootScope.selectedSmsTag) > -1) {
                    return true;
                }

                return false;
            }
        }

        function initEditSmsTemplateMode(template) {
            var templatesScope = angular.element(document.getElementById('templatesController')).scope();
            if (templatesScope) {
                templatesScope.vm.initEditSmsTemplateMode(template);
            }
        }

        function loadEmailTemplates() {
            $rootScope.showSidebarContent = true;
            $rootScope.setDefaultState();
            $rootScope.viewID = 10;
            $rootScope.selectedEmailTag = 'All';
            $rootScope.emailTemplatesTagsList = [];
            TemplatesService.getEmailTemplates().then(function (result) {
                $rootScope.emailTemplatesList = result;
            }, function (error) {
                $rootScope.emailTemplatesList = [];
            });

            $rootScope.emailTemplatesTagsList.push('All');
            TemplatesService.getEmailTemplateTags().then(function (result) {
                for (var i = 0; i < result.length; i++) {
                    $rootScope.emailTemplatesTagsList.push(result[i]);
                }
            }, function (error) {
                $rootScope.emailTemplatesTagsList = [];
            });
        }

        function deleteEmailTemplate(template) {
            $http({
                url: CONFIG.api.crumbs + '/template/email/' + template._id,
                dataType: 'json', method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            }).then(function (data) {
                $rootScope.loadEmailTemplates();
            }, function (error) {
                $rootScope.loadEmailTemplates();
            });
        }

        function filterTemplate(item) {
            if (!item || $rootScope.selectedEmailTag == undefined || $rootScope.selectedEmailTag == 'All') {
                return true;
            } else {
                if (item.tags && item.tags.indexOf($rootScope.selectedEmailTag) > -1) {
                    return true;
                }

                return false;
            }
        }

        function initEditEmailTemplateMode(template) {
            var templatesScope = angular.element(document.getElementById('templatesController')).scope();
            if (templatesScope) {
                templatesScope.vm.initEditEmailTemplateMode(template);
            }
        }

        // ROLES
        $rootScope.initUserRoles = initUserRoles;
        $rootScope.showManagePermissionsScreen = showManagePermissionsScreen;
        $rootScope.updateFromActiveDirectory = updateFromActiveDirectory;
        $rootScope.rolesItem = {};
        $rootScope.rolesMode = 1;

        function initUserRoles(user) {
            $rootScope.rolesItem = user;
            console.log($rootScope.rolesItem);
        }

        function showManagePermissionsScreen() {
            $rootScope.rolesMode = 2;
            $ionicSideMenuDelegate.toggleLeft(false);
        }

        function updateFromActiveDirectory() {
            alert('Coming soon');
        }

        function formatDate(date) {
            return helperService.formatDate(date);
        }
    }
})();