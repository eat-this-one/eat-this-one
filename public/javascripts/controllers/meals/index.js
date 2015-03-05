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
            icon : 'glyphicon glyphicon-piggy-bank',
            callback : 'index'
        }, {
            name : $scope.lang.feedback,
            icon : 'glyphicon glyphicon-send',
            callback : 'feedback'
        }
    ];

    $scope.meals = [];

    $scope.showToggleMenu = false;
    if ($scope.auth.isAuthenticated()) {
        $scope.showToggleMenu = true;
    }

    $scope.showNoMeals = false;

    appStatus.waiting('mealsRequest');

    var mealsCallback = function(meals) {

        if (meals.length === 0) {
            $scope.showNoMeals = true;
        } else {
            meals.forEach(function(meal) {
                // Converting the dish date to a friendly format.
                meal.dish.when = datesConverter.timeToDay(Date.parse(meal.dish.when));
                $scope.meals.push(meal.dish);
            });
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
            newLogRequest('error', 'meals-index', errorMsg);
            notifier.show($scope.lang.error, $scope.lang.weird);
        }
    };
    mealsRequest($scope, mealsCallback, errorCallback);

    newLogRequest('view', 'meals-index');

    // Its only purpose is to store the log.
    $scope.mealClicked = function(dishid) {
        newLogRequest('click', 'meals-view', dishid);
    };

    // Redirects to the selected meal.
    $scope.redirectToMeal = function(dishid) {
        newLogRequest('click', 'meals-view', dishid);
        redirecter.redirect('meals/view.html?id=' + dishid);
    };

    // Redirects to index.
    $scope.index = function() {
        newLogRequest('click', 'index');
        redirecter.redirect('index.html');
    };

    // Redirects to the feedback screen.
    $scope.feedback = function() {
        newLogRequest('click', 'feedback-add');
        redirecter.redirect('feedback/add.html');
    };

}]);
