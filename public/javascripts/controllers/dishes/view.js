angular.module('eat-this-one')
    .controller('DishesViewController', ['$scope', 'appStatus', 'urlParser', 'dishRequest', 'newMealRequest', 'eatConfig', 'eatAuth', '$modal', function($scope, appStatus, urlParser, dishRequest, newMealRequest, eatConfig, eatAuth, $modal) {

    $scope.pageTitle = 'Dish';
    $scope.lang = $.eatLang.lang;
    $scope.auth = eatAuth;

    $scope.meal = {};
    $scope.dish = {};

    $scope.openStaticMap = function() {
        var modalInstance = $modal.open({
            templateUrl: 'templates/static-map.html',
            controller: 'staticMapController',
            resolve: {
                dish : function() {
                    return $scope.dish;
                }
            }
        });
    };

    $scope.openStaticMap = function() {
        var modalInstance = $modal.open({
            templateUrl: 'templates/static-map.html',
            controller: 'staticMapController',
            resolve: {
                dish : function() {
                    return $scope.dish;
                }
            }
        });
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
}]);
