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
            $('#id-notification').html(msg);
            $('#id-notification').addClass(className);

            $('#id-notification').fadeIn(2000);

            // We hide it in a few secs.
            setTimeout(function() {
                $('#id-notification').fadeOut(2000);

                // We need to wait until it completely fades out.
                setTimeout(function() {
                    $('#id-notification').removeClass(className);
                }, 2000);
            }, 3000);
        }

    }
});
