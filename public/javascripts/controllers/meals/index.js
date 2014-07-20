angular.module('eat-this-one')
    .controller('MealsController', ['$scope', 'appStatus', 'mealsRequest', 'eatConfig', function($scope, appStatus, mealsRequest, eatConfig) {

    $scope.pageTitle = 'My meals';
    $scope.lang = $.eatLang.lang;

    $scope.meals = [];

    appStatus.waiting();
    mealsRequest($scope);
}]);
