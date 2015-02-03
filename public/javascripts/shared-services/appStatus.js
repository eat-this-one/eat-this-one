angular.module('eat-this-one')
    .factory('appStatus', function() {

    /**
     * Contains the list of actions waiting to be completed.
     *
     * Useful because sometimes we need multiple requests
     * to be completed to allow the app use.
     *
     * Calls to waiting and complete accepts now a param
     * to name the actions, otherwise they default to 'general'.
     */
    var loadingActions = [];

    return {

        waiting : function(action) {

            action = (typeof action !== 'undefined') ? action : 'general';

            $(document).ready(function() {

                if (!$('#id-body').hasClass('mask')) {
                    $('#id-body').addClass('mask');
                }

                // Disables action buttons.
                $('.md-button').addClass('disabled');

                // List the action as waiting for it.
                loadingActions.push(action);
            });
        },

        completed : function(action) {

            action = (typeof action !== 'undefined') ? action : 'general';

            $(document).ready(function() {

                // Only remove the action when there are no more loadingActions.
                loadingActions.splice(loadingActions.indexOf(action), 1);

                if (loadingActions.length === 0 && $('#id-body').hasClass('mask')) {
                    $('#id-body').removeClass('mask');
                }
                if (loadingActions.length === 0) {
                    // Enable buttons again.
                    $('.md-button').removeClass('disabled');
                }
            });
        },

        isAllCompleted : function() {
            if (loadingActions.length === 0) {
                return true;
            }
            return false;
        }
    }
});
