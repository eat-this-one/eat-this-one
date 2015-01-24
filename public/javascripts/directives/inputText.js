angular.module('eat-this-one').directive('eatInputText', ['formsManager', function(formsManager) {

    return {
        restrict: 'E',
        scope: {
            element: '=',
        },
        link: function(scope, element) {
            var input = angular.element(element.find('input'));

            // We want to test just this field so we hack around formsManager API.
            var fields = {};
            fields[scope.element.name] = scope.element;

            var validateForm = function() {
                formsManager.validate([scope.element.name], fields);
            };
            input.on('keyup', validateForm);
            input.on('click', validateForm);
        },
        templateUrl: "templates/input-text.html"
    };

}]);
