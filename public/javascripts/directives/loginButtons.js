angular.module('eat-this-one').directive('eatLoginButtons', ['authManager', function(authManager) {
    return {
        restrict: 'E',
        scope: {
            lang: '='
        },
        templateUrl: 'templates/login-buttons.html'
    }

}]);
