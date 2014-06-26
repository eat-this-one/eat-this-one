angular.module('eat-this-one').directive('eatDatetime', function() {

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            element: '='
        },
        templateUrl: "templates/datetime.html"
    };

});
