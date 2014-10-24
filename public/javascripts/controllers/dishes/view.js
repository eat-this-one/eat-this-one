angular.module('eat-this-one')
    .controller('DishesViewController', ['$scope', 'appStatus', 'urlParser', 'dishRequest', 'newMealRequest', 'eatConfig', 'authManager', '$modal', function($scope, appStatus, urlParser, dishRequest, newMealRequest, eatConfig, authManager, $modal) {

    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;

    // Page title.
    $scope.pageTitle = $scope.lang.dish;

    $scope.loginButtonsLangStrings = {
        signin : $scope.lang.signintoorder,
        signup : $scope.lang.signuptoorder
    };

    $scope.dish = {};

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

    var id = urlParser.getParam('id');

    // Load the dish info into the fields.
    appStatus.waiting();
    dishRequest($scope, id);

    $scope.addMeal = function() {

        var meal = {
            dishid: id
        };

        appStatus.restartLoader();
        appStatus.waiting();
        newMealRequest($scope, meal);
    };
}]);
