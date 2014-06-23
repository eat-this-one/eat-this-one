angular.module('eat-this-one')
    .controller('dishesViewController', ['$scope', 'appStatus', 'urlParser', 'dishRequest', 'newMealRequest', function($scope, appStatus, urlParser, dishRequest, newMealRequest) {

    $scope.pageTitle = 'Dish';
    $scope.lang = $.eatLang[$.eatConfig.lang];

    $scope.meal = {};
    $scope.dish = {};

    var id = urlParser.getParam('id');

    // Load the dish info into the fields.
    appStatus.waiting();
    dishRequest($scope, id);

    // TODO Get the dish meals to count the remaining portions.

    $scope.addMeal = function() {
        // TODO Probably some meal cleaning will be required.
        $scope.meal.dish = $scope.dish;
        appStatus.waiting();
        newMealRequest($scope, meal);
    };
}]);
