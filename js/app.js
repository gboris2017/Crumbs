'use strict';

(function () {
    angular.module('crumbs.configuration', []).constant('CONFIG', CONFIG);

    angular.module('crumbs', ['ngSanitize', 'crumbs.configuration', 'crumbs.core', 'crumbs.contacts', 'crumbs.accounts', 'crumbs.lists', 'crumbs.campaigns', 'crumbs.orphans', 'crumbs.users', 'crumbs.templates', 'crumbs.settings']);
})();