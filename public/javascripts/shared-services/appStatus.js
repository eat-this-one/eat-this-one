angular.module('eat-this-one')
    .factory('appStatus', function() {
    return {

        waiting : function() {

            $(document).ready(function() {

                if (!$('#id-mask').hasClass('modal-backdrop')) {
                    $('#id-mask').addClass('modal-backdrop');
                    $('#id-mask').removeClass('hidden');
                }

                // Disables action buttons.
                $('.btn').addClass('btn-disabled');

            });
        },

        completed : function() {

            $(document).ready(function() {

                if ($('#id-mask').hasClass('modal-backdrop')) {
                    $('#id-mask').removeClass('modal-backdrop');
                    $('#id-mask').addClass('hidden');
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
