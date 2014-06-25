angular.module('eat-this-one').directive('eatField', function() {

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            element: '=',
        },
        templateUrl: "templates/field.html"
    };

});
