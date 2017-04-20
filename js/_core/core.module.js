'use strict';

(function () {
    configure.$inject = ["$locationProvider", "$urlRouterProvider", "multiselectProvider"];
    run.$inject = ["$rootScope", "$state", "CONFIG", "toastr", "$http"];
    angular.module('crumbs.core', ['ui.router', 'permission', 'permission.ui', 'ui.bootstrap', 'ngAnimate', 'ngResource', 'angular-loading-bar', 'toastr', 'ngTouch', 'angularFileUpload', 'angularTrix', 'ionic', 'ion-datetime-picker', 'ngTable', 'ionic-multiselect', 'ngFileUpload', 'crumbs.configuration']).config(configure).run(run);

    /** @ngInject */
    function configure($locationProvider, $urlRouterProvider, multiselectProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true,
            rewriteLinks: true
        });

        $urlRouterProvider.otherwise('/');

        multiselectProvider.setTemplateUrl('templates/item-template.html');
        multiselectProvider.setModalTemplateUrl('templates/modal-template.html');

        // ngToastProvider.configure({
        //     dismissButton: true,
        //     dismissButtonHtml: '<i class="fa fa-close"></i>'
        // });
        //
        // $resourceProvider.defaults.cancellable = true;
        //
        // jwtOptionsProvider.config({
        //     tokenGetter: ["$window", "ConfigurationService", ($window, ConfigurationService) => {
        //         return $window.sessionStorage.getItem('id_token');
        //     }],
        //     whiteListedDomains: [
        //         'localhost',
        //         'test-api.firstmac.com.au',
        //         'api.firstmac.com.au'
        //     ]
        // });
        //
        // $httpProvider.interceptors.push('jwtInterceptor');
    }

    /** @ngInject */
    function run($rootScope, $state, CONFIG, toastr, $http) {
        angular.extend($rootScope, {
            $state: $state,
            CONFIG: CONFIG,
            toastr: toastr,
            settings: {}
        });

        //$http.defaults.headers.common.Authorization = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InptcUNwUlVzZlByNjFBUVdPaWlSUjFEaHdKdyIsImtpZCI6InptcUNwUlVzZlByNj
        // FBUVdPaWlSUjFEaHdKdyJ9.eyJpc3MiOiJodHRwczovL2ZpcnN0bWFjIiwiYXVkIjoiaHR0cHM6Ly9maXJzdG1hYy9yZXNvdXJjZXMiLCJleHAiOjI0NzA5ODI4MDAsIm5iZiI6MTQ3MDk3NTYwMCwiY2xpZW50X2lk
        // IjoiaW50ZXJuYWwiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwicm9sZXMiLCJzaXRldHlwZSIsImNydW1ic2lkZW50aXR5Il0sInN1YiI6IjU4QTNGODYxODQ0NDQ4NkY4MDEzNTc0RjQiLCJhdXRoX3RpbWUi
        // OjE0NzA5NzU2MDAsImlkcCI6IndpbmF1dGgiLCJuYW1lIjoiU3RhbmRhcmQuVXNlckBmaXJzdG1hYy5jb20uYXUiLCJhcHBsaWNhdGlvbl9uYW1lIjoiQ3J1bWJzIiwiY29tbW9uX25hbWUiOiJTdGFuZGFyZCBVc2Vy
        // IiwiY3J1bWJzX2xvZ2luX2lkIjoiMyIsImNydW1ic19wYXJ0eV9yb2xlX2lkIjoiMyIsImVtYWlsIjoiU3RhbmRhcmQuVXNlckBmaXJzdG1hYy5jb20uYXUiLCJmYW1pbHlfbmFtZSI6IlVzZXIiLCJnaXZlbl9uYW1l
        // IjoiU3RhbmRhcmQiLCJodHRwOi8vc2NoZW1hcy5maXJzdG1hYy5jb20uYXUvd3MvMjAwOS8xMi9pZGVudGl0eS9jbGFpbXMvc2l0ZXR5cGVpZCI6IjQiLCJ0ZW5hbnQiOiJpbnRlcm5hbF9jcnVtYnMiLCJ2OF9wYXJ0
        // eV9yb2xlX2lkIjoiMyIsImFtciI6WyJDb29raWVzIl19.Ch_0rWwwJIAVWyvI7oVvLaeYHlVXMMpSLlzUFP2aDmderZLOoLWItcFXNHkWQDg9v7Cco2nWYWZtshwHVX3oEMMQqRbnoN5DHeNbDoPS7bjQ-pK5RsUIzPP
        // YXelqYOpvW69gUmc9YRPyL3fmfFkbOpOtps7QOiz7C0vOjXYWeOo';

        $http.defaults.headers.common.Authorization = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIn' + 'g1dCI6InptcUNwUlVzZlByNjFBUVdPaWlSUjFEaHdKdyIsImtpZCI6InptcUNwUlVzZlByNjFBUVdPaWlSUjFEa' + 'HdKdyJ9.eyJpc3MiOiJodHRwczovL2ZpcnN0bWFjIiwiYXVkIjoiaHR0cHM6Ly9maXJzdG1hYy9yZXNvdXJjZXM' + 'iLCJleHAiOjI0NzA5ODI4MDAsIm5iZiI6MTQ3MDk3NTYwMCwiY2xpZW50X2lkIjoiaW50ZXJuYWwiLCJzY29wZS' + 'I6WyJvcGVuaWQiLCJwcm9maWxlIiwicm9sZXMiLCJzaXRldHlwZSIsImNydW1ic2lkZW50aXR5Il0sInN1YiI6I' + 'jU4QTNGODYxODQ0NDQ4NkY4MDEzNTc0RjQiLCJhdXRoX3RpbWUiOjE0NzA5NzU2MDAsImlkcCI6IndpbmF1dGgi' + 'LCJuYW1lIjoiaTJCc0tOSHBwemtrOHMybHpIQmlOaXBITkJHIiwiYXBwbGljYXRpb25fbmFtZSI6IkNydW1icyI' + 'sImNvbW1vbl9uYW1lIjoiU3RhbmRhcmQgVXNlciIsImNydW1ic19sb2dpbl9pZCI6Ijk5ODc3IiwiY3J1bWJzX3' + 'BhcnR5X3JvbGVfaWQiOiIyIiwiZW1haWwiOiJTdGFuZGFyZC5Vc2VyQGZpcnN0bWFjLmNvbS5hdSIsImZhbWlse' + 'V9uYW1lIjoiVXNlciIsImdpdmVuX25hbWUiOiJTdGFuZGFyZCIsImh0dHA6Ly9zY2hlbWFzLmZpcnN0bWFjLmNv' + 'bS5hdS93cy8yMDA5LzEyL2lkZW50aXR5L2NsYWltcy9zaXRldHlwZWlkIjoiNCIsInRlbmFudCI6ImludGVybmF' + 'sX2NydW1icyIsInY4X3BhcnR5X3JvbGVfaWQiOiIzIiwiYW1yIjpbIkNvb2tpZXMiXX0.ERJd6V7O5QhsUkO-sv' + 'vlvHxgiiEHhlmaJrPXZ2UXCZyRqmw-NrahOXQ95JEO8H5tHvB2LK37Ex-oEu2OflprDN9u6TLoCd4Aaddpkahro' + '5FDpIjjAZLgD9JTIcozcgNZtzIH5cHXWyr7-JJoGM5PFRsqU57DzLDOM9ydkSvHJho';
    }
})();