angular.module('eat-this-one')
    .factory('pushManager', ['$window', 'messagesHandler', 'eatConfig', function($window, notifier, eatConfig) {

    return {

        // Here we register which functions will handle the notifications.
        register : function() {

            // Check if the device is already registered.
            // TODO We will need a new registration id once the app is updated.
            var registrationId = localStorage.getItem('gcmRegId');
            if (registrationId) {
                console.log('Application already registered in GCM with id: ' + registrationId);
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

    switch(e.event) {

        // Storing the registration id.
        case 'registered':

            // Storing the registration id.
            if (e.regid.length > 0) {
                localStorage.setItem('gcmRegId', e.regid);
            } else {
                console.log('Error: We can not get the registration id');
            }
            break;

        case 'message':

            // Delegated to the messages handler.
            messagesHandler.message(e.payload);
            break;

        case 'error':
            console.log('Error: Message can not be received. ' + e.msg);
            break;

        default:
            console.log('Error: Unknown event received');
            break;
    }
}

// TODO Once this is not a crappy prototype.
function apnNotificationsHandler(e) {
}
