angular.module('eat-this-one').factory('datesConverter', function() {

    var daymillisecs = (24 * 60 * 60 * 1000);

    var now = new Date();

    var today = Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    return {

        /**
         * Returns the number of milliseconds on a day.
         */
        getDaymillisecs : function() {
            return daymillisecs;
        },

        /**
         * Converts a timestamp to a day.
         *
         * A day can be 'today', 'tomorrow' or 'aftertomorrow'.
         */
        timeToDay : function(timestamp) {

            var day = null;

            if (timestamp == today) {
                day = 'today';
            } else if (timestamp == today + daymillisecs) {
                day = 'tomorrow';
            } else if (timestamp == today + (2 * daymillisecs)) {
                day = 'aftertomorrow';
            } else {
                // Here we just return dd-mm-YYYY.
                var date = new Date(timestamp);
                day = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
            }

            return day;
        },

        timeToDayString : function(timestamp) {
            var day = this.timeToDay(timestamp);

            if (day === 'today' ||
                    day === 'tomorrow' ||
                    day === 'aftertomorrow') {
                day = $.eatLang.lang[day];
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
            }

            return timestamp;
        }
    };
});
