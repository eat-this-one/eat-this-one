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

                if (!$('#id-mask').hasClass('modal-backdrop')) {
                    $('#id-mask').addClass('modal-backdrop');
                    $('#id-mask').removeClass('hidden');
                }

                // Disables action buttons.
                $('.btn').addClass('btn-disabled');

                // List the action as waiting for it.
                loadingActions.push(action);
            });
        },

        completed : function(action) {

            action = (typeof action !== 'undefined') ? action : 'general';

            $(document).ready(function() {

                // Only remove the action when there are no more loadingActions.
                loadingActions.splice(loadingActions.indexOf(action), 1);

                if (loadingActions.length === 0 && $('#id-mask').hasClass('modal-backdrop')) {
                    $('#id-mask').removeClass('modal-backdrop');
                    $('#id-mask').addClass('hidden');
                }
                if (loadingActions.length === 0) {
                    // Enable buttons again.
                    $('.btn').removeClass('btn-disabled');
                }
            });
        }
    }
});
