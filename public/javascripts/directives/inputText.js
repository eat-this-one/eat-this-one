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

            // To validate the form.
            var validateForm = function(e) {
                formsManager.validate([scope.element.name], fields);
            };
            input.on('keyup', validateForm);
            input.on('change', validateForm);

            // iOS virtual keyboard bug. http://getbootstrap.com/getting-started/#virtual-keyboards
            input.on('focus', function(e) {
                angular.element('.navbar-fixed-top').css('position', 'absolute');
            });
            input.on('blur', function(e) {
                angular.element('.navbar-fixed-top').css('position', 'fixed');
            });
        },
        templateUrl: "templates/input-text.html"
    };

}]);
