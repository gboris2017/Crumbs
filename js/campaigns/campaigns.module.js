'use strict';

(function () {
    configure.$inject = ["$stateProvider"];
    angular.module('crumbs.campaigns', ['crumbs.core']).config(configure);

    /** @ngInject */
    function configure($stateProvider) {
        $stateProvider.state('campaigns', {
            url: '/campaigns',
            views: {
                '': {
                    templateUrl: 'campaigns/campaigns.controller.html',
                    controller: 'CampaignsController',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();