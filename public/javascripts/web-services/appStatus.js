angular.module('eat-this-one')
    .factory('appStatus', function() {
    return {

        waiting : function() {

            $(document).ready(function() {

                if (!$('#id-mask').hasClass('modal')) {
                    $('#id-mask').addClass('modal');
                }

                // Disables action buttons.
                $('.btn').addClass('btn-disabled');

            });
        },

        completed : function() {

            $(document).ready(function() {

                if ($('#id-mask').hasClass('modal')) {
                    $('#id-mask').removeClass('modal');
                }

                 // Enable buttons again.
                $('.btn').removeClass('btn-disabled');

            });
        },

        restartLoader : function() {
            // Undefined, writen just to keeping the same interface.
        }
    }
});
