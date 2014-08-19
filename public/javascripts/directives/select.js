angular.module('eat-this-one').directive('eatSelect', function() {

    return {
        restrict: 'E',
        scope: {
            element: '='
        },
        link: function(scope) {

            if (scope.element.value) {
                $('#id-' + scope.element.name).val(scope.element.value);
            }
        },
        templateUrl: "templates/select.html"
    };

});
