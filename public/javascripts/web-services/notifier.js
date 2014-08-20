angular.module('eat-this-one').factory('notifier', function() {
    return {

        show : function(msg, type) {

            var className = '';
            if (type === 'success') {
                className = 'alert-success';
            } else if (type === 'info') {
                className = 'alert-info';
            } else if (type === 'error') {
                className = 'alert-danger';
            } else {
                console.log('Not supported notification type: ' + type, error);
                return;
            }

            // Smashes the current value.
            $('#id-notification').addClass(className);
            $('#id-notification').html(msg);

            $('#id-notification').fadeIn(1000);

            // We hide it in a few secs.
            setTimeout(function() {
                $('#id-notification').fadeOut(1000);

                // We need to wait until it completely fades out.
                setTimeout(function() {
                    $('#id-notification').removeClass(className);
                }, 2000);
            }, 3000);
        },

        statusBar : function(title, message, type, dishid) {
            // Not supported by the web interface.
        }

    }
});
