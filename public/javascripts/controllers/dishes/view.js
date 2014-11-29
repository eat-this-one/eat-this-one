angular.module('eat-this-one')
    .controller('DishesViewController', ['$scope', '$modal', 'appStatus', 'urlParser', 'dishRequest', 'newMealRequest', 'eatConfig', 'authManager', function($scope, $modal, appStatus, urlParser, dishRequest, newMealRequest, eatConfig, authManager) {

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
            $scope.dish.remainingportions > 0 &&
            $scope.dish.booked === false);
    };

    var id = urlParser.getParam('id');

    // Load the dish info into the fields.
    appStatus.waiting();
    dishRequest($scope, id);

    $scope.addMeal = function() {

        var meal = {
            dishid: id
        };

        appStatus.waiting();
        newMealRequest($scope, meal);
    };

    $scope.editDish = function() {
        window.location.href = 'dishes/edit.html?id=' + id;
    };
}]);
