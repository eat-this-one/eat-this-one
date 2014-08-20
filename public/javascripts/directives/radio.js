angular.module('eat-this-one').directive('eatRadio', function() {

    return {
        restrict: 'E',
        scope: {
            element: '='
        },
        templateUrl: 'templates/radio.html'
    }
});
