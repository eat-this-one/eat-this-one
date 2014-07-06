angular.module('eat-this-one')
    .controller('DishesViewController', ['$scope', 'appStatus', 'urlParser', 'dishRequest', 'newMealRequest', 'eatConfig', function($scope, appStatus, urlParser, dishRequest, newMealRequest, eatConfig) {

    $scope.pageTitle = 'Dish';
    $scope.lang = $.eatLang[eatConfig.lang];

    $scope.meal = {};
    $scope.dish = {};

    // Form fields.
    $scope.user = {
        name: 'user',
        label: $scope.lang.username,
        placeholder: $scope.lang.username,
        value: ''
    };

    var id = urlParser.getParam('id');

    // Load the dish info into the fields.
    appStatus.waiting();
    dishRequest($scope, id);

    $scope.addMeal = function() {

        var meal = {
            user: $scope.user.value,
            dish: id
        };
        appStatus.waiting();
        newMealRequest($scope, meal);
    };
}]);
