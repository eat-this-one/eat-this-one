angular.module('eat-this-one')
    .controller('DishesViewController', ['$scope', '$modal', '$window', 'appStatus', 'notifier', 'urlParser', 'dishFormatter', 'dishRequest', 'newMealRequest', 'eatConfig', 'authManager', 'newLogRequest', function($scope, $modal, $window, appStatus, notifier, urlParser, dishFormatter, dishRequest, newMealRequest, eatConfig, authManager, newLogRequest) {

    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;

    // Page title.
    $scope.pageTitle = $scope.lang.dish;

    $scope.dish = {};

    // This string contains useful info for the user
    // The preference is:
    // # The user already booked the dish
    // # Last portion available | All portions booked
    $scope.dishusefulinfotext = '';

    $scope.openStaticMap = function() {
        var staticMapModal = $modal.open({
            templateUrl: 'templates/static-map.html',
            controller: 'staticMapController',
            resolve: {
                dish : function() {
                    return $scope.dish;
                }
            }
        });
    };

    // Returns whether the user can book this dish or not.
    $scope.userCanBook = function() {
        // - The chef can not book.
        // - If there are no more portions it can not be booked.
        // - If the user already book it can not be booked again.
        return (
            !$scope.auth.isUser($scope.dish.userid) &&
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
    };
    dishRequest($scope, dishCallback, id);

    newLogRequest('view', 'dishes-view', id);

    $scope.addMeal = function() {

        appStatus.waiting('newMeal');

        var mealCallback = function(data) {
            appStatus.completed('newMeal');
            notifier.show($scope.lang.mealbooked, $scope.lang.mealbookedinfo, 'success');
            $window.location.href = 'index.html';
        };
        var errorCallback = function(data, errorStatus, errorMsg) {
            appStatus.completed('newMeal');
            var msg = $scope.lang.errornewmeal + '. "' + errorStatus + '": ' + data;
            notifier.show($scope.lang.error, msg, 'error');
        }
        newMealRequest($scope, {dishid: id}, mealCallback, errorCallback);

        newLogRequest('click', 'meals-add', id);
    };

    $scope.editDish = function() {
        newLogRequest('click', 'dishes-edit', id);
        $window.location.href = 'dishes/edit.html?id=' + id;
    };
}]);
