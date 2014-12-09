angular.module('eat-this-one')
    .controller('DishesController', ['$scope', 'appStatus', 'urlParser', 'dishesRequest', 'eatConfig', 'newLogRequest', function($scope, appStatus, urlParser, dishesRequest, eatConfig, newLogRequest) {

    $scope.lang = $.eatLang.lang;

    // Page titles.
    $scope.pageTitle = $scope.lang.dishes;

    $scope.dishes = [];
    $scope.showNoDishes = false;

    appStatus.waiting();
    dishesRequest($scope);

    newLogRequest('view', 'dishes-index');
}]);
