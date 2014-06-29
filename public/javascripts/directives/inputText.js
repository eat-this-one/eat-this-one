angular.module('eat-this-one').directive('eatInputText', function() {

    return {
        restrict: 'E',
        scope: {
            element: '=',
        },
        templateUrl: "templates/input-text.html"
    };

});
