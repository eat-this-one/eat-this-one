angular.module('eat-this-one')
    .controller('MealsViewController', ['$scope', 'appStatus', 'urlParser', 'dishFormatter', 'dishRequest', 'eatConfig', 'authManager', 'redirecter', 'newLogRequest', 'menuManager', function($scope, appStatus, urlParser, dishFormatter, dishRequest, eatConfig, authManager, redirecter, newLogRequest, menuManager) {

    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;
    $scope.redirectAction = redirecter.redirectAction;
    $scope.redirectMenuItem = redirecter.redirectMenuItem;
    $scope.menu = menuManager;

    // Define header.
    $scope.pageTitle = $scope.lang.dish;
    $scope.menuItems = [
        menuManager.dishesListItem(),
        menuManager.locationViewItem(),
        menuManager.bookedMealsItem()
    ];

    $scope.showToggleMenu = false;
    if ($scope.auth.isAuthenticated()) {
        $scope.showToggleMenu = true;
    }

    $scope.dish = {};

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
