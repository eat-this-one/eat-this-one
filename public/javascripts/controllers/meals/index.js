angular.module('eat-this-one')
    .controller('MealsController', ['$scope', 'appStatus', 'mealsRequest', 'eatConfig', function($scope, appStatus, mealsRequest, eatConfig) {

    $scope.lang = $.eatLang.lang;

    // Page title.
    $scope.pageTitle = $scope.lang.mymeals;

    $scope.meals = [];
    $scope.showNoMeals = false;

    appStatus.waiting();
    mealsRequest($scope);
}]);
