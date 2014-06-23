angular.module('eat-this-one')
    .factory('appStatus', function() {
    return {

        waiting : function() {

            if (!$('#id-mask').hasClass('modal')) {
                $('#id-mask').addClass('modal');
            }

            // Disables action buttons.
            $('.btn').removeClass('btn-primary');
            $('.btn').addClass('btn-disabled');
            $('.btn').addClass('btn-disabled');
        },

        completed : function() {

            if ($('#id-mask').hasClass('modal')) {
                $('#id-mask').removeClass('modal');
            }

             // Enable buttons again.
            $('.btn').removeClass('btn-default');
            $('.btn').addClass('btn-primary');
            $('.btn').removeClass('btn-disabled');
        }
    }
});
