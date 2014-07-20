angular.module('eat-this-one')
    .controller('DishesController', ['$scope', 'appStatus', 'urlParser', 'dishesRequest', 'eatConfig', function($scope, appStatus, urlParser, dishesRequest, eatConfig) {

    $scope.pageTitle = 'Dishes';
    $scope.lang = $.eatLang.lang;

    $scope.dishes = [];

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
