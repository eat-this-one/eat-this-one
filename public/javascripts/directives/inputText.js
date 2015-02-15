angular.module('eat-this-one').directive('eatInputText', ['$mdToast', 'formsManager', function($mdToast, formsManager) {

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

            // To validate the form.
            var validateForm = function() {
                formsManager.validate([scope.element.name], fields);
            };
            input.on('keyup', validateForm);
            input.on('change', validateForm);

            // Only if a placeholder is set.
            if (typeof scope.element.placeholder != 'undefined' &&
                    scope.element.placeholder != null) {

                // To show a toast notification (replacement of the normal placeholder behaviour).
                var showToast = function() {

                    // Only when the field has not value.
                    if (scope.element.value == '') {
                        $mdToast.show(
                            $mdToast.simple()
                                .content(scope.element.placeholder)
                                .position('right top')
                                .hideDelay(1000)
                        );
                    }
                };
                input.on('focus', showToast);
            }

        },
        templateUrl: "templates/input-text.html"
    };

}]);
