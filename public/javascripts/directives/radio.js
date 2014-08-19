angular.module('eat-this-one').directive('eatRadio', function() {

    return {
        restrict: 'E',
        scope: {
            element: '='
        },
        link: function(scope) {
            $('#id-' + scope.element.name).val(scope.element.value);
        },
        templateUrl: 'templates/radio.html'
    }
});
