angular.module('eat-this-one').controller('IndexController',
    ['$scope', 'redirecter', 'eatConfig', 'authManager', 'appStatus', 'notifier', 'datesConverter', 'formsManager', 'dishesRequest', 'editRegIdUserRequest', 'editApnTokenUserRequest', 'newLogRequest', 'menuManager', 'storage', 'imgManager',
    function($scope, redirecter, eatConfig, authManager, appStatus, notifier, datesConverter, formsManager, dishesRequest, editRegIdUserRequest, editApnTokenUserRequest, newLogRequest, menuManager, storage, imgManager) {

    // Dependencies.
    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;
    $scope.redirectAction = redirecter.redirectAction;
    $scope.redirectMenuItem = redirecter.redirectMenuItem;
    $scope.menu = menuManager;

    // Define header.
    $scope.pageTitle = $scope.lang.sitename;
    $scope.menuItems = menuManager.getDefaultItems();

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
                for (var index in $scope.dishes) {
                    $scope.dishes[index].when = datesConverter.timeToDay(Date.parse($scope.dishes[index].when));

                    imgManager.fillDishSrc($scope.dishes[index]);

                    // Let's add state to each dish (my dish, booked...).
                    if (storage.isIn('mydishes', $scope.dishes[index]._id)) {
                        $scope.dishes[index].icon = 'glyphicon glyphicon-cutlery';
                    } else if (storage.isIn('mybookedmeals', $scope.dishes[index]._id)) {
                        $scope.dishes[index].icon = 'glyphicon glyphicon-pushpin';
                    }
                }
            }
        };
        var errorCallback = function(data, errorStatus, errorMsg) {
            // On unauthorized access we redirect to the index.
            appStatus.completed('dishesRequest');
            newLogRequest('error', 'dish-index', errorMsg);
            notifier.show($scope.lang.error, $scope.lang.weird);
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

    // Redirects to the selected dish.
    $scope.redirectToDish = function(dishid) {
        newLogRequest('click', 'dishes-view', dishid);
        redirecter.redirect('dishes/view.html?id=' + dishid);
    };

    // Redirects to add dish page.
    $scope.addDish = function() {
        newLogRequest('click', 'dishes-add');
        redirecter.redirect('dishes/edit.html');
    };

    // Creates a user account.
    $scope.signup = function() {
        newLogRequest('click', 'signup');

        if (!formsManager.validate(['name', 'email'], $scope)) {
            notifier.show($scope.lang.missingfields, $scope.lang.missingfieldsinfo);
            return;
        }

        appStatus.waiting('signup');

        // Even though the requests to GCM or APN are supposed
        // to be already finished because the user spends some
        // time filling the form, we need to be completely sure.
        var time = 0;
        var checkPushIdReady = setInterval(function() {
            // Running every 0.2 seconds.
            if (localStorage.getItem('gcmRegId') !== null) {
                editRegIdUserRequest(
                    $scope,
                    'location-subscriptions/edit.html',
                    'created',
                    'create-account'
                );
                return stopInterval();
            }
            if (localStorage.getItem('apnToken') !== null) {
                editApnTokenUserRequest(
                    $scope,
                    'location-subscriptions/edit.html',
                    'created',
                    'create-account'
                );
                return stopInterval();
            }
            if (time > 4000) {
                // Timeout at 4 seconds and notify that
                // something went wrong and try again in a while.
                notifier.show($scope.lang.error, $scope.lang.weird);
                return stopInterval();
            }
            time = time + 200;
        }.bind(this), 200);
        var stopInterval = function stopInterval() {
            clearInterval(checkPushIdReady);
            return true;
        };
    };
}]);
