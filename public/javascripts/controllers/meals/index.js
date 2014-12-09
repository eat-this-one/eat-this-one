angular.module('eat-this-one')
    .controller('MealsController', ['$scope', 'appStatus', 'mealsRequest', 'eatConfig', 'newLogRequest', function($scope, appStatus, mealsRequest, eatConfig, newLogRequest) {

    $scope.lang = $.eatLang.lang;

    // Page title.
    $scope.pageTitle = $scope.lang.mymeals;

    $scope.meals = [];
    $scope.showNoMeals = false;

    appStatus.waiting();
    mealsRequest($scope);

    newLogRequest('view', 'meals-index');

    // Its only purpose is to store the log.
    $scope.mealClicked = function(dishid) {
        newLogRequest('click', 'meals-view', dishid);
    };
}]);
