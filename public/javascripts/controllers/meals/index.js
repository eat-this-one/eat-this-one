angular.module('eat-this-one')
    .controller('MealsController', ['$scope', '$window', 'appStatus', 'notifier', 'mealsRequest', 'eatConfig', 'datesConverter', 'newLogRequest', function($scope, $window, appStatus, notifier, mealsRequest, eatConfig, datesConverter, newLogRequest) {

    $scope.lang = $.eatLang.lang;

    // Page title.
    $scope.pageTitle = $scope.lang.mymeals;

    $scope.meals = [];
    $scope.showNoMeals = false;

    appStatus.waiting('mealsRequest');

    var mealsCallback = function(dishesData) {
        $scope.meals = dishesData;

        if ($scope.meals.length === 0) {
            $scope.showNoMeals = true;
        } else {
            for (index in $scope.meals) {
                $scope.meals[index].when = datesConverter.timeToDay(Date.parse($scope.meals[index].when));
            }
        }

        appStatus.completed('mealsRequest');

    };
    var errorCallback = function(data, errorStatus, errorMsg) {

        // On unauthorized access we redirect to the index.
        if (errorStatus === 401) {
            newLogRequest('redirected', 'index', 'meals-index');
            $window.location.href = 'index.html';
        } else {
            appStatus.completed('mealsRequest');
            var msg = $scope.lang.errormealrequest + '. "' + errorStatus + '": ' + data;
            notifier.show($scope.lang.error, msg, 'error');
        }
    };
    mealsRequest($scope, mealsCallback, errorCallback);

    newLogRequest('view', 'meals-index');

    // Its only purpose is to store the log.
    $scope.mealClicked = function(dishid) {
        newLogRequest('click', 'meals-view', dishid);
    };
}]);
