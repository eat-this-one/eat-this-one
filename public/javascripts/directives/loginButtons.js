angular.module('eat-this-one').directive('eatLoginButtons', ['eatAuth', function(eatAuth) {
    return {
        restrict: 'E',
        templateUrl: 'templates/login-buttons.html'
    }
}]);
