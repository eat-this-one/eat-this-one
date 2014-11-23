angular.module('eat-this-one')
    .controller('DishesController', ['$scope', 'appStatus', 'urlParser', 'dishesRequest', 'eatConfig', function($scope, appStatus, urlParser, dishesRequest, eatConfig) {

    $scope.lang = $.eatLang.lang;

    // Page titles.
    $scope.pageTitle = $scope.lang.dishes;

    $scope.dishes = [];
    $scope.showNoDishes = false;

    appStatus.waiting();
    dishesRequest($scope);
}]);
