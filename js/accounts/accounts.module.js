'use strict';

(function () {
  configure.$inject = ["$stateProvider"];
  angular.module('crumbs.accounts', ['crumbs.core']).config(configure);

  /** @ngInject */
  function configure($stateProvider) {
    $stateProvider.state('accounts', {
      abstract: true,
      url: '/accounts',
      template: '<div class="height100" ui-view></div>'
    }).state('accounts.list', {
      url: '/',
      templateUrl: 'accounts/accounts.view.html',
      controller: 'AccountsListController',
      controllerAs: 'vm',
      title: ' - Accounts',
      resolve: {
        accounts: ["AccountsService", function accounts(AccountsService) {
          return AccountsService.getAccounts();
        }]
      }
    });
  }
})();