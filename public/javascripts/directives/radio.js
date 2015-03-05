angular.module('eat-this-one').directive('eatRadio', ['$timeout', function($timeout) {

    return {
        restrict: 'E',
        scope: {
            element: '='
        },
        link : function(scope, element, attrs) {

            // Set the styles for the preset value.
            $timeout(function() {
                var defaultOptionId = 'id-option-' + scope.element.name + '-' + scope.element.value;
                angular.element('#' + defaultOptionId).addClass('md-accent');
                angular.element('#' + defaultOptionId).addClass('md-raised');
            });

            scope.setValue = function(value) {

                // Set the value.
                scope.element.value = value;

                // Set style.
                for (var i = 0; i < scope.element.options.length; i++) {
                    angular.element('#id-option-' + scope.element.name + '-' + scope.element.options[i].value).removeClass('md-accent');
                    angular.element('#id-option-' + scope.element.name + '-' + scope.element.options[i].value).removeClass('md-raised');
                }
                angular.element('#id-option-' + scope.element.name + '-' + value).addClass('md-accent');
                angular.element('#id-option-' + scope.element.name + '-' + value).addClass('md-raised');
            };
        },
        templateUrl: 'templates/radio.html'
    };
}]);
