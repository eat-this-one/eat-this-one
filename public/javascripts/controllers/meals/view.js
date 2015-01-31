angular.module('eat-this-one')
    .controller('MealsViewController', ['$scope', 'appStatus', 'urlParser', 'dishFormatter', 'dishRequest', 'eatConfig', 'authManager', 'redirecter', '$modal', 'newLogRequest', 'menuManager', function($scope, appStatus, urlParser, dishFormatter, dishRequest, eatConfig, authManager, redirecter, $modal, newLogRequest, menuManager) {

    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;
    $scope.redirectAction = redirecter.redirectAction;
    $scope.menu = menuManager;

    // Define header.
    $scope.pageTitle = $scope.lang.dish;
    $scope.menuIcons = [
        {
            name : $scope.lang.dishes,
            icon : 'glyphicon glyphicon-list',
            callback : 'index'
        }, {
            name : $scope.lang.mealsibooked,
            icon : 'glyphicon glyphicon-list',
            callback : 'indexMeals'
        }
    ];

    $scope.showToggleMenu = false;
    if ($scope.auth.isAuthenticated()) {
        $scope.showToggleMenu = true;
    }

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

    // Redirects to the user meals list.
    $scope.indexMeals = function() {
        newLogRequest('click', 'meals-index');
        redirecter.redirect('meals/index.html');
    };

    // Redirects to index.
    $scope.index = function() {
        newLogRequest('click', 'index');
        redirecter.redirect('index.html');
    };

}]);
