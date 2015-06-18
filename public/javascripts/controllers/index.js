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
    $scope.pageTitle = $scope.lang.dishes;
    $scope.menuItems = menuManager.getDefaultItems();

    $scope.dishes = [];
    $scope.showNoDishes = false;
    $scope.showTip = false;

    // To determine what to show to the user.
    if ($scope.auth.isAuthenticated()) {
        $scope.display = 'dishes';
    } else if (localStorage.getItem('splashpassed') === null) {
        $scope.display = 'splash';
        $scope.pageTitle = $scope.lang.sitename;
        $('#id-body').addClass('splash-background');
    } else {
        $scope.display = 'login';
        $scope.pageTitle = $scope.lang.welcome;
    }

    $scope.showToggleMenu = false;
    if ($scope.auth.isAuthenticated()) {
        // Getting the list of dishes.
        appStatus.waiting('dishesRequest');

        $scope.showToggleMenu = true;

        // Success callback.
        var dishesCallback = function(dishesData) {

            $scope.dishes = dishesData;
            appStatus.completed('dishesRequest');

            // After loading the index the first time we display the tooltip/s.
            notifier.showTooltip($scope, 'tipIndex', $scope.lang.tipadddish);

            if ($scope.dishes.length === 0) {
                $scope.showNoDishes = true;
            } else {
                for (var index in $scope.dishes) {
                    $scope.dishes[index].when = datesConverter.timeToDayString(Date.parse($scope.dishes[index].when));

                    if ($scope.dishes[index].name.length > 25) {
                        $scope.dishes[index].name = $scope.dishes[index].name.substr(0, 25) + '...';
                    }
                    imgManager.fillDishSrc($scope.dishes[index]);

                    // Let's add state to each dish (my dish, booked...).
                    if (storage.isIn('mydishes', $scope.dishes[index]._id)) {
                        $scope.dishes[index].status = $scope.lang.icook;
                    } else if (storage.isIn('mybookedmeals', $scope.dishes[index]._id)) {
                        $scope.dishes[index].status = $scope.lang.ibooked;
                    } else {
                        $scope.dishes[index].status = '';
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
            validation: ['required', 'text'],
            value: ''
        };
        $scope.email = {
            name: 'email',
            label: $scope.lang.email,
            validation: ['required', 'email'],
            value: ''
        };
    }

    newLogRequest('view', 'index');

    // To start up the app.
    $scope.toLogin = function() {
        localStorage.setItem('splashpassed', true);
        newLogRequest('click', 'splash-continue');
        redirecter.redirect('index.html');
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
                    'group-members/edit.html',
                    'created',
                    'create-account'
                );
                return stopInterval();
            }
            if (localStorage.getItem('apnToken') !== null) {
                editApnTokenUserRequest(
                    $scope,
                    'group-members/edit.html',
                    'created',
                    'create-account'
                );
                return stopInterval();
            }
            if (time > 4000) {
                // Some reports of pushplugin callback not being executed
                // when user selects to not allow push notifications:
                // https://github.com/phonegap-build/PushPlugin/issues/433
                // https://github.com/phonegap-build/PushPlugin/issues/162
                //
                // The app, without push notifications is not that useful but
                // it should still work so we generate a random identifier.
                //
                // Later, when the user enables it we will update this value.
                var randomNumber = Math.random() + new Date().getTime();
                localStorage.setItem('usingFakeApnToken', true);
                localStorage.setItem('apnToken', randomNumber);
                editApnTokenUserRequest(
                    $scope,
                    'group-members/edit.html',
                    'created',
                    'create-account'
                );
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
