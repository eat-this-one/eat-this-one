angular.module('eat-this-one').directive('eatDatetime', ['eatConfig', function(eatConfig) {

    return {
        restrict: 'E',
        scope: {
            element: '='
        },
        link : function(scope) {

            // Import lang strings.
            scope.lang = $.eatLang[eatConfig.lang];

            scope.today = new Date();

            // date/time pickers hidden by default.
            scope.showDatepicker = false;
            scope.showTimepicker = false;

            // Toggles the datepicker.
            scope.toggleDatepicker = function($event) {
                scope.showTimepicker = false;
                scope.showDatepicker = scope.showDatepicker == false ? true : false;
            };

            // Toggles the timepicker.
            scope.toggleTimepicker = function($event) {
                scope.showDatepicker = false;
                scope.showTimepicker = scope.showTimepicker == false ? true : false;
            };

            // Sets today as date keeping the current time value.
            scope.setToday = function($event) {
                scope.element.value = scope._getCurrentTimeToday();
            };

            // Sets tomorrow as date keeping the current time value.
            scope.setTomorrow = function($event) {
                scope.element.value = new Date(scope._getCurrentTimeToday().getTime() + 24 * 60 * 60 * 1000);
            };

            scope._getCurrentTimeToday = function() {
                return new Date(
                    scope.today.getFullYear(),
                    scope.today.getMonth(),
                    scope.today.getDate(),
                    scope.element.value.getHours(),
                    scope.element.value.getMinutes(),
                    scope.element.value.getSeconds(),
                    scope.element.value.getMilliseconds()
                );
            };

        },
        templateUrl: "templates/datetime.html"
    };

}]);
