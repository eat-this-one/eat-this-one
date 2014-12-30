angular.module('eat-this-one')
    .controller('MealsViewController', ['$scope', 'appStatus', 'urlParser', 'dishFormatter', 'dishRequest', 'eatConfig', 'authManager', '$modal', 'newLogRequest', function($scope, appStatus, urlParser, dishFormatter, dishRequest, eatConfig, authManager, $modal, newLogRequest) {

    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;

    // Page title.
    $scope.pageTitle = $scope.lang.dish;

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
    appStatus.waiting('dishRequest');
    var dishCallback = function(dishData) {
        dishFormatter($scope, dishData);
        appStatus.completed('dishRequest');
    };
    dishRequest($scope, dishCallback, id);

    newLogRequest('view', 'meals-view', id);
}]);
