'use strict';

(function () {
    angular.module('crumbs.core').service('helperService', ['$http', '$q', function ($http, $q) {
        this.formatDate = function (ts) {
            return moment(ts).format('DD/MM/YYYY');
        };

        this.emailValid = function (email) {
            if (email == undefined || email.length == 0) {
                return true;
            }

            var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
            return EMAIL_REGEXP.test(email);
        };

        this.getJsonData = function (url) {
            var data = undefined;
            var deferred = $q.defer();
            $http.get(url).then(function (result) {
                data = result.data;
                deferred.resolve(data);
            }, function (error) {
                data = error;
                deferred.reject(error);
            });

            data = deferred.promise;
            return $q.when(data);
        };

        this.postJsonData = function (url, payload) {
            var deferred = $q.defer();
            var data = undefined;
            $http({
                url: url,
                method: 'POST',
                data: payload,
                headers: { 'Content-Type': 'application/json' }
            }).then(function (result) {
                data = result.data;
                deferred.resolve(result);
            }, function (error) {
                data = error;
                deferred.reject(error);
            });
            data = deferred.promise;
            return $q.when(data);
        };
    }]);
})();