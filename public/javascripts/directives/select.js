angular.module('eat-this-one').directive('eatSelect', function() {
    return {
        restrict: 'E',
        scope: {
            element: '='
        },
        templateUrl: 'templates/select.html'
    };
});
