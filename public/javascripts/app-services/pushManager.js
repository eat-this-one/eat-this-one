angular.module('eat-this-one')
    .factory('pushManager', ['$window', 'messagesHandler', 'notifier', 'eatConfig', function($window, messagesHandler, notifier, eatConfig) {

    return {

        // Here we register which functions will handle the notifications.
        register : function() {

            // Check if the device is already registered.
            // TODO We will need a new registration id once the app is updated.
            if (localStorage.getItem('gcmRegId') !== null) {
                return;
            }

            if (device.platform == 'android' ||
                    device.platform == 'Android' ||
                    device.platform == "amazon-fireos" ) {

                $window.plugins.pushNotification.register(
                    this.registered,
                    this.errorHandler,
                    {
                        "senderID": eatConfig.gcmSenderId,
                        "ecb": "notificationsHandler"
                    }
                );

            } else {

                // TODO Test properly as it is just a copy & paste.
                $window.plugins.pushNotification.register(
                    this.registeredAPN,
                    this.errorHandler,
                    {
                        "badge":"true",
                        "sound":"true",
                        "alert":"true",
                        "ecb":"apnNotificationsHandler"
                    }
                );
            }
        },

        registered : function(result) {
            console.log('Registered in Google Cloud Messaging: ' + result);
        },

        registeredAPN : function(result) {
            console.log('Registered in Google Cloud Messaging: ' + result);
        },

        error : function(error) {
            console.log('Error, not able to get the registration ID: ' + error);
        }
    }

}]);

function notificationsHandler(e) {

    // We inject the service here as we are out of angular init process.
    var newLogRequest = angular.injector(['ng', 'eat-this-one']).get('newLogRequest');

    switch(e.event) {

        // Storing the registration id.
        case 'registered':

            // Storing the registration id.
            if (e.regid.length > 0) {
                localStorage.setItem('gcmRegId', e.regid);
                newLogRequest('process', 'gcm-registration', e.regid);
            } else {
                newLogRequest('error', 'gcm-registration', 'no registration id');
                console.log('Error: We can not get the registration id');
            }
            break;

        case 'message':

            // Delegated to the messages handler.
            angular.injector(['ng', 'eat-this-one']).get('messagesHandler').message(e.payload);
            break;

        case 'error':
            newLogRequest('error', 'gcm-error', e.msg);
            console.log('Error: Message can not be received. ' + e.msg);
            break;

        default:
            newLogRequest('error', 'gcm-unknown');
            console.log('Error: Unknown event received');
            break;
    }
}

function apnNotificationsHandler(e) {
    // TODO Once this is not a crappy prototype.
}
