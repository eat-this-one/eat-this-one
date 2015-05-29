angular.module('eat-this-one')
    .controller('DishesViewController', ['$scope', 'redirecter', 'appStatus', 'notifier', 'urlParser', 'dishFormatter', 'dishRequest', 'newMealRequest', 'mealsRequest', 'eatConfig', 'authManager', 'newLogRequest', 'menuManager', 'storage', function($scope, redirecter, appStatus, notifier, urlParser, dishFormatter, dishRequest, newMealRequest, mealsRequest, eatConfig, authManager, newLogRequest, menuManager, storage) {

    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;
    $scope.redirectAction = redirecter.redirectAction;
    $scope.redirectMenuItem = redirecter.redirectMenuItem;
    $scope.menu = menuManager;

    // Define header.
    $scope.pageTitle = $scope.lang.dish;
    $scope.menuItems = menuManager.getDefaultItems();

    $scope.showTip = false;
    $scope.showToggleMenu = false;
    if ($scope.auth.isAuthenticated()) {
        $scope.showToggleMenu = true;
    }

    // Only the chef will see it and if there are bookings.
    $scope.showBookedMeals = false;

    $scope.dish = {};

    // This string contains useful info for the user
    // The preference is:
    // # The user already booked the dish
    // # Last portion available | All portions booked
    $scope.dishusefulinfotext = '';

    // Returns whether the user can book this dish or not.
    $scope.userCanBook = function() {
        // - The chef can not book.
        // - If there are no more portions it can not be booked.
        // - If the user already book it can not be booked again.
        return (
            !$scope.auth.isUser($scope.dish.user._id) &&
            ($scope.dish.remainingportions > 0 || $scope.dish.remainingportions === -1) &&
            $scope.dish.booked === false
        );
    };

    var id = urlParser.getParam('id');

    // Load the dish info into the fields.
    appStatus.waiting('dishRequest');
    var dishCallback = function(dishData) {
        dishFormatter($scope, dishData);

        // Fill the actions items.
        if ($scope.userCanBook()) {
            $scope.actionIcons = [
                {
                    name : $scope.lang.addmeal,
                    icon : 'glyphicon glyphicon-cutlery',
                    callback : 'addMeal'
                }
            ];
            appStatus.completed('dishRequest');

            // After loading the dish, if it is the first time that the user tries
            // to book a dish we display the tooltip/s.
            notifier.showTooltip($scope, 'tipBook', $scope.lang.tipbook);

        } else if ($scope.auth.isUser($scope.dish.user._id)) {
            $scope.actionIcons = [
                {
                    name : $scope.lang.editdish,
                    icon : 'glyphicon glyphicon-pencil',
                    callback : 'editDish'
                }
            ];

            if ($scope.dish.nbookedmeals > 0) {
                // Here we delay the status completed until the meals request finishes.
                mealsRequest($scope, $scope.dish._id, mealsCallback);
            } else {
                appStatus.completed('dishRequest');

                // After loading the dish, if it is the first time that the user tries
                // to book a dish we display the tooltip/s.
                notifier.showTooltip($scope, 'tipEditDish', $scope.lang.tipeditdish);
            }
        } else {
            appStatus.completed('dishRequest');
        }
    };
    // This will be called if the user is the chef.
    var mealsCallback = function mealsCallback(mealsData) {
        if (mealsData.length > 0) {
            $scope.meals = mealsData;
        }
        $scope.showBookedMeals = true;
        appStatus.completed('dishRequest');
    };
    dishRequest($scope, dishCallback, id);

    newLogRequest('view', 'dishes-view', id);

    $scope.addMeal = function() {

        notifier.showConfirm($scope.lang.confirmbook, function() {

            appStatus.waiting('newMeal');

            var mealCallback = function(data) {

                // Add the dish to the cached list of my booked meals.
                storage.add('mybookedmeals', data.dish);
                newLogRequest('redirected', 'dishes-view', 'index');
                redirecter.redirect('index.html');
            };
            var errorCallback = function(data, errorStatus, errorMsg) {
                appStatus.completed('newMeal');
                newLogRequest('error', 'meals-add', errorMsg);
                notifier.show($scope.lang.error, $scope.lang.weird);
            };
            newMealRequest($scope, {dishid: id}, $scope.dish.name, mealCallback, errorCallback);

            newLogRequest('click', 'meals-add', id);
        });
    };

    // Redirects to edit dish.
    $scope.editDish = function() {
        newLogRequest('click', 'dishes-edit', id);
        redirecter.redirect('dishes/edit.html?id=' + id);
    };
}]);
