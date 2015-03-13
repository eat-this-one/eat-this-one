angular.module('eat-this-one')
    .controller('DishesViewController', ['$scope', 'redirecter', 'appStatus', 'notifier', 'urlParser', 'dishFormatter', 'dishRequest', 'newMealRequest', 'eatConfig', 'authManager', 'newLogRequest', 'menuManager', function($scope, redirecter, appStatus, notifier, urlParser, dishFormatter, dishRequest, newMealRequest, eatConfig, authManager, newLogRequest, menuManager) {

    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;
    $scope.redirectAction = redirecter.redirectAction;
    $scope.redirectMenuItem = redirecter.redirectMenuItem;
    $scope.menu = menuManager;

    // Define header.
    $scope.pageTitle = $scope.lang.dish;
    $scope.menuItems = [
        menuManager.dishesListItem(),
        menuManager.bookedMealsItem()
    ];

    $scope.showToggleMenu = false;
    if ($scope.auth.isAuthenticated()) {
        $scope.showToggleMenu = true;
    }

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
        appStatus.completed('dishRequest');

        // Fill the actions items.
        if ($scope.userCanBook()) {
            $scope.actionIcons = [
                {
                    name : $scope.lang.addmeal,
                    icon : 'glyphicon glyphicon-cutlery',
                    callback : 'addMeal'
                }
            ];
        } else if ($scope.auth.isUser($scope.dish.user._id)) {
            $scope.actionIcons = [
                {
                    name : $scope.lang.editdish,
                    icon : 'glyphicon glyphicon-pencil',
                    callback : 'editDish'
                }
            ];
        }
    };
    dishRequest($scope, dishCallback, id);

    newLogRequest('view', 'dishes-view', id);

    $scope.addMeal = function() {

        appStatus.waiting('newMeal');

        var mealCallback = function(data) {
            appStatus.completed('newMeal');
            notifier.show($scope.lang.mealbooked, $scope.lang.mealbookedinfo, function() {
                redirecter.redirect('index.html');
            });
        };
        var errorCallback = function(data, errorStatus, errorMsg) {
            appStatus.completed('newMeal');
            newLogRequest('error', 'meals-add', errorMsg);
            notifier.show($scope.lang.error, $scope.lang.weird);
        };
        newMealRequest($scope, {dishid: id}, mealCallback, errorCallback);

        newLogRequest('click', 'meals-add', id);
    };

    // Redirects to edit dish.
    $scope.editDish = function() {
        newLogRequest('click', 'dishes-edit', id);
        redirecter.redirect('dishes/edit.html?id=' + id);
    };
}]);
