angular.module('eat-this-one').controller('IndexController', ['$scope', '$window', 'eatConfig', 'authManager', function($scope, $window, eatConfig, authManager) {

    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;

    // Page title.
    $scope.pageTitle = $scope.lang.sitename;

    $scope.loginButtonsLangStrings = {
        signin : $scope.lang.signin,
        signup : $scope.lang.signup
    };

    // Defines elements.
    $scope.where = {
        name: 'where',
        label: $scope.lang.where,
        placeholder: $scope.lang.where,
        value: ''
    };
    $scope.when = {
        name: 'when',
        label: $scope.lang.when,
        placeholder: $scope.lang.selectdatetime,
        value: new Date()
    };

    // Redirects to search dish page.
    $scope.searchDish = function() {
        $window.location.href = 'dishes/index.html' + $scope.getParams();
    };

    // Redirects to add dish page.
    $scope.addDish = function() {
        $window.location.href = 'dishes/edit.html' + $scope.getParams();
    };

    // Redirects to subscribe to a location.
    $scope.subscribeLocation = function() {
        $window.location.href = 'locations/index.html';
    };

    // Redirects to the user meals list.
    $scope.indexMeals = function() {
        $window.location.href = 'meals/index.html';
    };

    // Gets the URL params.
    $scope.getParams = function() {

        var params = '';
        if ($scope.where.value != "") {
            params = '?where=' + $scope.where.value;
        }
        if ($scope.when.value != "") {
            if (params != '') {
                params += '&when=' + $scope.when.value.getTime();
            } else {
                params = '?when=' + $scope.when.value.getTime();
            }
        }

        return params;
    };

}]);
