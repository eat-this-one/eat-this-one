angular.module('eat-this-one').directive('eatField', function() {

    return {
        restrict: 'E',
        scope: {
            element: '=',
        },
        templateUrl: "/templates/field.html"
    };

});
