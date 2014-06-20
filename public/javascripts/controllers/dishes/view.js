angular.module('eat-it')
    .controller('dishesViewController', ['$scope', function($scope) {

    var id = $.urlParser.getParam('id');

    $scope.pageTitle = 'Dish';

    $scope.lang = {};
    $scope.lang.user = 'Your name';
    $scope.lang.portions = 'Number of portions you want';
    $scope.lang.addmeal = 'Add meal';

    // We fill it later.
    $scope.meal = {};

    // Load the dish info into the fields.
    $.appStatus.waiting();
    $.dishRequest($scope, id);

    // TODO Get the dish meals to count the remaining portions.

    $scope.addMeal = function() {
        // TODO Probably some meal cleaning will be required.
        $scope.meal.dish = $scope.dish;
        $.appStatus.waiting();
        $.newMealRequest($scope, meal);
    };
}]);
