angular.module('eat-this-one')
    .factory('pushManager', ['$window', 'eatConfig', function($window, eatConfig) {

    return {

        // Here we register which functions will handle the notifications.
        register : function(forceUpdate) {

            // Check if the device is already registered.
            if (forceUpdate === false &&
                    localStorage.getItem('gcmRegId') !== null) {
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

            var bodyscope = angular.element('#id-body');
            bodyscope.ready(function() {
                // We inject the service here as we are out of angular init process.
                var newLogRequest = bodyscope.injector().get('newLogRequest');

                // Storing the registration id.
                if (e.regid.length > 0) {

                    var previousGcmRegId = localStorage.getItem('gcmRegId');

                    if (previousGcmRegId === null || previousGcmRegId == false) {
                        // Store it if there was nothing before.
                        localStorage.setItem('gcmRegId', e.regid);
                        newLogRequest('create', 'gcm-registration', e.regid);
                    } else if (previousGcmRegId != e.regid) {
                        // We also check that the current one is different.
                        localStorage.setItem('gcmRegId', e.regid);
                        newLogRequest('update', 'gcm-registration', e.regid);

                        // We also update the backend.
                        var updateRegIdRequest = bodyscope.injector().get('updateRegIdRequest');
                        updateRegIdRequest(e.regid);
                    } else {
                        newLogRequest('nothing', 'gcm-registration', e.regid);
                    }

                } else {
                    newLogRequest('error', 'gcm-registration', 'no registration id');
                }
            });

            break;

        case 'message':

            // Delegated to the messages handler.
            angular.element('#id-body').injector().get('messagesHandler').message(e.payload);
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
