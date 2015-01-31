angular.module('eat-this-one')
    .controller('MealsController', ['$scope', 'authManager', 'redirecter', 'appStatus', 'notifier', 'mealsRequest', 'eatConfig', 'datesConverter', 'newLogRequest', 'menuManager', function($scope, authManager, redirecter, appStatus, notifier, mealsRequest, eatConfig, datesConverter, newLogRequest, menuManager) {

    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;
    $scope.redirectAction = redirecter.redirectAction;
    $scope.menu = menuManager;

    // Define header.
    $scope.pageTitle = $scope.lang.mymeals;
    $scope.menuIcons = [
        {
            name : $scope.lang.dishes,
            icon : 'glyphicon glyphicon-list',
            callback : 'index'
        }
    ];

    $scope.meals = [];

    $scope.showToggleMenu = false;
    if ($scope.auth.isAuthenticated()) {
        $scope.showToggleMenu = true;
    }

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
            redirecter.redirect('index.html');
        } else {
            appStatus.completed('mealsRequest');
            var msg = $scope.lang.errormealrequest + '. "' + errorStatus + '": ' + data;
            notifier.show($scope.lang.error, msg);
        }
    };
    mealsRequest($scope, mealsCallback, errorCallback);

    newLogRequest('view', 'meals-index');

    // Its only purpose is to store the log.
    $scope.mealClicked = function(dishid) {
        newLogRequest('click', 'meals-view', dishid);
    };

    // Redirects to index.
    $scope.index = function() {
        newLogRequest('click', 'index');
        redirecter.redirect('index.html');
    };

}]);
