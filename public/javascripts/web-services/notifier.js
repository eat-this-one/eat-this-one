angular.module('eat-this-one').factory('notifier', function() {
    return {

        show : function(title, msg, type) {

            var className = '';
            if (type === 'success') {
                className = 'alert-success';
            } else if (type === 'info') {
                className = 'alert-info';
            } else if (type === 'error') {
                className = 'alert-danger';
            } else {
                return;
            }

            // Smashes the current value.
            var notification = $('#id-notification');
            notification.css('display', 'block');
            notification.addClass(className);
            notification.html(title + '<br/><br/>' + msg);

            notification.fadeIn(1000);

            // We hide it in a few secs.
            setTimeout(function() {
                notification.fadeOut(1000);

                // We need to wait until it completely fades out.
                setTimeout(function() {
                    notification.removeClass(className);
                }, 2000);
                notification.css('display', 'none');
            }, 3000);
        },

        statusBar : function(title, message, type, dishid) {
            // Not supported by the web interface.
        }

    }
});
