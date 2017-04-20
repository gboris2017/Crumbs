'use strict';

(function () {
    // TODO: separate

    angular.module('crumbs.core').directive('fmcEscape', function () {
        return function (scope, element, attrs) {
            element.bind('keydown keypress', function (event) {
                if (event.which === 27) {
                    scope.$apply(function () {
                        scope.$eval(attrs.myEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })

    /** Allows a client to provide their own ad-hoc id_token value */
    .directive('fmcIdToken', ['$window', function ($window) {

        var definition = {
            restrict: 'E',
            replace: true,
            scope: {
                token: '@'
            }
        };

        definition.link = function (scope, element, attrs) {
            $window.sessionStorage.setItem('id_token', scope.token);
        };

        return definition;
    }]).directive('holdList', ['$ionicGesture', function ($ionicGesture) {
        return {
            restrict: 'A',
            link: function link(scope, element, attrs) {
                $ionicGesture.on('hold', function (e) {

                    var content = element[0].querySelector('.item-content');

                    var buttons = element[0].querySelector('.item-options');
                    var buttonsWidth = buttons.offsetWidth;

                    ionic.requestAnimationFrame(function () {
                        content.style[ionic.CSS.TRANSITION] = 'all ease-out .25s';

                        if (!buttons.classList.contains('invisible')) {
                            content.style[ionic.CSS.TRANSFORM] = '';
                            setTimeout(function () {
                                buttons.classList.add('invisible');
                            }, 250);
                        } else {
                            buttons.classList.remove('invisible');
                            content.style[ionic.CSS.TRANSFORM] = 'translate3d(-' + buttonsWidth + 'px, 0, 0)';
                        }
                    });
                }, element);
            }
        };
    }]).directive('validateEmail', function () {
        var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

        return {
            require: 'ngModel',
            restrict: '',
            link: function link(scope, elm, attrs, ctrl) {
                if (ctrl && ctrl.$validators.email) {
                    ctrl.$validators.email = function (modelValue) {
                        return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                    };
                }
            }
        };
    }).directive('fancySelect', ['$ionicModal', 'helperService', function ($ionicModal, helperService) {
        return {
            /* Only use as <fancy-select> tag */
            restrict: 'E',
            /* Our template */
            templateUrl: 'templates/item-template.html',
            /* Attributes to set */
            scope: {
                items: '=', /* Items list is mandatory */
                text: '=', /* Displayed text is mandatory */
                value: '=', /* Selected value binding is mandatory */
                callback: '&'
            },
            link: function link(scope, element, attrs) {
                scope.$watch('value', function () {
                    initValues();
                });

                scope.multiText = attrs.multiText || '';
                scope.preText = attrs.preText || '';
                scope.allowCustom = attrs.allowCustom === 'true' ? true : false;
                scope.showList = attrs.showList === 'false' ? false : true;
                scope.searchBox = attrs.searchBox === 'true' ? true : false;
                scope.multiSelect = attrs.multiSelect === 'true' ? true : false;
                scope.allowEmpty = attrs.allowEmpty === 'false' ? false : true;
                scope.headerText = attrs.headerText || '';
                scope.defaultText = scope.name || '';
                scope.noteText = attrs.noteText || '';
                scope.noteImg = attrs.noteImg || '';
                scope.noteImgClass = attrs.noteImgClass || '';
                scope.searchText = '';
                scope.searchFunction = attrs.searchFunction;
                scope.index = attrs.index || -1;
                scope.autoHeight = attrs.autoHeight === 'false' ? false : true;
                scope.nameAsValue = attrs.nameAsValue === 'true' ? true : false;
                scope.nameToSet = attrs.nameToSet || '';

                scope.addrId = -1;
                scope.nameSet = false;

                scope.changeValue = changeValue;

                initValues();

                function initValues() {
                    scope.name = '';
                    if (scope.value != undefined && scope.value != null && typeof scope.value == 'string' && scope.value.indexOf(';') > -1) {
                        if (scope.allowCustom) {
                            scope.name = scope.value;
                            scope.changeValue(scope.value);
                        } else {
                            if (scope.multiSelect == true) {
                                var itemsLength = 0;
                                var valuesSeparated = scope.value.split(';');
                                jQuery.each(scope.items, function (index, item) {
                                    var found = false;
                                    for (var i = 0; i < valuesSeparated.length; i++) {
                                        if (valuesSeparated[i] == item.id) {
                                            item.checked = true;
                                            scope.name = scope.name + item.name + ', ';
                                            itemsLength++;
                                        }
                                    }
                                });

                                if (scope.multiText == undefined || scope.multiText.length == 0) {
                                    scope.name = scope.preText + ' ' + scope.name.substr(0, scope.name.length - 2);
                                } else {
                                    scope.name = itemsLength + ' ' + scope.multiText;
                                }
                            }
                        }
                    } else if (scope.value != undefined && scope.value != null) {
                        if (scope.allowCustom) {
                            scope.name = scope.value;
                            scope.changeValue(scope.value);
                        } else {
                            if (scope.nameAsValue) {
                                scope.name = scope.nameToSet;
                                scope.nameSet = true;
                            } else {
                                for (var i = 0; i < scope.items.length; i++) {
                                    if (scope.items[i].id == scope.value) {
                                        scope.name = scope.items[i].name;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }

                $ionicModal.fromTemplateUrl('templates/modal-template.html', { scope: scope }).then(function (modal) {
                    scope.modal = modal;
                });

                scope.validate = function (event) {
                    if (scope.multiSelect == true) {
                        scope.value = '';
                        scope.name = '';
                        var itemsLength = 0;
                        jQuery.each(scope.items, function (index, item) {
                            if (item.checked) {
                                scope.value = scope.value + item.id + ';';
                                scope.name = scope.name + item.name + ', ';
                                itemsLength++;
                            }
                        });

                        scope.value = scope.value.substr(0, scope.value.length - 1);
                        if (scope.multiText == undefined) {
                            scope.name = scope.name.substr(0, scope.name.length - 2);
                        } else {
                            scope.name = itemsLength + ' ' + scope.multiText;
                        }
                    }

                    if (typeof scope.value == 'undefined' || scope.value == '' || scope.value == null || scope.allowCustom && scope.value == -1) {
                        if (scope.allowCustom) {
                            if (scope.searchText != undefined && scope.searchText.length > 0) {
                                //scope.value = -1;
                                scope.name = scope.searchText;
                                scope.value = scope.name;
                            }
                        } else if (typeof scope.value == 'undefined' || scope.value == '' || scope.value == null) {
                            if (scope.allowEmpty == false) {
                                scope.value = scope.items[0].id;
                                scope.name = scope.items[0].name;
                                scope.items[0].checked = true;
                            } else {
                                scope.name = scope.defaultText;
                            }
                        }
                    }

                    scope.hideItems();
                    if (typeof scope.callback == 'function') {
                        try {
                            scope.callback()(item.addrId, scope.name, scope.index, scope.value);
                        } catch (e) {
                            // console.log(e);
                        }
                    }
                };

                scope.showItems = function (event) {
                    event.preventDefault();
                    scope.modal.show();
                };

                scope.hideItems = function () {
                    scope.modal.hide();
                    $('#search-box1').val('');
                };

                scope.$on('$destroy', function () {
                    scope.modal.remove();
                    $('#search-box1').val('');
                });

                scope.validateSingle = function (item) {
                    scope.name = item.name;
                    scope.value = item.id;
                    scope.hideItems();
                    if (typeof scope.callback == 'function') {
                        try {
                            scope.callback()(item.addrId, scope.name, scope.index, scope.value);
                        } catch (e) {
                            // console.log(e);
                        }
                    }
                };

                scope.filterItem = function (item) {
                    if (scope.searchBox == false) {
                        return true;
                    } else {
                        var searchValue = scope.searchText;
                        if (!scope.showList) {
                            searchValue = '' + searchValue;
                            if (searchValue == undefined || searchValue.length == 0) {
                                return false;
                            } else if (item.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
                                return true;
                            }
                        } else {
                            if (searchValue == undefined || searchValue.length == 0 || item.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
                                return true;
                            }
                        }

                        return false;
                    }
                };

                function changeValue(value) {
                    scope.searchText = value;
                    scope.name = value;
                    if (scope.allowCustom && value && value.length > 0) {
                        helperService.getJsonData(CONFIG.api.crumbs + '/address/search?frag=' + value).then(function (result) {
                            scope.items = [];
                            for (var i = 0; i < result.length; i++) {
                                scope.items.push({
                                    id: result[i].AddressText,
                                    name: result[i].AddressText,
                                    addrId: result[i].ID
                                });
                            }
                        }, function (error) {
                            scope.items = [];
                        });
                    }
                }
            }
        };
    }]);
})();