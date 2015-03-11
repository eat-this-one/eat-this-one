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

                // There is an issue with md-content and its display block that
                // I've spent 1 hour trying to solve. I hide the main contents
                // div until the app is ready.
                if (!$('#id-main').hasClass('mask')) {
                    $('#id-main').addClass('mask');
                    $('#id-contents').addClass('hidden');
                    $('#id-loading').removeClass('hidden');
                }

                // Disables action buttons.
                $('button').attr('disabled', 'disabled');

                // List the action as waiting for it.
                loadingActions.push(action);
            });
        },

        completed : function(action) {

            action = (typeof action !== 'undefined') ? action : 'general';

            $(document).ready(function() {

                // Only remove the action when there are no more loadingActions.
                loadingActions.splice(loadingActions.indexOf(action), 1);

                if (loadingActions.length === 0 && $('#id-main').hasClass('mask')) {
                    $('#id-main').removeClass('mask');
                    $('#id-contents').removeClass('hidden');
                    $('#id-loading').addClass('hidden');
                }
                if (loadingActions.length === 0) {
                    // Enable buttons again.
                    $('button').removeAttr('disabled');
                }
            });
        },

        isAllCompleted : function() {
            if (loadingActions.length === 0) {
                return true;
            }
            return false;
        }
    };
});
