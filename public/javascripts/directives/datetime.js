angular.module('eat-this-one').directive('eatDatetime', function() {

    return {
        restrict: 'E',
        scope: {
            element: '=',
        },
        link : function(scope) {

            // date/time pickers hidden by default.
            scope.showDatepicker = false;
            scope.showTimepicker = false;

            // Toggles the datepicker.
            scope.toggleDatepicker = function($event) {
                scope.showTimepicker = false;
                scope.showDatepicker = scope.showDatepicker == false ? true : false;
            };

            // Toggles the timepicker
            scope.toggleTimepicker = function($event) {
                scope.showDatepicker = false;
                scope.showTimepicker = scope.showTimepicker == false ? true : false;
            };
        },
        templateUrl: "/templates/datetime.html"
    };

});
