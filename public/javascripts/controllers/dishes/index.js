angular.module('eat-this-one')
    .controller('DishesController', ['$scope', 'appStatus', 'urlParser', 'dishesRequest', 'eatConfig', function($scope, appStatus, urlParser, dishesRequest, eatConfig) {

    $scope.lang = $.eatLang.lang;

    // Page titles.
    $scope.pageTitle = $scope.lang.dishes;

    $scope.dishes = [];
    $scope.showNoDishes = false;

    var dishesFilters = {};
    var possibleFilters = ['where', 'when', 'locationid'];
    for (var i = 0 ; i < possibleFilters.length ; i++) {
        var param = urlParser.getParam(possibleFilters[i]);
        if (param !== null) {
            dishesFilters[possibleFilters[i]] = param;
        }
    }

    appStatus.waiting();
    dishesRequest($scope, dishesFilters);
}]);
