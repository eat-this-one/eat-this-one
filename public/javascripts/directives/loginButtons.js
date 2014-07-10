angular.module('eat-this-one').directive('eatLoginButtons', ['authManager', function(authManager) {
    return {
        restrict: 'E',
        templateUrl: 'templates/login-buttons.html'
    }
}]);
