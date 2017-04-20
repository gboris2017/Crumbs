'use strict';

(function () {
    angular.module('crumbs.core').filter('expandState', expandState);

    function expandState() {
        return function (input) {
            var parts = input.split('.');
            var output = '';
            var prefix = '';
            for (var i = 0; i < parts.length; i++) {
                output += prefix + parts[i] + ' ';
                prefix += parts[i] + '-';
            }

            return output;
        };
    }
})();