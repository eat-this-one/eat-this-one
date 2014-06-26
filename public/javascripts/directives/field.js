angular.module('eat-this-one').directive('eatField', ['$rootScope', function($rootScope) {

    return {
        restrict: 'E',
        scope: {
            element: '=',
        },
        templateUrl: "templates/field.html"
    };

}]);
