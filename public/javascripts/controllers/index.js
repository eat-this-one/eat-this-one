angular.module('eat-this-one').controller('IndexController', ['$scope', 'redirecter', 'eatConfig', 'authManager', 'appStatus', 'notifier', 'datesConverter', 'formsManager', 'dishesRequest', 'newRegIdUserRequest', 'newLogRequest', 'menuManager', function($scope, redirecter, eatConfig, authManager, appStatus, notifier, datesConverter, formsManager, dishesRequest, newRegIdUserRequest, newLogRequest, menuManager) {

    // Dependencies.
    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;
    $scope.redirectAction = redirecter.redirectAction;
    $scope.menu = menuManager;

    // Define header.
    $scope.pageTitle = $scope.lang.sitename;
    $scope.actionIcons = [
        {
            name : $scope.lang.adddish,
            icon : 'glyphicon glyphicon-plus',
            callback : 'addDish'
        }
    ];
    $scope.menuIcons = [
        {
            name : $scope.lang.bookedmeals,
            icon : 'glyphicon glyphicon-list',
            callback : 'indexMeals'
        }
    ];

    $scope.dishes = [];
    $scope.showNoDishes = false;

    $scope.showToggleMenu = false;
    if ($scope.auth.isAuthenticated()) {
        // Getting the list of dishes.
        appStatus.waiting('dishesRequest');

        $scope.showToggleMenu = true;

        // Success callback.
        var dishesCallback = function(dishesData) {

            $scope.dishes = dishesData;
            appStatus.completed('dishesRequest');

            if ($scope.dishes.length === 0) {
                $scope.showNoDishes = true;
            } else {
                for (index in $scope.dishes) {
                    $scope.dishes[index].when = datesConverter.timeToDay(Date.parse($scope.dishes[index].when));
                }
            }
        };
        var errorCallback = function(data, errorStatus, errorMsg) {
            // On unauthorized access we redirect to the index.
            appStatus.completed('dishesRequest');
            var msg = $scope.lang.errordishesrequest + '. "' + errorStatus + '": ' + data;
            notifier.show($scope.lang.error, msg);
        };
        dishesRequest($scope, dishesCallback, errorCallback);

    } else {

        $scope.name = {
            name: 'name',
            label: $scope.lang.username,
            placeholder: $scope.lang.usernameexample,
            validation: ['required', 'text'],
            value: ''
        };
        $scope.email = {
            name: 'email',
            label: $scope.lang.email,
            placeholder: $scope.lang.emailexample,
            validation: ['required', 'email'],
            value: ''
        };
    }

    newLogRequest('view', 'index');

    // Its only purpose is to store the log.
    $scope.dishClicked = function(dishid) {
        newLogRequest('click', 'dishes-view', dishid);
    };

    // Redirects to add dish page.
    $scope.addDish = function() {
        newLogRequest('click', 'dishes-add');
        redirecter.redirect('dishes/edit.html');
    };

    // Redirects to the user meals list.
    $scope.indexMeals = function() {
        newLogRequest('click', 'meals-index');
        redirecter.redirect('meals/index.html');
    };

    // Creates a user account.
    $scope.signup = function() {
        newLogRequest('click', 'signup');

        if (!formsManager.validate(['name', 'email'], $scope)) {
            return;
        }

        appStatus.waiting('signup');
        newRegIdUserRequest($scope);
    }
}]);
