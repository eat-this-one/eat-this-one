angular.module('eat-this-one').controller('IndexController', ['$scope', '$window', 'eatConfig', 'authManager', 'appStatus', 'dishesRequest', function($scope, $window, eatConfig, authManager, appStatus, dishesRequest) {

    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;

    // Page title.
    $scope.pageTitle = $scope.lang.sitename;

    $scope.loginButtonsLangStrings = {
        signin : $scope.lang.signin,
        signup : $scope.lang.signup
    };

    $scope.dishes = [];
    $scope.showNoDishes = false;

    if ($scope.auth.isAuthenticated()) {
        appStatus.waiting();
        dishesRequest($scope);
    }

    // Redirects to search dish page.
    $scope.searchDish = function() {
        $window.location.href = 'dishes/index.html';
    };

    // Redirects to add dish page.
    $scope.addDish = function() {
        $window.location.href = 'dishes/edit.html';
    };

    // Redirects to the user meals list.
    $scope.indexMeals = function() {
        $window.location.href = 'meals/index.html';
    };

}]);
