angular.module('eat-this-one').factory('datesConverter', function() {

    var now = new Date();

    var today = Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    return {

        /**
         * Converts a timestamp to a day.
         *
         * A day can be 'today', 'tomorrow' or 'aftertomorrow'.
         */
        timeToDay : function(timestamp) {

            var day = null;

            if (timestamp == today) {
                day = 'today';
            } else if (timestamp == today + (24 * 60 * 60 * 1000)) {
                day = 'tomorrow';
            } else if (timestamp == today + (2 * 24 * 60 * 60 * 1000)) {
                day = 'aftertomorrow';
            } else {
                // If it is a passed event we should not arrive here
                // but let's offer an option as this app is pretty buggy
                // at the moment and we never know.
                day = 'today';
            }

            return day;
        },

        /**
         * Converts a day to a timestamp (miliseconds).
         *
         * A day can be 'today', 'tomorrow' or 'aftertomorrow'.
         */
        dayToTime : function(day) {

            var timestamp = null;
            switch (day) {
                case 'today':
                    timestamp = today;
                    break;
                case 'tomorrow':
                    timestamp = today + (24 * 60 * 60 * 1000);
                    break;
                case 'aftertomorrow':
                    timestamp = today + (2 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    timestamp = today;
                    break;
            }

            return timestamp;
        }
    }
});
